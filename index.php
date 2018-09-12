<?php
/**
 * Slim framework entrypoint
 */

use Slim\Views\PhpRenderer;
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
require 'vendor/autoload.php';

header("X-Env-Hostname: ".gethostname());

define("BASE_URL", getenv("BASE_URL") ?: "https://localhost/internship-reg-panitia");
define("INA_BASE_URL", getenv("INA_BASE_URL") ?: "https://login.itb.ac.id");

$dotenv = new Dotenv\Dotenv(dirname('.'));
$dotenv->load();

// Instantiate the app
$settings = require __DIR__ . '/settings.php';
$app = new \Slim\App($settings);


// Set up dependencies
require __DIR__ . '/dependencies.php';
require __DIR__ . '/middleware.php';

// Load routes
require_once __DIR__ . '/routes.php';

/**
 * Home view
 */
$app->get('/', function ($request, $response, $args) {
    return $this->withRedirect(BASE_URL."/consent");
});

$app->run();
