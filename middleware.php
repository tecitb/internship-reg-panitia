<?php
// Application middleware

// e.g: $app->add(new \Slim\Csrf\Guard);
$app->add(new \Tuupola\Middleware\JwtAuthentication([
    "path" => "/register",
    //"ignore" => ["/board/welcoming", "/ui"],
    "secret" => $app->getContainer()->get('settings')['jwt']["secret"],
    "algorithm" => ["HS256"],
    "attribute" => "jwt",
    "cookie" => $app->getContainer()->get('settings')['jwt']["cookie_name"],
    "secure" => false,
    "error" => function ($response, $arguments) {
        $data["status"] = "error";
        $data["message"] = $arguments["message"];
        return $response->withRedirect(BASE_URL.'/consent', 302);
    }
]));