<?php
$PATH_APP = str_replace('server', '', __DIR__);
$PATH_APP = str_replace('\\', '/', $PATH_APP);

$PATH_SSI_LINKS = "{$PATH_APP}ssi/main-links.html";


// 从指定数组中 获取指定个数 再组成新数组
function getRandArrItems($arr, $length = 18) {
    shuffle($arr);
    $result = array_slice($arr, 0, $length);
    return $result;
}

/**
 * [array_sort 多维数组按照某一键值排序函数]
 * @Author   wubin
 * @DateTime 2022-11-15T10:20:19+0800
 * @param    [array]                   $array [为要排序的数组]
 * @param    [string]                  $keys  [为要用来排序的键名]
 * @param    string                    $type  [默认为升序排序]
 * @return   [array]                          [返回排序好的数组]
 */
function array_sort($array, $keys, $type = 'asc'){
    $keysvalue = $new_array = array();
    foreach ($array as $k=>$v){
        $keysvalue[$k] = $v[$keys];
    }

    if($type == 'asc'){
        asort($keysvalue);
    }else{
        arsort($keysvalue);
    }
    reset($keysvalue);

    foreach ($keysvalue as $k=>$v){
        $new_array[$k] = $array[$k];
    }

    return $new_array;
}