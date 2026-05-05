<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$query = \App\Models\Category::where('slug', 'cooler')->first()->products()->where(function($q) {
    $q->whereJsonContains('specs->socket', 'AM5')
      ->orWhereJsonContains('specs->socket_support', 'AM5')
      ->orWhere('specs->socket', 'like', '%AM5%')
      ->orWhere('specs->socket_support', 'like', '%AM5%');
});

echo $query->toSql();
