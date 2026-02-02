return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:5173',  // Frontend Vite
        'http://192.168.*.*:5173'  // Mobile testing
    ],
    'allowed_origins_patterns' => ['http://192\.168\.\d+\.\d+:5173'],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];