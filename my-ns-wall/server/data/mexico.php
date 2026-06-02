<?php
# 墨西哥区数字版
$mexico = [
    [
        'cn_name' => '海贼无双3豪华版',
        'en_name' => 'ONE PIECE Pirate Warriors 3 Deluxe Edition',
        'type' => 'digital',
        'area' => '美区',
        'is_dlc' => false,
        'preview' => 'server/previews/mexico/1.jpg',
        'price_buy' => 87.48,
        'price_origin' => 729,
        'discount' => '-88%',
        'bug_date' => '2024-12-03',
        // 备注
        'notes' => '',
        'ns1_ok' => true,
        'ns2_ok' => true,
        'virtual_card_out' => false,
        'game_delete' => false,
        'lended' => false,
        'lended_to' => '',
        'lended_date' => '',
        'installed_on' => 'nintendo switch 1',
    ],
    [
        'cn_name' => '灵落',
        'en_name' => 'Spiritfall',
        'type' => 'digital',
        'area' => '美区',
        'is_dlc' => false,
        'preview' => 'server/previews/mexico/2.jpg',
        'price_buy' => 91.19,
        'price_origin' => 227.99,
        'discount' => '-60%',
        'bug_date' => '2025-12-13',
        // 备注
        'notes' => '又名：降灵',
        'ns1_ok' => true,
        'ns2_ok' => true,
        'virtual_card_out' => false,
        'game_delete' => false,
        'lended' => false,
        'lended_to' => '',
        'lended_date' => '',
        'installed_on' => 'nintendo switch 1',
    ],
    [
        'cn_name' => '神之亵渎 2：我之罪',
        'en_name' => 'Blasphemous 2 - Mea Culpa Edition',
        'type' => 'digital',
        'area' => '美区',
        'is_dlc' => false,
        'preview' => 'server/previews/mexico/3.jpg',
        'price_buy' => 204,
        'price_origin' => 600,
        'discount' => '-66%',
        'bug_date' => '2026-02-12',
        // 备注
        'notes' => '渎神2本体 + 孽刃DLC 合集版',
        'ns1_ok' => true,
        'ns2_ok' => true,
        'virtual_card_out' => false,
        'game_delete' => false,
        'lended' => false,
        'lended_to' => '',
        'lended_date' => '',
        'installed_on' => 'nintendo switch 1',
    ]
];

$label = 'mexico';
foreach($mexico as $key => $item) {
    $mexico[$key]['id'] = "{$label}_{$key}";
}