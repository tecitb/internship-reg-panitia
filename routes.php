<?php
use Slim\Views\PhpRenderer;
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \Firebase\JWT\JWT;

/**
 * Consent page
 */
$app->get('/consent', function ($request, $response, $args) {
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

    return $response->withRedirect(BASE_URL . '/consent');
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

    if(empty($mhsName)) return $response->withRedirect(BASE_URL.'/consent');

    $nims = explode(",", str_replace(array(" ", "[", "]"), array("", "", ""), $mhsNIM));

    $settings = $this->get('settings'); // get settings array.

    $token = JWT::encode([
        'name' => $mhsName,
        'email' => $emailNonITB,
        'email_itb' => $emailITB,
        'nim' => $nims,
        'ou' => $ou
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

    $this->renderer->render($response, "/header.php", $args);
    $this->renderer->render($response, "/register.php", $param);
    return $this->renderer->render($response, "/footer.php", $args);
});
