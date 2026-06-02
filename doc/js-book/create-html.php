<?php
// PHP解析MARKDOWN文件 https://github.com/erusev/parsedown/blob/1.7.x/composer.json
// 案例 https://www.jianshu.com/p/cbe0115a6a44
include 'Parsedown.php';
$dir = 'JS高级程序设计-读书笔记/';
$htmlDir = 'html/';


function md2html($title = '', $file = '')
{
    $parser = new Parsedown();
    $markdown = file_get_contents($file);
    $main = $parser->text($markdown);
    $html = "
        <html>
        <head>
            <meta http-equiv=\"Content-type\" content=\"text/html; charset=utf-8\" />
            <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\">
            <title>{$title}</title>
            <meta name=\"keywords\" content=\"JS高级设计第四版\">
            <meta name=\"description\" content=\"JS高级设计第四版，读书笔记- {$title}\">
            <link rel=\"stylesheet\" type=\"text/css\" href=\"markdown.css\">
            <script src=\"https://www.qdxin.cn/js/xinquery.js\"></script>
        </head>
        <body>
            {$main}
        </body>
        </html>
    ";
    
    
    return $html;
    
}

function createHome($arr)
{
    $lis = "";
    $firstpath = $arr[0]['htmlpath'];
    for ($i = 0; $i < count($arr); $i++) { 
        if($i == 0) {
            $cls = 'class="active"';
        } else {
            $cls = '';
        }
        $li = "
            <li {$cls}>
                <a href=\"{$arr[$i]['htmlpath']}\" target=\"main\">
                    {$arr[$i]['htmltitle']}
                </a>
            </li>
        ";
        $lis .= $li;
    }

    $html = "
        <html>
        <head>
            <meta http-equiv=\"Content-type\" content=\"text/html; charset=utf-8\" />
            <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\">
            <title>JS高级设计第四版笔记-By杨</title>
            <meta name=\"keywords\" content=\"JS高级设计第四版\">
            <meta name=\"description\" content=\"JS高级设计第四版，读书笔记\">
            <style>
                *{padding: 0;margin: 0;}
                .left{position: fixed;top: 0;bottom: 0;left: 0;width: 300px;background-color: #f2f2f2;padding: 0px 0 20px;overflow-y: auto;}
                .left ul{padding-left: 0;border-top: 10px solid #7cdcab;}
                .left ul li{list-style: none;}
                .left a{display: block;padding: 15px 15px;padding-left: 8px;text-indent: 1em;text-decoration: none;font-size: 14px;color: #000;}
                .left a:hover{background-color: #e6e6e6;}
                .left ul li.active{border-left: 8px solid #1b7cda;}
                .left ul li.active a{padding-left: 0;}
                .right{position: fixed;top: 0;bottom: 0;left: 300px;right: 0;padding: 20 0 0px 20px;}
                iframe{width: 100%;height: 100%;}
            </style>
        </head>
        <body>
            <div class=\"left\" id=\"left\">
                <ul>
                    {$lis}
                </ul>
            </div>
            <div class=\"right\">
                <iframe src=\"{$firstpath}\" frameborder=\"0\" name=\"main\"></iframe>
            </div>
        
            <script src=\"https://www.qdxin.cn/js/xinquery.js\"></script>
            <script>
                $('#left').on('click', 'li', function() {
                    $(this).siblings().removeClass('active');
                    $(this).addClass('active');
                })
            </script>
        </body>
        </html>
    ";

    file_put_contents('index.html', $html);
}

$final = [];
$i = 0;

if (is_dir($dir)) {
    if ($dh = opendir($dir)) {
        while (($file = readdir($dh)) !== false) {
            if($file != '.' && $file != '..') {
                // 文件名
                $filename = explode('.', $file)[0];
                // 文件路径
                $filePath = "{$dir}/{$file}";
                // 转换的内容
                $mdHtml = md2html($filename, $filePath);
                // 生成的html文件名
                $htmlFilename = "{$htmlDir}/{$filename}.html";

                $final[$i]['htmltitle'] = $filename;
                $final[$i]['htmlpath'] = $htmlFilename;
                // 章
                $pattern = '/\d+/';
                preg_match($pattern, $filename, $match);
                $label = $match[0];
                $final[$i]['label'] = $label;
                $i++;

                // 导出html文件
                file_put_contents($htmlFilename, $mdHtml);
            }
            
        }
        closedir($dh);
    }
}

// 按照label排序 升序自定义排序 根据label排序
usort($final, function($aItem, $bItem) {
    $a = $aItem['label'];
    $b = $bItem['label'];
    if($a == $b) {
        return 0;
    }
    if($a > $b) {
        return 1;
    }
    if($a < $b) {
        return -1;
    }
});
// var_dump($final);
// echo "<br>";

createHome($final);

?>