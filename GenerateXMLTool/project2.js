/**
* @author   : wangxinyi
* @date     : 2014-11-11
* @overview : 自动生成xml文件
*/

(function(){
	var doc = window.document,
	$$,
	host = 'https://sphttps.baidu.com/9a1IaTylKgQFm2e88IuM_a/', 
	now = new Date(),
	css = [
		host + '~wangxinyi/xml/css/jquery-ui-1.10.3.custom.min.css',
		host + '~wangxinyi/xml/css/xml.css'
	];

	startup();

	function startup() {
		var l = css.length, link = [];
		for(var i = 0; i < l; i++) {
			link.push('<link class="pslog-css" rel="stylesheet" type="text/css" href="'+css[i]+'"/>');
		}
		$('head').append(link.join(''));

		var html = 	'<div class="container">'+
						'<div class="titlebar">XML自动生成工具</div><br/>'+
						'<p><textarea rows="6" cols="40" id="mytext_a"><attr key="xpath" type="norminal" desc="点击类型" value="" from="" to="-" /></textarea> <br></p>'+
						'<br><p><textarea rows="6" cols="40" id="mytext_b"><attr key="xpaths" type="norminal" desc="点击类型" value="" from="" to="-" /></textarea> <br></p>'+
						'<div class="footer">'+
							'<button class="button" id="copy">按Ctrl-C复制</button>&nbsp;&nbsp;'+
							'<button class="button" id="submit">提交</button>&nbsp;&nbsp;'+
							'<button class="button" id="close">关闭</button>'+
						'</div>'+
					'</div>';
		
		$('body').append(html);

		$('button#copy').bind('click',function(){
			document.getElementById("mytext_a").select(); // 选择对象
		});

		$('button#submit').bind('click',function(){
			window.open("http://cubefe.baidu.com/~wangxinyi/xml/codeGenerator.php");
		});

		$('button#close').bind('click',function(){
			$('.container').remove();
		});
	}

	//获取元素xpath
	var getXPath = function(node, wrap, path) {
	    path = path || [];
	    wrap = wrap || document;
	    if (node === wrap) {
	    	path.push(undefined); //没有logactid
	        return path;
	    }
	    if (node.getAttribute('data-logactid')) {
	    	//找到logactid
	        //path.push(node.getAttribute('data-logactid'));
	        return path;
	    }
	    if (node.parentNode !== wrap) {
	        path = getXPath(node.parentNode, wrap, path);
	    }else{
	    	path.push(undefined);//没有logactid
	    }
	    if (node.previousSibling) {
	        var count = 1;
	        var sibling = node.previousSibling;
	        do {
	            if (sibling.nodeType == 1 && sibling.nodeName == node.nodeName) {
	                count++;
	            }
	            sibling = sibling.previousSibling;
	        } while (sibling);
	    }
	    if (node.nodeType == 1) {
	        path.push(node.nodeName.toLowerCase() + (count > 1 ? count: ''));
	    }
	    return path;
	};

	var trima = function(path){
		return path.replace(/a(\d*)-(.+)$/g,'a$1');
	};

	function renderText(xpath, name, i) {
		var id = '#mytext_' + i;
		html = $(id)[0].value;
		var sub_index = html.indexOf("value=") + 7;
		var html_head, html_tail;
		var content;
		if(sub_index >= 0) {
			html_head = html.substr(0, sub_index);
			html_tail = html.substr(sub_index);
		}
		if(name) {
			content = xpath + ':' + name + ';';
		} else {
			content = xpath + ':;';
		}
		html = html_head + content + html_tail;
		html = html.toLowerCase();
		$(id)[0].value = html;
	}


	//绑定事件
	var myDom = ['s_ctner_contents'];
	var bindEvent = function(item){
		$('#'+item).unbind('click');
		$('#'+item).on('click',function(e){
			var t = e.target;
			var path = getXPath(t,$('#'+item)[0]);
			var xpath = trima(path.join('-'));
			var xpaths = xpath.replace(/\d/g,'');

			if(t.text) {
				renderText(xpath, t.text, 'a');
				renderText(xpaths, t.text, 'b');
			}
			else if(t.getAttribute('title')) {
				renderText(xpath, t.getAttribute('title'), 'a');
				renderText(xpaths, t.getAttribute('title'), 'b');
			}
			else if(t.innerHTML) {
				renderText(xpath, t.innerHTML, 'a');
				renderText(xpaths, t.innerHTML, 'b');
			}
			else {
				myAlert(xpath, xpaths);
			}
			return false;
		});

	};
	$.each(myDom, function(i,e){
		bindEvent(e);
	});

	function myAlert(xpath, xpaths) {
		var html = 	'<div class="sub_container">'+
						'<div class="titlebar">请手动输入value值</div><br/>'+
						'<p>xpath:&nbsp;&nbsp; <input type="text" id="myxpath" value="'+xpath+'"><br></p>'+
						'<br><p>value:&nbsp;&nbsp; <input type="text" id="myvalue"> <br></p>'+
						'<div class="footer">'+
							'<button class="sub_button" id="submit2">提交</button>&nbsp;&nbsp;'+
						'</div>'+
					'</div>';
		
		$('body').append(html);

		$('button#submit2').bind('click',function(){
			var value = $('#myvalue')[0].value;
			renderText(xpath, value, 'a');
			renderText(xpaths, value, 'b');
			$('.sub_container').remove();
		});

	}

	F.use('superui:component/draggable',function(Draggable){
		//不做限制
		new Draggable({
			element:$('.container'),
			handle:$('.titlebar'),
			identity: 'log_validation',
			proxy : false
		})
	});


})();