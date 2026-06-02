<?php
require('common.php');
require('data.php');

// 是否使用icon的压缩路径
$useIconZip = @$_GET['useiconzip'];

$html = '';
foreach ($data as $item) {
    $rows = getDataRows($item['list'], $labels, $useIconZip);

    $part = "
        <div class=\"part\" id=\"{$item['id']}\" data-title=\"{$item['title']}\">
            <h2 class=\"has_link\">
                <strong>
                    {$item['title']}
                </strong>
            </h2>
            <div class=\"items\">
                {$rows}
            </div>
        </div>
    ";

    $html .= $part;
}

// 拼接外链广告
$contentLinkto = getBottomLinkto($link_bottom);
$html .= $contentLinkto;

if (file_put_contents($PATH_SSI_LINKS, $html)) {
    echo "主要数据生成成功";
} else {
    echo "主要数据生成失败";
}



function getBottomLinkto($linktoArr) {
    if (count($linktoArr) <= 0) {
        return '<div class="content-linkto"></div>';
    }
    $html = '';
    foreach ($linktoArr as $key => $link) {
        // 默认第一个广告图始终显示 其他的隐藏
        $clsHide = 'hide';
        if ($key == 0) {
           $clsHide = '';
        }
        $tpl = "
            <a href=\"{$link['href']}\" 
               target=\"_blank\" class=\"{$clsHide}\"
            >
                <img src=\"{$link['img']}\" alt=\"{$link['alt']}\">
            </a>
        ";
        $html .= $tpl;
    }
    $linkto = "
        <div class=\"content-linkto\">
            {$html}
        </div>
    ";
    return $linkto;
}

function getDataRows($rows = [], $labels = [], $useIconZip = false) {
    // 图片的icon路径
    $PATH_ICON = 'img';
    $PATH_ICON_ZIP = 'img-zip';

    $imgpath = $useIconZip ? $PATH_ICON_ZIP : $PATH_ICON;
    
    $str = '<div class="row">';
    foreach ($rows as $rowIndex => $row) {
        $labelName = '';

        if (isset($row['label']) && !empty($row['label'])) {
            $rowLabel = $row['label'];
            $labelName = "[{$labels[$rowLabel]['name']}] ";
        }
        
        $col = "
            <div class=\"col-xs-6 col-sm-4 col-md-2\">
                <div class=\"item\">
                    <a href=\"{$row['url']}\" 
                       target=\"_blank\"
                       title=\"{$row['desc']}\"
                    >
                        <img src=\"{$imgpath}/{$row['icon']}\" alt=\"{$row['name']}\">
                        <h3>
                            {$row['name']}
                        </h3>
                        <p>
                            {$labelName}{$row['desc']}
                        </p>
                    </a>
                </div>
            </div>
        ";
        $str .= $col;
    }
    $str .= '</div>';

    return $str;
}