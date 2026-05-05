<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$req = \Illuminate\Http\Request::create('/builder/products/cpu', 'GET', ['platform' => 'AM5']);
$response = $kernel->handle($req);
echo "Status: " . $response->getStatusCode() . "\n";
echo "Content: " . $response->getContent() . "\n";
