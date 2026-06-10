<?php
header('Content-Type: application/javascript;charset=utf-8');

// 获取参数
$fromCurrency = urlencode($_GET['from_money'] ?? '');
$toCurrency = urlencode($_GET['to_money'] ?? '');
$amount = $_GET['from_money_num'] ?? '';
$callback = $_GET['cb'] ?? '';

// 构建百度API URL
$url = "https://sp0.baidu.com/5LMDcjW6BwF3otqbppnN2DJv/finance.pae.baidu.com/vapi/async/v1?from_money={$fromCurrency}&to_money={$toCurrency}&from_money_num={$amount}&srcid=5293&cb={$callback}";

// 设置请求头
$options = [
    'http' => [
        'method' => 'GET',
        'header' => [
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        ]
    ]
];

$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);

// 输出响应
echo $response;