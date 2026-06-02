<?php
ob_start();
?>

<!DOCTYPE html>
<html>
    
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no"/>
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta http-equiv="Expires" content="-1">
        <meta http-equiv="Pragma" content="no-cache">
        <meta http-equiv="Cache-control" content="no-cache">
        <meta http-equiv="Cache" content="no-cache">
        <title>
            好工人网址导航-全面的开发和设计网址导航
        </title>
        <meta content="专门为打工人而做的综合导航网站！为广大设计开发从业者提供专业的UI设计、设计教程、素材下载、高清图库、配色方案、App设计开发、前端后端开发等网站导航指引。" name="description" />
        <meta content="设计导航,设计网站,开发网站,设计师网站导航,设计师网址导航,开发者网址导航,设计师导航,UI设计,ps教程,设计教程,优秀网页设计,前端开发,后端开发,素材下载,用户体验" name="Keywords" />
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
        <link rel="stylesheet" href="font/font-awesome-4.7.0/css/font-awesome.min.css"/>
        <link rel="stylesheet" href="css/styles.min.css"/>
    </head>
    
    <body class="body-home body-website">
        <?php
            require('ssi/header.html');
            require('ssi/header-bar.html');
        ?>
        

        <div class="header-recommend"></div>
        <div class="content">
            <div class="container">
                <div class="row">
                    <div class="col-md-1 sidebar">
                        <div class="content-sidebar ">
                            <dl id="goto">
                            </dl>
                        </div>
                    </div>
                    <div class="col-md-11">
                        <?php
                            require('ssi/main-links.html');
                        ?>
                    </div>
                    <!-- main end -->
                </div>
            </div>
        </div>
       
        <?php
            require('ssi/recommend-bottom.html');
            require('ssi/footer.html');
            require('ssi/fixed-bar.html');
        ?>

        <script src="js/jquery.js"></script>
        <script src="js/run.min.js"></script>
    </body>

</html>

<?php
// 取出缓冲区全部内容
$html = ob_get_contents();

// 把内容写入 index.html
file_put_contents('index.html', $html, LOCK_EX);

// 输出内容到浏览器（正常访问页面）
ob_end_flush();
?>