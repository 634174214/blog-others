<?php
// 获取并生成底部热点资讯
require('common.php');

$targetPath = "{$PATH_APP}ssi/bottom-news.html";
$articleApi = 'http://blog.local/api/blog/1';

$recommendOriginPath = "{$PATH_APP}ssi/recommend-bottom-origin.html";
$recommendTargetPath = "{$PATH_APP}ssi/recommend-bottom.html";
// 接口总共返回10条信息，只生成8条
$maxLens = 8;

$recommendBottom = file_get_contents($recommendOriginPath);
$recommendReplace = '<!--#include file="bottom-news.html"-->';

if (!$json = @file_get_contents($articleApi)) {
    exit('数据获取失败');
}

$jsonArr = json_decode($json, true);
if (!($jsonArr['error'] == 0)) {
    exit('error不为0');
}

$news = $jsonArr['data'];

$html = '';

foreach ($news as $key => $item) {
   if ($key > $maxLens - 1) {
       break;
   }
   $url = "https://634174214.github.io/blog/articles/{$item['id']}/";
   $li = "
        <li>
            <a href=\"{$url}\" target=\"_blank\" title=\"{$item['title']}\">
                {$item['title']} [ {$item['channel']} ]
            </a>
        </li>
   ";
   $html .= $li;
}


$html = str_replace($recommendReplace, $html, $recommendBottom);


if (file_put_contents($recommendTargetPath, $html)) {
    echo "文章生成成功";
} else {
    exit('文章生成失败');
}

