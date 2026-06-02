<?php
$infos = [
    'ns1' => [
        // switch本机还剩下多少内存 单位G
        'memory_switch' => 26.1,
        // switch总内存
        'memory_switch_total' => 64,
        // tf卡还剩下多少内存
        'memory_tf' => 411, 
        // tf卡总内存
        'memory_tf_total' => 954
    ],
    'ns2' => [
        // switch本机还剩下多少内存 单位G
        'memory_switch' => 0,
        // switch总内存
        'memory_switch_total' => 0,
        // tf卡还剩下多少内存
        'memory_tf' => 0, 
        // tf卡总内存
        'memory_tf_total' => 0
    ],
    // 信息最后更新时间
    'last_update_time' => date('Y-m-d H:i:s', filemtime(__FILE__)),
    // 各个区服汇率以及货币单位
    'server_area' => [
        array(
            'label' => 'hong_kong',
            'cn' => '香港',
            'money_unit' => 'HKD',
            // 汇率比例 人民币1元 : 港币1.07 (1元可兑换1.07港币)
            'exchange_rate' => '1:1.07'
        ),
        array(
            'label' => 'japan',
            'cn' => '日本',
            'money_unit' => 'JPY',
            'exchange_rate' => '1:20'
        ),
        array(
            'label' => 'poland',
            'cn' => '波兰',
            'money_unit' => 'ZTL',
            'exchange_rate' => '1:0.55'
        ),
        array(
            'label' => 'brazil',
            'cn' => '巴西',
            'money_unit' => 'BRL',
            'exchange_rate' => '1:0.7425'
        ),
        array(
            'label' => 'mexico',
            'cn' => '墨西哥',
            'money_unit' => 'MXN',
            'exchange_rate' => '1:2.4941'
        ),
        array(
            'label' => 'argentina',
            'cn' => '阿根廷',
            'money_unit' => 'Gold Point',
            'exchange_rate' => '26:1154'
        ),
        array(
            'label' => 'gamecard',
            'cn' => '卡带',
            'money_unit' => 'RMB',
            'exchange_rate' => '1:1'
        )
    ],
    // 已经完过那些游戏 不一定必须封盘 有耐心玩过的存档即可 填入中文名即可 使用indexof进行匹配
    'games_played' => [
        // 阿根廷
        '哈迪斯',
        '蒸汽世界大劫掠2',
        '暗黑破坏神3',
        // 巴西
        '武士 零',
        '星界战士',
        '双截龙外传',
        'DNF',
        '生化危机6',
        '忍者印记',
        // 游戏卡
        '狙击精英3',
        '马力欧足球：激战前锋',
        '舞力全开2022',
        'NBA 2K19',
        '动物森友会',
        '马里奥U',
        '贝优妮塔1',
        '马里奥兄弟惊奇',
        '超级马力欧派对 空前盛会',
        '八方旅人 1+2',
        'switch运动',
        '马里奥赛车8',
        '火焰纹章无双',
        // 香港
        '死亡细胞',
        '怒之铁拳4',
        '三国志14',
        '忍者神龟-施耐德的复仇',
        '三国无双7',
        // 日本
        '怪物猎人崛起+曙光',
        '传说法师',
        '我的朋友佩德罗',
        '午夜格斗',
        '疯狂兔子-奇遇派对',
        '灵视异闻 FILE23 本所七大不可思议',
        '蒸汽世界：大劫掠',
        '蒸汽世界-挖掘2',
        '生化危机启示录1',
        // 墨西哥
        // 波兰
        '无间冥寺',
        '狙击精英4',
        '恶棍英雄',
        '僵尸部队4',
        '蒸汽世界-挖掘',
        '毁灭战士（2016）'
    ]
];