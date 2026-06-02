<?php
// 去掉chm文件生成的html中的广告元素
$dh = opendir('jq/');
while ($file = readdir($dh)) {
    if ($file != '.' &&
        $file != '..' &&
        !strpos($file, '.html') === false
    ) {
        // echo $file;
        // echo "<br>";
        getContent($file);
    }
}
echo "all done";


function getContent($file) {
    $path = 'jq/' . $file;
    $newPath = 'new/' . $file;
    $content = file_get_contents($path);


    $replace1 = '<div id="tips-con" data-key="close-update801" style="display: block"><div id="tips-body" class="tips-body">推荐办理招商信用卡，新户首刷礼，五折享美食，需要的速度围观~<a href="http://www.cuishifeng.cn/go/card" target="_blank">click here</a></div></div>';
    $replace2 = '<h1>jQuery API 3.2.1 速查表&nbsp;&nbsp;--作者：<a href="http://www.cuishifeng.cn" target="_blank" id="top-author">Shifone</a> <a class="source" target="_blank" href="http://jquery.cuishifeng.cn/source.html">源码下载</a></h1>';
    $replace3 = '<li class="has-submenu"><a class="menu-title" href="http://runjs.cn/code/agukaw1z"><i class="fa fa-bug"></i> <span class="nav-label">jQuery代码在线调试</span></a></li>';
    $replace4 = '源码下载';
    $replace5 = '<li><a href="http://www.cuishifeng.cn/go/card">信用卡优惠</a></li>';
    $replace6 = '<script>"use strict";document.querySelector("#f-author").href.indexOf("cuishifeng.cn")<0&&(window.location.href="http://jquery.cuishifeng.cn");</script>';
    $replace7 = '<meta name="author" content="Shifone -http://jquery.cuishifeng.cn">';
    $replace8 = '<link rel="shortcut icon" href="../../../../images/favicon.ico">';


    $ti2 = '<h1>jQuery API 3.2.1 速查表<a class="source" target="_blank" href="https://www.wubin.work">逛逛主站</a></h1>';
    $ti8 = '<link rel="shortcut icon" href="favicon.ico">';

    $content = str_replace($replace1, '', $content);
    $content = str_replace($replace3, '', $content);
    $content = str_replace($replace2, $ti2, $content);

    $content = str_replace($replace4, '', $content);
    $content = str_replace($replace5, '', $content);
    $content = str_replace($replace6, '', $content);
    $content = str_replace($replace7, '', $content);
    $content = str_replace($replace8, $ti8, $content);


    // echo $content;

    file_put_contents($newPath, $content);

    // echo "done<br>";
}


