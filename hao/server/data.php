<?php
// 引入底部链接数据的设置
require('data-link-bottom.php');

// 标签合集
$labels = [
    'idea' => [
        'name' => '灵感',
        'label' => 'idea',
        'num' => 0
    ],
    'sucai' => [
        'name' => '素材',
        'label' => 'sucai',
        'num' => 1
    ],
    'font' => [
        'name' => '字体',
        'label' => 'font',
        'num' => 2
    ],
    'art' => [
        'name' => '艺术',
        'label' => 'art',
        'num' => 3
    ],
    'tuku' => [
        'name' => '图库',
        'label' => 'tuku',
        'num' => 4
    ],
    'teach' => [
        'name' => '教程',
        'label' => 'teach',
        'num' => 5
    ],
    'ui' => [
        'name' => 'UI',
        'label' => 'ui',
        'num' => 6
    ],
    'demo' => [
        'name' => '案例',
        'label' => 'demo',
        'num' => 7
    ],
    'frame' => [
        'name' => '框架',
        'label' => 'frame',
        'num' => 8
    ],
    'design' => [
        'name' => '设计',
        'label' => 'design',
        'num' => 9
    ],
    'code' => [
        'name' => '开发',
        'label' => 'code',
        'num' => 10
    ],
    'front' => [
        'name' => '前端',
        'label' => 'front',
        'num' => 11
    ],
    'download' => [
        'name' => '下载',
        'label' => 'download',
        'num' => 12
    ],
    'video' => [
        'name' => '视频',
        'label' => 'video',
        'num' => 13
    ], 
    'serve' => [
        'name' => '服务',
        'label' => 'serve',
        'num' => 14
    ], 
];

// 设置图标的基本拼接路径
$designBase = 'design/';
$codeBase = 'code/';
$zongheBase = 'zonghe/';
$blogBase = 'blog/';
$toolBase = 'tool/';

$data = [];

// 将数组合并 并随机获取推荐的链接
$allData = [];
// $allData = array_merge($design['list'], $code['list']);

// 循环遍历data文件夹下所有文件并require
$handler = opendir('data/');
while( ($filename = readdir($handler)) !== false ) 
{
 //略过linux目录的名字为'.'和‘..'的文件
 if($filename != '.' && $filename != '..')
 {  
    // 拼接路径
    $filePath = "data/{$filename}";
    require($filePath);
    
    $pattern = "/[\d]+-data-[\w]+/i";
    preg_match($pattern, $filename, $match);
    $varStr = (isset($match) && !empty($match)) ? $match[0] : false;
    if ($varStr) {
        // 将文件名1-data-design拆分
        $varArr = explode('-data-', $varStr);
        $varIndex = $varArr[0];
        $varname = $varArr[1];
        // 将变量名称赋值到data中 比如$data['life'] = $life;
        $data[$varname] = ${$varname};
        $data[$varname]['index'] = $varIndex;

        // 将数据中list部分添加入进行合并
        $allData = array_merge($allData, ${$varname}['list']);
    }
  }
}



$recommend = getRandArrItems($allData, 18);

$data['hot'] = [
    // 索引 排序的依据
    'index' => 0,
    'title' => '热门酷站',
    'id' => 'hot',
    'list' => $recommend
];


// 对data数组进行排序
$data = array_sort($data, 'index');