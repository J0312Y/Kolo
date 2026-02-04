<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => ['api/*'],

    'allow_origin' => ['http://localhost:5173', 'http://127.0.0.1:5173'],

    'allow_origin_patterns' => [],

    'allow_hosts' => [],

    'allow_hosts_patterns' => [],

    'allow_methods' => ['*'],

    'allow_headers' => ['*'],

    'access_control_allow_credentials' => true,
];
