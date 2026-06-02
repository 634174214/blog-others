<?php
ini_set('date.timezone', 'Asia/Shanghai');

require_once('data/accounts.php');
require_once('data/0_infos.php');
require_once('data/gamecard.php');
require_once('data/hong_kong.php');
require_once('data/japan.php');
require_once('data/poland.php');
require_once('data/brazil.php');
require_once('data/mexico.php');
require_once('data/argentina.php');

$data = array(
    'ns1' => [
        'switch_id' => 'XTJ70870259341',
        'memory_switch' => $infos['ns1']['memory_switch'],
        'memory_switch_total' => $infos['ns1']['memory_switch_total'],
        'memory_tf' => $infos['ns1']['memory_tf'],
        'memory_tf_total' => $infos['ns1']['memory_tf_total'],
    ],
    'ns2' => [],
    // 默认的NS主机游玩使用的账户
    'account_gaming_default' => $hkGaming,
    'account‌s' => [
        'hk' => $HK,
        'jp' => $JP,
        'pl' => $PL,
        'br' => $BR,
        'mx' => $MX,
        'ar' => $AR
    ],
    'server_area' => $infos['server_area'],
    'last_update_time' => $infos['last_update_time'],
    'games_played' => $infos['games_played'],
    'game_list' => array(
        'gamecard' => $gamecard,
        'hong_kong' => $hongKong,
        'japan' => $japan,
        'poland' => $poland ,
        'brazil' => $brazil,
        'mexico' => $mexico,
        'argentina' => $argentina
    )
);
// sleep(1);
header('Content-Type: application/json; charset=utf-8');
$json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

$jsonfile = 'index.json';
// 在以下域名下 不执行生成json文件的操作
$notFilePut = [
    'ns.wubin.work'
];
// 如果不在上面的域名列表中 则保存json静态文件
if( in_array($_SERVER['HTTP_HOST'], $notFilePut) === false ) {
    // $_SERVER['HTTP_HOST'] 在http://ns.wubin.work/game-wall/server/index.php 上是 ns.wubin.work
    file_put_contents($jsonfile, $json);
}


echo $json;