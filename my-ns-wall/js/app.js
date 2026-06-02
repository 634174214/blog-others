function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

const localStorageKey = '__wu_switch_gamewall_search_history__';
const axiosUrlUsePhp = window.location.href.indexOf('localhost/ns-work/games-wall-ns') > -1;
const axiosUrl = axiosUrlUsePhp ? 'server/index.php' : 'server/index.json';

const app = Vue.createApp({
    data() {
        return {
            tabCurrentLabel: 'all',
            // 所在区服
            tabs: [],
            serialNumberNS1: '',
            lastUpdate: '',
            // 系统内存
            systemStorageNS1: {
                used: 0,
                total: 64,
                available: 64
            },
            // tf卡内存
            sdCardStorageNS1: {
                used: 0,
                total: 954,
                available: 954
            },
            // 所有的游戏账户
            account‌s: {},
            account‌sArr: [],
            accountSlidersCurrent: 0,
            defaultGamingAccount‌: {},
            // 所有游戏
            allGames: [],
            serverData: null,
            showDetail: false,
            currentGame: null,
            detailScroll: null,
            showDetailClose: false,
            detailScrollY: 0,
            locked: window.location.href.indexOf('localhost') > -1 ? false : true,
            loading: true,
            showSearch: false,
            searchKeyword: '',
            searchHistory: JSON.parse(localStorage.getItem(localStorageKey) || '[]'),
            searchResults: [],
            isSearching: false,
            sortType: '', // 当前排序类型
            sortOrder: 'desc', // 当前排序顺序
            // 已经玩过的游戏 有耐心经营的存档
            gamesPlayed: []
        }
    },
    created() {
        // 在组件创建时获取服务器数据
        this._fetchServerData();
        this.searchTimer = null;
    },
    mounted() {
        this.unWaitingLocked();
    },
    computed: {
        today() {
            const date = new Date();
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;  
        },
        games() {
            if (this.tabCurrentLabel === 'all') {
                return this.allGames;
            } else {
                return this.allGames.filter(game => game.label === this.tabCurrentLabel);
            }
        },
        totalGames() {
            return this.allGames.filter(game => !game.is_dlc).length;
        },
        totalValue() {
            return this.allGames.reduce((total, game) => {
                // 从 price_buy_rmb 字符串中提取数字部分 (去掉￥符号)
                const price = parseFloat(game.price_buy_rmb.replace('￥', ''));
                return total + price;
            }, 0).toFixed(2);
        },
        currentTabGamesCount() {
            if (this.tabCurrentLabel === 'all') {
                return '';
            } else {
                const counts = this.games.length;
                const cn = this._getLabelCn(this.tabCurrentLabel);
                return `<strong>${cn}</strong> 共有 <b class="highlight">${counts}</b> 个游戏`;
            }
           
        },
        currentTabTotalPrice() {
            if (this.tabCurrentLabel === 'all') {
                return null;
            }
            return this.games.reduce((total, game) => {
                if (game.price_buy_rmb) {
                    const price = parseFloat(game.price_buy_rmb.replace('￥', '')) || 0;
                    return total + price;
                }
                return total;
            }, 0).toFixed(2);
        },
        detailImageBg() {
            if (!this.currentGame) return {};
            console.log(this.detailScrollY);
            
            const scrollY = this.detailScrollY;
            const windowWidth = window.innerWidth;
            const RESERVED_HEIGHT = windowWidth * 0.2;
            const maxTranslateY = windowWidth * 0.8;
            let zIndex = 0
            let paddingTop = '100%'
            let height = 0
            // ios中还是无法遮挡，要使用translateZ属性去兼容 否则滚动的list层还是在图片之上
            let translateZ = 0
            let scale = 1;
            
            if (scrollY < 0) {
                scale = 1 + Math.abs(scrollY / windowWidth);
            } else {
                translateZ = 1;

                if (scrollY > maxTranslateY) {
                    zIndex = 20;
                    height = `${RESERVED_HEIGHT}px`;
                    paddingTop = '0%';
                }

            }

            // 根据是否借出、
            let filter = 0;
            if(this.getNocolorResult(this.currentGame)) {
                filter = 100;
            }
            
            return {
                backgroundImage: `url(${this.currentGame.preview})`,
                transform: `scale(${scale}) translateZ(0px)`,
                zIndex: zIndex,
                paddingTop: paddingTop,
                height: height,
                translateZ: translateZ,
                filter: `grayscale(${filter}%)`
            };
        },
        filterStyle() {
            if (!this.currentGame) return {};
            let blur = 0;
            const scrollY = this.detailScrollY;
            const screenWidth = window.innerWidth;
            const maxTranslateY = screenWidth * 0.8;
            // 此时是向上推的过程
            if (scrollY >= 0) {
              blur = scrollY / screenWidth;
              // 求出模糊的最大值（滚动到距离顶部40像素的位置） 求出最小值
              blur = Math.min(maxTranslateY / screenWidth, blur) * 3;
            }
            return {
              backdropFilter: `blur(${blur}px)`
            }
        },
        waitingStatus() {
            return this.loading || this.locked;
        }
    },
    methods: {
        // 获取是否需要黑白化处理
        getNocolorResult(gameObj) {
            let res = false;
            if ((gameObj.type === 'digital' && gameObj.virtual_card_out) ||
                gameObj.game_delete ||
                gameObj.lended
            ) {
                res = true;
            }
            return res;
        },
        openSearch() {
            this.showSearch = true;
            this.$nextTick(() => {
                document.querySelector('.search-input').focus();
                this._initSearchScroll();
            });
            
        },
        _initSearchScroll() {
            setTimeout(() => {
                if (this.searchScroll) {
                    this.searchScroll.refresh();
                } else {
                    this.searchScroll = BetterScroll.createBScroll(this.$refs.searchScrollWrapperRef, {
                        click: true,
                        scrollY: true
                    });
                }
            }, 200);
        },
        closeSearch() {
            this.showSearch = false;
            this.searchKeyword = '';
            this.searchResults = [];
            this.isSearching = false;
        },
        
        handleSearch() {
            if (!this.searchKeyword.trim()) return;
            
            if(this.searchTimer) {
                clearTimeout(this.searchTimer);
                this.searchTimer = null;
            }
            this.isSearching = true;
            this.searchTimer = setTimeout(() => {
                // 预防期间keyword再变化 1秒后执行 如果没有内容则不执行
                if (!this.searchKeyword.trim()) {
                    return
                };
                // 执行搜索逻辑
                const keyword = this.searchKeyword.toLowerCase();
                const allGames = deepCopy(this.allGames);
                // 筛选出包含关键词的项
                this.searchResults = allGames.filter(game => {
                    return game.cn_name.includes(keyword) ||
                    game.en_name.toLowerCase().includes(keyword)
                });
                console.log(this.searchResults)
                // 关键词替换高亮
                this.searchResults.map(game => {
                    game.cn_name = game.cn_name.replace(keyword, `<span class="highlight">${keyword}</span>`);
                    game.en_name = game.en_name.replace(keyword, `<span class="highlight">${keyword}</span>`);
                });
                this.$nextTick(() => {
                    this._initSearchScroll();
                    this.searchTimer = null;
                    this.isSearching = false;
                    // 保存搜索历史
                    this.saveSearchHistory(this.searchKeyword);
                });
            }, 1000);
        },
        
        searchFromHistory(keyword) {
            this.searchKeyword = keyword;
            this.handleSearch();
        },

        clearSearch() {
            this.searchKeyword = '';
            this.searchResults = [];
            this.isSearching = false;
            this.$nextTick(() => {
                this._initSearchScroll();
            });
        },
        
        saveSearchHistory(keyword) {
            const trimmedKeyword = keyword.trim();
            if (!trimmedKeyword) return;
            
            // 移除重复项
            const index = this.searchHistory.indexOf(trimmedKeyword);
            if (index > -1) {
                this.searchHistory.splice(index, 1);
            }
            
            // 添加到开头
            this.searchHistory.unshift(trimmedKeyword);
            
            // 限制最多10条记录
            if (this.searchHistory.length > 10) {
                this.searchHistory.pop();
            }
            
            // 保存到localStorage
            localStorage.setItem(localStorageKey, JSON.stringify(this.searchHistory));
        },
        
        clearHistory() {
            this.searchHistory = [];
            localStorage.removeItem(localStorageKey);
            this.$nextTick(() => {
                this._initSearchScroll();
            });
        },
        scrollToEle(elementId) {
            // 1. 根据 ID 获取元素
            const el = document.getElementById(elementId);
            
            // 2. 如果元素不存在，直接返回，避免报错
            if (!el) {
                console.warn(`元素 ID ${elementId} 不存在`);
                return;
            }

            // 3. 平滑滚动到目标元素
            el.scrollIntoView({
                behavior: 'smooth',    // 平滑滚动
                block: 'start',        // 垂直方向：顶部对齐
                inline: 'start'        // 水平方向：开头对齐
            });
        },
        scrollToTop(to = 'top') {
            const screenWidth = window.innerWidth;
            let place = 0;
            if(to === 'top') {
                place = 0
            }
            if(to === 'tabs') {
                place = screenWidth;
            }

            window.scrollTo({
                top: place,
                behavior: 'smooth'
            });
        },
        setActiveTab(tablabel, $event) {
            this.tabCurrentLabel = tablabel;
            const target = $event.target;
            const targetTab = target.parentNode;
            this.tabScroll.scrollToElement(targetTab, 1000, true);
            // this.scrollToTop('tabs');
            this.scrollToEle('carousel-wrapper');
        },
        copyContent(content, tips) {
            const serialNumber = content;
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(serialNumber)
                    .then(() => {
                        wuDialog(tips).message();
                    }
                )
                    .catch(err => console.error('复制失败:', err));
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = serialNumber;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                    wuDialog(tips).message();
                } catch (err) {
                    wuDialog('复制失败').message();
                    console.error('复制失败:', err);
                } finally {
                    textArea.remove();
                }
            }
        },
        calculateStoragePercentage(used, total) {
            return (used / total) * 100;
        },
        _getLabelCn(label) {
            const serverArea = this.serverData.server_area;
            const areaIndex = this._getIndexByLabel(label, serverArea);
            return serverArea[areaIndex].cn;
        },
        detailServerCnName(label) {
            const notShow = ['all', 'gamecard'];
            let res = '';
            if (!notShow.includes(label)) {
                res = this._getLabelCn(label);
            }
            return res;
        },
        _windowScrollTabFixed() {
            const tabsWrapperEl = document.getElementById('tabs-wrapper');
            const headerHeight = document.getElementById('header').clientHeight;
            window.addEventListener('scroll', () => {
                const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                if(scrollTop > headerHeight) {
                    tabsWrapperEl.classList.add('fixed');
                    document.body.classList.add('fixed-tabs');
                } else {
                    tabsWrapperEl.classList.remove('fixed');
                    document.body.classList.remove('fixed-tabs');
                }
                const goTopEl = document.getElementById('go-top');
                if (scrollTop > 100) {
                    goTopEl.style.display = 'block';
                } else {
                    goTopEl.style.display = 'none';
                }
            });
        },
        async _fetchServerData() {
            try {
                const response = await axios.get(axiosUrl);
                const responseData = response.data;
                this.serverData = responseData;
                console.log('服务器数据:', this.serverData);

                this.tabs =  this._getTabs(responseData.server_area);
                this.account‌s = responseData['account‌s'];
                this.account‌sArr = Object.values(responseData['account‌s']);
                this.defaultGamingAccount = responseData['account_gaming_default'];
                this.allGames = this._getAllGames(responseData.game_list);
                // console.log(this.allGames);
                this.serialNumberNS1 = responseData['ns1'].switch_id;
                this.lastUpdate = responseData.last_update_time;
                this.systemStorageNS1 = {
                    used: responseData['ns1'].memory_switch_total - responseData['ns1'].memory_switch,
                    total: responseData['ns1'].memory_switch_total,
                    available: responseData['ns1'].memory_switch
                }
                this.sdCardStorageNS1 = {
                    used: responseData['ns1'].memory_tf_total - responseData['ns1'].memory_tf,
                    total: responseData['ns1'].memory_tf_total,
                    available: responseData['ns1'].memory_tf
                };

                this.gamesPlayed = responseData['games_played'];

                this.loading = false;

            } catch (error) {
                console.error('获取服务器数据失败:', error);
            }
        },
        _getTabs(areas) {
            let tabs = [
                {
                    label: 'all',
                    cn: '全部'
                }
            ];
            areas.forEach((area) => {
                tabs.push({
                    label: area.label,
                    cn: area.cn
                });
            });
            return tabs;
        },
        _getAllGames(gameList) {
            let allGames = [];
            const serverArea = this.serverData.server_area;
            // 遍历 game_list 对象的所有键（区域）
            Object.keys(gameList).forEach(areaKey => {
                serverArea[areaKey] = gameList[areaKey];
                const areaIndex = this._getIndexByLabel(areaKey, serverArea);
                // 单位
                const unit = serverArea[areaIndex]['money_unit'];
                // 汇率
                const rateArray = serverArea[areaIndex]['exchange_rate'].split(':');
                const rate = rateArray[0] / rateArray[1];
                // 汇率转换
                gameList[areaKey].map((game) => {
                    game.price_origin_rmb = '￥' + Math.round(game.price_origin * rate * 100) / 100;
                    game.price_buy_rmb = '￥' + Math.round(game.price_buy * rate * 100) / 100;
                    game.price_origin = game.price_origin + ` ${unit}`;
                    game.price_buy = game.price_buy + ` ${unit}`;
                    game.label = areaKey;
                });
                
                // 直接将每个区域的游戏数组合并到总数组中
                allGames = allGames.concat(gameList[areaKey]);
            });
            // 有50%的概率对数组进行乱序
            if (Math.random() > 0.5) {
                // 对所有数组进行乱序
                allGames.sort(() => Math.random() - 0.5);
            }

            return allGames;
        },
        _getIndexByLabel(label, areas) {
            return areas.findIndex(area => area.label === label);
        },
        showGameDetailFromSearch(game) {
            console.log(game)
            const gameID = game.id;
            const index = this.allGames.findIndex((item) => {
                return item.id === gameID;
            });
            if(index < 0) {
                wuDialog('抱歉，该游戏检测不到');
                return;
            }
            const selectedGame = this.allGames[index];
            this.showGameDetail(selectedGame);
        },
        showGameDetail(game) {
            this.currentGame = game;
            this.showDetail = true;
            this.$nextTick(() => {
                this.initDetailScroll();
            });
        },
        closeDetail() {
            this.showDetail = false;
            this.showDetailClose = false;
            this.currentGame = null;
            this.detailScrollY = 0;
            if (this.detailScroll) {
                this.detailScroll.destroy();
                this.detailScroll = null;
            }
        },
        detailAfterEnter() {
            this.showDetailClose = true;
        },
        initDetailScroll() {
            if (this.detailScroll) {
                this.detailScroll.destroy();
            }
            this.detailScroll = BetterScroll.createBScroll(this.$refs.detailContentRef, {
                click: true,
                scrollY: true,
                probeType: 3
            });
            // 通过数值监听滚动方向
            this.detailScroll.on('scroll', (pos) => {
                // 派发的是向下拉为正 向上拉为负 所以取反
                this.detailScrollY = -Math.round(pos.y);
            });
        },
        initTabScroll() {
            if (this.tabScroll) {
                this.tabScroll.refresh();
            } else {
                this.tabScroll = BetterScroll.createBScroll('#tabs-scroll', {
                    scrollX: true,
                    scrollY: false,
                    click: true,
                    eventPassthrough: 'vertical'
                });
            }
        },
        // 初始化账号轮播
        initAccountSliders() {
            // 修复变量名拼写错误：统一为 accountsSlidersScroll
            if (this.accountsSlidersScroll) {
                // 先刷新尺寸（确保DOM更新后计算正确）
                this.accountsSlidersScroll.refresh();
            } else {
                // 确保DOM元素存在后再初始化
                const carouselWrapper = this.$refs.carouselWrapperRef; // 建议用ref代替ID选择器
                if (!carouselWrapper) {
                    console.warn('账号轮播容器未找到');
                    return;
                }
                // 补充横向滚动关键配置
                this.accountsSlidersScroll = BetterScroll.createBScroll(carouselWrapper, {
                    scrollX: true,          // 开启横向滚动
                    scrollY: false,         // 关闭纵向滚动
                    momentum: false,
                    bounce: false,
                    probeType: 1,
                    // 轮播使用bs-slide插件的默认配置
                    slide: true,
                });

                this.accountsSlidersScroll.on('slideWillChange', (page) => {
                    // 因为定义的是一个ref对象，所以赋值一定要是.value
                    this.accountSlidersCurrent = page.pageX
                })
            }
        },
        getGameType(type) {
            switch (type) {
                case 'card':
                    return '实体卡带';
                case 'digital':
                    return '数字版';
                default:
                    return '未知';
            }
        },
        unWaitingLocked() {
            const lockEl = document.getElementById('skeleton-card-lock');
            const lockMaxTimes = 6;
            let lockTimer = null;
            let lockTimes = 0;
            lockEl.addEventListener('touchstart', () => {
                lockTimer = setInterval(() => {
                    lockTimes++;
                    // console.log(lockTimes)
                }, 1000);
            });
            lockEl.addEventListener('touchend', () => {
                // console.log(lockTimes)
                if(lockTimes > lockMaxTimes) {
                    this.locked = false;
                }
                clearInterval(lockTimer);
                lockTimer = null;
                lockTimes = 0;
            });
        },
        randomSort() {
            // 使用Fisher-Yates算法对数组进行随机排序
            for (let i = this.allGames.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.allGames[i], this.allGames[j]] = [this.allGames[j], this.allGames[i]];
            }
            // 重置排序类型和顺序
            this.sortType = '';
            this.sortOrder = 'desc';
        },
        setSortType(type) {
            if (this.sortType === type) {
                // 如果再次点击同一类型，则切换排序顺序
                this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                // 否则设置为新的排序类型，默认降序
                this.sortType = type;
                this.sortOrder = 'desc';
            }
            const sortText = this.getSortText();
            const msg = this.sortOrder === 'asc' ? `${sortText}已按升序排列` : `${sortText}已按降序排列`;
            wuDialog(msg).message();
            this.sortGames();
        },
        sortGames() {
            this.allGames.sort((a, b) => {
                let result = 0;
                switch (this.sortType) {
                    case 'price_buy':
                        result = parseFloat(a.price_buy_rmb.replace(/[\D.-]/g, '')) - parseFloat(b.price_buy_rmb.replace(/[\D.-]/g, ''));
                        break;
                    case 'discount':
                        result = Math.abs(parseInt(a.discount)) - Math.abs(parseInt(b.discount));
                        break;
                    case 'price_origin':
                        result = parseFloat(a.price_origin_rmb.replace(/[\D.-]/g, '')) - parseFloat(b.price_origin_rmb.replace(/[\D.-]/g, ''));
                        break;
                    case 'bug_date':
                        result = new Date(a.bug_date) - new Date(b.bug_date);
                        break;
                    default:
                        return 0;
                }
                return this.sortOrder === 'asc' ? result : -result;
            });
        },
        getSortText() {
            switch (this.sortType) {
                case 'price_buy':
                    return '价格';
                case 'discount':
                    return '折扣';
                case 'price_origin':
                    return '原价';
                case 'bug_date':
                    return '购买日期';
                default:
                    return '';
            }
        },
        gameHasPlayed(gameCnName) {
            // 优化查找逻辑：some方法只要找到匹配项就返回true，更高效
            return this.gamesPlayed.some(gameItem => {
                // 建议添加空值判断，避免undefined/null导致的错误
                const res = gameItem && gameCnName && gameCnName.indexOf(gameItem) > -1;
                // console.log(gameCnName, res, gameItem.indexOf(gameCnName) > -1)
                return res;
            });
            
            // 如果你需要的是**完全匹配**（而不是包含），应该用 ===
            // return this.gamesPlayed.includes(gameCnName);
            // const gameIndex = this.gamesPlayed.findIndex((gameItem) => {
            //     return gameItem.indexOf(gameCnName) > -1;
            // }); 
            // return gameIndex >= 0;
        }
    },
    watch: {
        account‌sArr() {
            // 延长等待时间，确保DOM完全渲染
            this.$nextTick(() => {
                setTimeout(() => {
                    this.initAccountSliders();
                }, 200); // 缩短但确保DOM就绪，500ms也可以
            });
        },
        waitingStatus() {
            setTimeout(() => {
                this._windowScrollTabFixed();
                this.initTabScroll();
            }, 500);
        },
        searchKeyword(newval) {
            console.log(newval)
            this.searchResults = [];
            if(newval.trim()) {
                console.log('11s')
                this.handleSearch();
            }
        }
    },
    beforeUnmount() {
        // Destroy BetterScroll instance when component is unmounted
        if (this.tabScroll) {
            this.tabScroll.destroy();
        }
    }
})

app.mount('#app');
