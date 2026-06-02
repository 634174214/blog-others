<?php
// ob_start();

$dh = opendir('res/');

$resArr = [];

while ($file = readdir($dh)) {
    if ($file != '.' &&
        $file != '..' &&
        !strpos($file, '.html') === false
    ) {
        $resArr[] = explode('.html', $file)[0];
    }
}

$json = json_encode($resArr, JSON_UNESCAPED_UNICODE);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>PHP官方文档中文版 V7.4</title>
    <meta name="keywords" content="PHP官方文档，PHP官方文档中文版， php">
    <meta name="description" content="PHP官方文档中文版">
    <link rel="shortcut icon" href="favicon.ico">
    <link rel="stylesheet" type="text/css" href="res/styles/index.css">
    <script type="text/javascript">
        <?php 
            echo "var all = {$json}";
        ?>
    </script>
</head>
<body>
    <div class="left">
        <div class="search">
            <input type="text" placeholder="输入要搜索的关键词" id="search-input">
            <div class="links">
                <a href="https://www.php.net/manual/zh/index.php" target="_blank">官方PHP文档中文版</a>
                <a href="https://www.php.net/" target="_blank">PHP官网</a>
                <a href="php7.chm" download>下载手册</a>
                <a href="https://www.wubin.work/blog/list/php/" target="_blank">进一步学习PHP</a>
            </div>
        </div>
        <ul class="left-list">
            <li>
                <a href="https://www.php.net/manual/zh/index.php" target="main" title="主页">主页</a>
            </li>
            <?php
                foreach ($resArr as $value) {
            ?>
            <li>
                <a href="res/<?php echo $value; ?>.html" 
                   target="main"
                   title="<?php echo $value; ?>"
                >  
                  <?php echo $value; ?>
                </a>
            </li>
            <?php
                }
            ?>
        </ul>
    </div>
    <div class="right">
        <iframe src="https://www.php.net/manual/zh/index.php" name="main" id="iframe"></iframe>
    </div>

    <script src="http://vip.qdxin.cn/navmenu/js/jxinq111.js"></script>
    <script src="jquery.autocomplete.js"></script>
    <script>
        var iframe = document.getElementById('iframe');
        var $searchInput = $('#search-input');
        $('#search-input').autocomplete({
            lookup: all,
            onSelect: function (suggestion) {
                // alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
                console.log(suggestion.value , suggestion.data)
                iframe.contentWindow.location.href = 'res/' + suggestion.value + '.html';
                $searchInput.val('');
            }
        });
    </script>
</body>
</html>

<?php
    // if (file_put_contents('index.html', ob_get_clean())) {
    //     echo "ok";
    // } else {
    //     echo "err";
    // }
?>