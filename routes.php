<?php
use Slim\Views\PhpRenderer;
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \Firebase\JWT\JWT;

/**
 * Consent page
 */
$app->get('/consent', function ($request, $response, $args) {
    if(!empty(@$request->getParam("error")))
        $args['error'] = $request->getParam("error");

    $this->renderer->render($response, "/header.php", $args);
    $this->renderer->render($response, "/consent.php", $args);
    return $this->renderer->render($response, "/footer.php", $args);
});

/**
 * Consent POST
 */
$app->post('/consent', function ($request, $response, $args) {
    /** @var \Slim\Http\Response $response */
    if($request->getParam("consent") == "1") {
        return $response->withRedirect(INA_BASE_URL."/cas/login?service=".rawurlencode(BASE_URL . "/ina/propagate"));
    } else {
        return $response->withRedirect(BASE_URL . '/consent');
    }
});

/**
 * Reset form
 */
$app->post('/reset', function ($request, $response, $args) {
    /** @var \Slim\Http\Response $response */
    $settings = $this->get('settings'); // get settings array.

    setcookie($settings['jwt']['cookie_name'], "", 1, '/');

    return $response->withRedirect(INA_BASE_URL.'/cas/logout?service=' . rawurlencode(BASE_URL . '/consent'));
});

$app->get('/ina/propagate', function (Request $request, Response $response, array $args) {
    $ticket = $request->getParam('ticket');

    $url = "https://login.itb.ac.id/cas/serviceValidate?ticket=$ticket&service=".rawurlencode(BASE_URL . "/ina/propagate");

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, false);
    curl_setopt($ch, CURLOPT_HTTPGET, 1);
    $raw = curl_exec($ch);

    $xml = new \SimpleXMLElement($raw);
    $xml->registerXPathNamespace('cas', 'http://www.yale.edu/tp/cas');

    foreach($xml->xpath('//cas:authenticationSuccess') as $event) {
        $mhsName = (string) ($event->xpath('//cas:attributes/cas:cn')[0]);

        $xp1 = $event->xpath('//cas:attributes/cas:itbNIM');
        $mhsNIM = (string) end($xp1);
        $emailITB = (string) ($event->xpath('//cas:attributes/cas:mail')[0]);
        $emailNonITB = (string) ($event->xpath('//cas:attributes/cas:itbEmailNonITB')[0]);
        $ou = (string) ($event->xpath('//cas:attributes/cas:ou')[0]);
    }

    // If INA fails, redirect away
    if(empty($mhsName)) return $response->withRedirect(BASE_URL.'/consent?error=INA_LOGIN_FAILED');

    $nims = explode(",", str_replace(array(" ", "[", "]"), array("", "", ""), $mhsNIM));

    // Check if Panitia exists on the registry
    $db = $this->get('db');

    $q = "SELECT * FROM `panitia_registry` WHERE `nim`=:nim1 OR `nim`=:nim2";
    $stmt = $db->prepare($q);
    $stmt->execute([
        ':nim1' => $nims[0],
        ':nim2' => (count($nims) > 1) ? $nims[1] : $nims[0]
    ]);

    $panitia = $stmt->fetch(PDO::FETCH_ASSOC);

    // If panitia is not on registry, redirect away
    if($panitia===false) return $response->withRedirect(BASE_URL.'/consent?error=NOT_IN_REGISTRY');

    // Check if Panitia is registered
    $q = "SELECT nim FROM users WHERE nim=:nim";
    $stmt = $db->prepare($q);
    $stmt->execute([
        ':nim' => end($nims)
    ]);

    if($stmt->rowCount() > 0) return $response->withRedirect(BASE_URL.'/consent?error=USER_REGISTERED');

    $settings = $this->get('settings'); // get settings array.

    $token = JWT::encode([
        'name' => $mhsName,
        'email' => $emailNonITB,
        'email_itb' => $emailITB,
        'nim' => $nims,
        'ou' => $ou,
        'tec_regno' => $panitia['tec_regno'],
        'team' => $panitia['team']
    ], $settings['jwt']['secret'], "HS256");

    setcookie($settings['jwt']['cookie_name'], $token, 0, '/');

    return $response->withRedirect(BASE_URL.'/register/form'); //$response->withJson(["name" => $mhsName, "nim" => $nims, "ou" => $ou, "emailITB" => $emailITB, "emailNonITB" => $emailNonITB]);
});

