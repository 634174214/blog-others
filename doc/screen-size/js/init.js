//表格排序
(function($){
    //插件
    $.extend($,{
        //命名空间
        sortTable:{
            sort:function(tableId,Idx){
                var table = document.getElementById(tableId);
                var tbody = table.tBodies[0];
                var tr = tbody.rows;

                var trValue = new Array();
                for (var i=0; i<tr.length; i++ ) {
                    trValue[i] = tr[i];  //将表格中各行的信息存储在新建的数组中
                }

                if (tbody.sortCol == Idx) {
                    trValue.reverse(); //如果该列已经进行排序过了，则直接对其反序排列
                } else {
                    //trValue.sort(compareTrs(Idx));  //进行排序
                    trValue.sort(function(tr1, tr2){
                        var value1 = tr1.cells[Idx].innerHTML;
                        var value2 = tr2.cells[Idx].innerHTML;
                        return value1.localeCompare(value2);
                    });
                }

                var fragment = document.createDocumentFragment();  //新建一个代码片段，用于保存排序后的结果
                for (var i=0; i<trValue.length; i++ ) {
                    fragment.appendChild(trValue[i]);
                }

                tbody.appendChild(fragment); //将排序的结果替换掉之前的值
                tbody.sortCol = Idx;
            }
        }
    });
})(jQuery);

//使用tableSort这个class来做表格排序，必备元素：thead,th,tbody，详见ios.htm
(function ($) {
	var i=0;
	$('.tableSort').each(function () {
		var th=$(this).children('thead').find('th');
		if (th.length<1) return;
		var id='ts'+(i*100);
		var oid=$(this).attr('id');
		if(!oid) {
			$(this).attr('id',id);
		}else{
			id=oid;
		}
		th.each(function () {
			$(this).css('cursor','pointer');
			$(this).attr('title','点击按此列排序');
			$(this).append('<i class="ico ico-sort"></i>');
			var index=th.index($(this));
			$(this).on('click',function () {
				th.removeClass('current');
				$(this).addClass('current');
				$.sortTable.sort(id,index);
				return false;
			});
		});
		i++;
	});
})(jQuery);

//添加fixed_scroll这个class，在css中定义.has_fixed_scroll {position:fixed;}即可制作侧栏滚动时固定
(function ($) {
	$('.fixed_scroll').each(function () {
		var j=$(this);
		do_fixed(j);
		$(window).on('scroll',function () {
			undo_fixed(j);
			do_fixed(j);
		});
		$(window).on('resize',function () {
			undo_fixed(j);
			do_fixed(j);
		});
	});
	function do_fixed(j) {
		if(j.length<1) return;
		var offset=j.offset();
		var offset_top=offset.top;
		var offset_left=offset.left;
		var st=window.pageYOffset
			|| document.documentElement.scrollTop
			|| document.body.scrollTop
			|| 0;
		var body_top=$('body').css('padding-top');
		// body_top=parseInt(body_top);
		console.log(body_top);
		if (st>=offset_top-body_top) {
			j.addClass('has_fixed_scroll');
			j.css('left',offset_left);
		}else{
			undo_fixed(j);
		}
	}
	function undo_fixed(j) {
		if(j.length<1) return;
		j.removeClass('has_fixed_scroll');
		j.css('left','auto');
	}
})(jQuery);

//使用navcur_side和navcur_cont来标识要对应显示current标签内容，参见ios.htm
(function ($) {
	var s=$('.navcur_side');
	var c=$('.navcur_cont');
	if (s.length<1 || c.length<1) return;
	var li=s.find('li');
	var h2=c.find('h2');
	if (li.length<1 || h2.length<1) return;
	li.on('click',function () {
		var index=li.index($(this));
		var tmp=h2.eq(index);
		if(tmp.length<1) return;
		var offset=tmp.offset();
		li.removeClass('current');
		$(this).addClass('current');
		win_scrollTop_to(offset.top);
		return false;
	});
	function win_scrollTop_to(l) {
		var body_top=$('body').css('padding-top');
		body_top=parseInt(body_top);
		$('html,body').animate({
			scrollTop:l-body_top
		},'normal');
	}
	$(window).on('scroll',function () {
		var tops=[];
		h2.each(function () {
			var offset=$(this).offset();
			tops.push(offset.top);
		});
		var st=window.pageYOffset
				|| document.documentElement.scrollTop
				|| document.body.scrollTop
				|| 0;
		var max=tops.length;
		for (var $i = 0; $i < max; $i++) {
			if ($i==max-1 && st>tops[$i]) {
				li.removeClass('current');
				li.eq($i).addClass('current');
				break;
			}
			if (st<tops[$i]) {
				li.removeClass('current');
				var n=$i-1<0?$i:$i-1;
				li.eq(n).addClass('current');
				break;
			}
		}
	});
})(jQuery);
