<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$req = \Illuminate\Http\Request::create('/builder/products/cooler', 'GET', ['platform' => 'AM5']);
$response = $kernel->handle($req);
echo "COOLER AM5 COUNT: " . count(json_decode($response->getContent())) . "\n";