/**
 * Registration form
 */
$app->get('/register/form', function ($request, $response, $args) {
    /** @var \Slim\Http\Request $request $jwt */
    $jwt = $request->getAttribute("jwt");

    $param['nama'] = $jwt['name'];
    $param['email'] = $jwt['email'];
    $param['nim'] = end($jwt['nim']);
    $param['ou'] = $jwt['ou'];
    $param['tec_regno'] = $jwt['tec_regno'];

    $this->renderer->render($response, "/header.php", $args);
    $this->renderer->render($response, "/register.php", $param);
    return $this->renderer->render($response, "/footer.php", $args);
});

/**
 * Registration form
 */
$app->post('/register/do', function ($request, $response, $args) {
    /** @var \Slim\Http\Request $request $jwt */
    $jwt = $request->getAttribute("jwt");

    $param['nama'] = $jwt['name'];
    $param['email'] = $jwt['email'];
    $param['nim'] = end($jwt['nim']);
    $param['ou'] = $jwt['ou'];

    $name = $jwt['name'];
    $email = $request->getParam('email') ?: $jwt['email'];
    $nim = end($jwt['nim']);

    if(filter_var($email, FILTER_VALIDATE_EMAIL) === FALSE) {
        $error = ['error' => ['text' => "$email is not a valid email address"]];
        return $response->withJson($error);
    }

    $password = password_hash($request->getParam('password'), PASSWORD_DEFAULT);
    $created_at = date("Y-m-d H:i:s");
    $lunas = 1;

    $verified = md5(uniqid(rand(),true));
    $isAdmin = ($jwt['role'] == 1 || $jwt['role'] == 2) ? 1 : 0;

    $sql = "INSERT INTO `users`
          (`name`, `email`, `password`, `nim`, `created_at`, `lunas`, `verified`, `isAdmin`, `interests`, `nickname`, `about_me`, `line_id`, `instagram`, `mobile`, `tec_regno`, `address`, `role`)
          VALUES (:name,:email,:password,:nim,:created_at,:lunas,:verified, :isAdmin, :interests, :nickname, :about_me, :line_id, :instagram, :mobile, :tec_regno, :address, :role)";

    /* Informational fields */
    $interests = $request->getParam("interests", '');
    $nickname = $request->getParam("nickname", '');
    $aboutMe = $request->getParam("about_me", '');
    $lineId = $request->getParam("line_id", '');
    $instagram = $request->getParam("instagram", '');
    $mobile = $request->getParam("mobile", '');
    $address = $request->getParam("address", '');

    $tecRegNoStr = $jwt['tec_regno'];
    try {
        $db = $this->get('db');

        $q = "SELECT nim FROM users WHERE nim=:nim OR email=:email";
        $stmt = $db->prepare($q);
        $stmt->execute([
            ':email' => $email,
            ':nim' => $nim
        ]);

        if($stmt->rowCount() > 0)
            return $response->withJson(['error' => ['text' => "User already exists"]]);

        $db->beginTransaction();

        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':password' => $password,
            ':nim' => $nim,
            ':created_at' => $created_at,
            ':lunas' => $lunas,
            ':verified' => $verified,
            ':isAdmin' => $isAdmin,
            ':interests' => $interests,
            ':nickname' => $nickname,
            ':about_me' => $aboutMe,
            ':line_id' => $lineId,
            ':instagram' => $instagram,
            ':mobile' => $mobile,
            ':tec_regno' => $tecRegNoStr,
            ':address' => $address,
            ':role' => $jwt['team']+10  // Role definition is team no + 10
        ]);

        $user_id = $db->lastInsertId();

        $db->commit();


        return $this->response->withJson(['id' => $user_id]);
    } catch (PDOException $e) {
        $db->rollBack();
        $msg = $e->getMessage();
        if (strpos($e->getMessage(), 'Duplicate entry') !== FALSE) {
            $msg = "User already exists";
        }
        $error = ['error' => ['text' => $msg]];
        return $response->withJson($error);
    }
});