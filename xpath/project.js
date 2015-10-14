/**
* @author   : wangxinyi
* @date     : 2014-10
* @overview : 点击量可视化工具
*/

(function(){
	var doc = window.document,
	$$,
	host = 'https://sphttps.baidu.com/9a1IaTylKgQFm2e88IuM_a/', 
	now = new Date(),
	css = [
		host + '~wangxinyi/xpath/css/jquery-ui-1.10.3.custom.min.css',
		host + '~wangxinyi/xpath/css/addClick.css'
	],
	clk = new Array(),
	pv = [],			//pv[logactid]=pv;
	labels = [],
	target,
	label_list = [],
	rate = [],
	tabname = [
			{
				'name':'团购',
				'id':'page-card-tpl-groupbuy'
			},
			{
				'name':'游戏',
				'id':'page-card-tpl-youxi'
			},
			{
				'name':'NBA',
				'id':'page-card-tpl-nbanews'
			},
			{
				'name':'音乐',
				'id':'page-card-tpl-music'
			},
			{
				'name':'新版音乐',
				'id':'page-card-tpl-music'
			},
			{
				'name':'星座',
				'id':'page-card-tpl-xingzuo'
			},
			{
				'name':'彩票',
				'id':'page-card-tpl-lottery'
			},
			{
				'name':'足球',
				'id':'page-card-tpl-football'
			},
			{
				'name':'股票',
				'id':'page-card-tpl-stock'
			},
			{
				'name':'新闻',
				'id':'page-card-tpl-news'
			}
	],
	cur_tab,
	t = [];						//用于clear监听函数

	//var xpaths = new Array();
	for (var i = 0; i < tabname.length; i++) {
		//xpaths[tabname[i].id] = new Array();
		clk[tabname[i].id] = new Array();
		rate[tabname[i].id] = 0;
	};

	function xpath_data(xpath, clk_data) {
		this.xpath = xpath;
		this.clk_num = clk_data;
	}

	startup();

	function startup() {
		var l = css.length, link = [];
		for(var i = 0; i < l; i++) {
			link.push('<link class="pslog-css" rel="stylesheet" type="text/css" href="'+css[i]+'"/>');
		}
		$('head').append(link.join(''));

		var html = '<div class="container">'+
						'<div class="titlebar">新首页PC点击统计</div><br/>'+
							'<form><table class="tongji-table tongji-table-form"><tr>'+
								'<td>卡片名:</td>'+
								'<td><input type="text" id="tongji_tab"/> <br>';

		for (var i = 0; i < tabname.length; i++) {
			html += '<a href="#" class="tablist" id="' + tabname[i].id + '">' + tabname[i].name + '</a>&nbsp;&nbsp;';	
		};

		html += '</div></td></tr></table></form>'+
					'<div class="footer">'+
						'<button class="button" id="tongji_submit">提交</button>&nbsp;&nbsp;'+
						'<button class="button" id="tongji_close">关闭</button>'+
					'</div>'+
				'</div>';

		
		$('body').append(html);

		$('a.tablist').bind('click', function() {
			$('#tongji_tab').val($(this).text());
		});

		$('button#tongji_submit').bind('click',function(){
			//clearTimeout(t);

			cur_tab = $('#tongji_tab').val();
			for (var i = 0; i < tabname.length; i++) {
				if(cur_tab == tabname[i].name) {
					cur_tab = tabname[i].id;
					break;
				}
			};
			clk[cur_tab]=[];
			
			var jsonUrl = host + '~wangxinyi/xpath/interface/' + cur_tab + '.json';
			loadData = function(data){
				pv[cur_tab] = data.pv;
				$.each(data.clk, function(i, item) {
					// xpaths[cur_tab].push(item.xpath);
					// //clk[cur_tab].push(item.clk_num);
					// clk[cur_tab][item.xpath]=item.clk_num;

					clk[cur_tab].push(new xpath_data(item.xpath,item.clk_num));
				});

				clk[cur_tab].sort(function(a,b){return b.clk_num-a.clk_num});
				init(cur_tab);
//				clk[cur_tab].sort();

				// for(var key in clk[cur_tab]){
				// 	console.log(key);//“键名”
				// 	console.log(clk[cur_tab][key]);//“键值'
				// }
			}



			$.ajax({
				url: jsonUrl,
				dataType: "jsonp",
				jsonp: "callback"
			});

			//等待ajax异步加载完数据再初始化
			// setTimeout(function(){
			// 	init(cur_tab);
			// },200);
			
		});


		$('button#tongji_close').bind('click',function(){
			$('.container').remove();
			$('.tongji-label').remove();
			$('.sub_container').remove();

			for (var i = 0; i < tabname.length; i++) {
				$('div').removeClass('tongji-ele-hilight-' + tabname[i].id);
				$('a').removeClass('tongji-ele-hilight-' + tabname[i].id);	
			};
			for (var i = 0; i < t.length; i++) {
				clearTimeout(t[i]);
			};
		});

	}

	function init(cur_tab) {
		$('.tongji-label').remove();
		target = null;
		for (var i = 0; i < tabname.length; i++) {
			$('div').removeClass('tongji-ele-hilight-' + tabname[i].id);
			$('a').removeClass('tongji-ele-hilight-' + tabname[i].id);	
		};
		for (var i = 0; i < t.length; i++) {
			clearTimeout(t[i]);
		};

		// for (var i = 0; i < xpaths[cur_tab].length; i++) {
		// 	var label_obj;
		// 	labels = labelHandler(xpaths[cur_tab][i].split('-'));
		// 	labels.unshift('div[data-logactid="'+cur_tab+'"]');
		// 	target = getTarget(labels);
		// 	if(!target.offset()) continue;
		// 	target_list[xpaths[cur_tab][i]] = target;
		// 	rate = getRate(clk[cur_tab][xpaths[cur_tab][i]],pv[cur_tab]);	//暂时先展示pv 不用rate
		// 	label_obj = renderLabel(target, xpaths[cur_tab][i], clk[cur_tab][xpaths[cur_tab][i]], rate);
		// 	hoverHilight(label_obj, target, xpaths[cur_tab][i], cur_tab);
		// };
		var tot_clk = 0;
		for (var i = 0; i < clk[cur_tab].length; i++) {
			var label_obj;
			var cur_rate;
			labels = labelHandler(clk[cur_tab][i].xpath.split('-'));
			labels.unshift('div[data-logactid="'+cur_tab+'"]');
			target = getTarget(labels);
			if(!target.offset()) continue;
			//target_list[clk[cur_tab][i].xpath] = target;
			tot_clk += parseInt(clk[cur_tab][i].clk_num);
			cur_rate = getRate(clk[cur_tab][i].clk_num, pv[cur_tab]);
			label_obj = renderLabel(target, clk[cur_tab][i].xpath, clk[cur_tab][i].clk_num, cur_rate);
			label_list[clk[cur_tab][i].xpath] = label_obj;
			hoverHilight(label_obj, target, 'tongji-ele-hilight');
		};
		rate[cur_tab] = getRate(tot_clk, pv[cur_tab]);
		init_sub_page(cur_tab);
	}

	function init_sub_page(cur_tab) {
		var html = '<div class="sub_container">'+
				'<div class="titlebar">卡片数据</div><br/>'+
					'<p style="text-align: left; font-weight:bold; padding:5px"> 展现量：' + pv[cur_tab] + '&nbsp;&nbsp;总点展比：' + rate[cur_tab] + ' </p>' +
					'<p style="text-align: left; font-weight:bold; padding:5px"> 数据日期：' + now.getFullYear() + '.' + parseInt(now.getMonth() + 1) + '.' + parseInt(now.getDate() - 2) + '</p> <br />' +
					'<div class="tongji-res-cont">'+
						'<table class="tongji-table tongji-table-list">'+
							'<tbody><tr><th>子链</th><th>点击量</th><th>点击率</th></tr>';

		// for (var i = 0; i < clk[cur_tab].length; i++) {
		// 	html += '<tr>'+
		// 				'<td><a id="'+xpaths[cur_tab][i]+'">'+xpaths[cur_tab][i]+'</a></td>'+
		// 				'<td>'+clk[cur_tab][xpaths[cur_tab][i]]+'</td>'+
		// 				'<td>'+getRate(clk[cur_tab][xpaths[cur_tab][i]], pv[cur_tab])+'</td>'+
		// 			'</tr>';
		// 	/*console.log($('a#'+xpaths[cur_tab][i]));
		// 	console.log(target_list[xpaths[cur_tab][i]]);
		// 	hoverHilight($('a#'+xpaths[cur_tab][i]), target_list[xpaths[cur_tab][i]], xpaths[cur_tab][i], cur_tab); 
		// */};

		for(var i = 0; i < clk[cur_tab].length; i++){
			if(!clk[cur_tab][i].xpath) continue;
			html += '<tr>'+
						'<td><a id="'+clk[cur_tab][i].xpath+'">'+clk[cur_tab][i].xpath+'</a></td>'+
						'<td>'+clk[cur_tab][i].clk_num+'</td>'+
						'<td>'+getRate(clk[cur_tab][i].clk_num, pv[cur_tab])+'</td>'+
					'</tr>';
/*			alert(key);//“键名”
			alert(a[key]);//“键值'
*/		}


		html += '</tbody></table></div>' +
				'<div class="footer">'+
				'&nbsp;&nbsp;'+
				'<button class="sub_button" id="tongji_sub_close">关闭</button>'+
			'</div>';
		
		$('body').append(html);



		$('.sublist').bind('click', function() {
			$('#tongji_subxpath').val($(this).text());
		});

		$('button#tongji_sub_close').bind('click',function(){
			$('.tongji-mytable2').remove();
			$('.tongji-label').remove();
			$('.sub_container').remove();
			for (var i = 0; i < tabname.length; i++) {
				$('div').removeClass('tongji-ele-hilight-' + tabname[i]);
				$('a').removeClass('tongji-ele-hilight-' + tabname[i]);	
			};
			clk[cur_tab]=[];
			for (var i = 0; i < t.length; i++) {
				clearTimeout(t[i]);
			};
		});

		for(var i = 0; i < clk[cur_tab].length; i++){
			var tmp_xpath = clk[cur_tab][i].xpath;
			if(!tmp_xpath) continue;
			var id = 'a#' + tmp_xpath;
			labels = labelHandler(tmp_xpath.split('-'));
			labels.unshift('div[data-logactid="'+cur_tab+'"]');
			target = getTarget(labels);
			hoverHilight($(id), target, 'tongji-ele-hilight');
			hoverHilight($(id), label_list[tmp_xpath], 'tongji-label-hilight');
		}
	}

	function hoverHilight(obj, target, classname) {
		if(!target) return;
		obj.bind('mouseover', function(){
			target.addClass(classname);
		}).bind('mouseout', function(){
			target.removeClass(classname);
		});
	}


	//extract the labels from xpath
	function labelHandler(labels) {
		for (var i = 0; i < labels.length; i++) {
			v = labels[i];
			if(/^h\d/.test(v)){
				labels[i]=v.replace(/(h\d)(\d*)/,function(a,b,c){return b+':eq('+(c?c-1:0)+')';});
			}else{
				labels[i]=v.replace(/(\d*)$/,function(a,c){return ':eq('+(c?c-1:0)+')';});
			}
		};
		return labels;
	}
	
	//change from string to dom object
	//and then highlight the target
	function getTarget(labels) {
		var target = $(labels[0]);
		for (var i = 1; i < labels.length; i++) {
			target = target.children(labels[i]);
		};

		return target;
	}


	//get the rate first
	//then add a dom node to show the rate
	//*pay attention to the tab movement and the window resizing behavior
	function getRate(clk,pv){
		return parseFloat(clk/pv*100).toFixed(3)+'%';
	}
	
//	function renderLabel(target,xpath,clk) {
	function renderLabel(target,xpath,clk,rate) {
		$('body').append('<div class="tongji-label" data-label="'+xpath+'">'+clk+' / '+rate+'</div>'); 
//		$('body').append('<div class="tongji-label" data-label="'+xpath+'">'+clk+'</div>'); 
		
		$('[data-label="'+xpath+'"]').css('top',target.offset().top+20).css('left',target.offset().left);
		
		// if(target.offset().left <= 0 || target.offset().top <= 0) {
		// 	$('[data-label="'+xpath+'"]').hide();
		// }

		$(window).resize(function() {
			$('[data-label="'+xpath+'"]').css('left',target.offset().left);
		});
		listenTabMove(target, $('[data-label="'+xpath+'"]'));
		return $('[data-label="'+xpath+'"]');
	}


	function listenTabMove(cur_node, cur_label)
	{
		var l_crt, r_crt, t_crt, b_crt, left, right, top, bottom;
		l_crt = $('#s_ctner_contents')[0].getBoundingClientRect().left;
		r_crt = $('#s_ctner_contents')[0].getBoundingClientRect().right;
		t_crt = $('#s_ctner_contents')[0].getBoundingClientRect().top;
		b_crt = $('#s_ctner_contents')[0].getBoundingClientRect().bottom;
		left = cur_node[0].getBoundingClientRect().left;
		right = cur_node[0].getBoundingClientRect().right;
		top = cur_node[0].getBoundingClientRect().top;
		bottom = cur_node[0].getBoundingClientRect().bottom;

		if(left < l_crt || right > r_crt || top < t_crt || bottom > b_crt) {	//843是团购卡片的特殊处理值，处理滚动页面
			cur_label.hide();
		}
		else if(left - l_crt <= 526 && left - l_crt >= 525) {
			cur_label.hide();
		}
		else{
			cur_label.css('top',cur_node.offset().top+20).css('left',cur_node.offset().left);
			cur_label.show();
		}
	
		t.push(
			setTimeout(function(){
				listenTabMove(cur_node, cur_label);
			},100)
		);
	}


})();
