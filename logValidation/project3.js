/**
* @author   : wangxinyi
* @date     : 2014-11-25
* @overview : 校验日志数据
*/

(function(){
	var doc = window.document,
	$$,
	host = 'https://sphttps.baidu.com/9a1IaTylKgQFm2e88IuM_a/', 
	now = new Date(),
	css = [
		host + '~wangxinyi/logValidation/css/jquery-ui-1.10.3.custom.min.css?t='+now.getTime(),
		host + '~wangxinyi/logValidation/css/log.css?t='+now.getTime()
	],
	xmlDoc,
	html = "";

	startup();

	window.console = window.console || {
		log : function(){}
	};

	function startup() {
		var l = css.length, link = [];
		for(var i = 0; i < l; i++) {
			link.push('<link class="pslog-css" rel="stylesheet" type="text/css" href="'+css[i]+'"/>');
		}
		$('head').append(link.join(''));

		var html = 	'<div class="container">'+
							'<div class="titlebar">WELCOME</div><br/>'+
							'<h1>欢迎使用xml校验工具！</h1><br>'+
							'<p id="content"></p>'+
							'<div class="footer">'+
								'<button class="button" id="close">关闭</button>'+
							'</div>'+
						'</div>';
			
		$('body').append(html);
		$('button#close').bind('click',function(){
			$('.container').remove();
		});

		getXML();

	}

	dataHandler = function(data) {
		xmlDoc = convertXML(data);
		//console.log(xmlDoc);
	}

	convertXML = function(xmlString){
		var xmlDoc = null;
		//判断浏览器的类型
		//支持IE浏览器 
		if(!window.DOMParser && window.ActiveXObject){   //window.DOMParser 判断是否是非ie浏览器
			var xmlDomVersions = ['MSXML.2.DOMDocument.6.0','MSXML.2.DOMDocument.3.0','Microsoft.XMLDOM'];
			for(var i=0;i<xmlDomVersions.length;i++){
				try{
					xmlDoc = new ActiveXObject(xmlDomVersions[i]);
					xmlDoc.async = false;
					xmlDoc.loadXML(xmlString); //loadXML方法载入xml字符串
					break;
				}catch(e){
				}
			}
		}
		//支持Mozilla浏览器
		else if(window.DOMParser && document.implementation && document.implementation.createDocument){
			try{
				/* DOMParser 对象解析 XML 文本并返回一个 XML Document 对象。
				 * 要使用 DOMParser，使用不带参数的构造函数来实例化它，然后调用其 parseFromString() 方法
				 * parseFromString(text, contentType) 参数text:要解析的 XML 标记 参数contentType文本的内容类型
				 * 可能是 "text/xml" 、"application/xml" 或 "application/xhtml+xml" 中的一个。注意，不支持 "text/html"。
				 */
				domParser = new  DOMParser();
				xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
			}catch(e){
			}
		}
		else{
			return null;
		}

		return xmlDoc;
	}

	function getXML() {
		var xmlUrl = host + '~wangxinyi/logValidation/getXML.php';
		var loadData;
		$.ajax({
			url: xmlUrl,
			scriptCharset: "gbk",
			dataType: "jsonp",
			type:'get',
		});
	}

	//扒出需要的变量，以便对应到一个特定的xml条目
	function getParamsKey(logParams) {
		var params_key = {};

		params_key = logParams;
		return params_key;
	}

	function validateLog(params_key, xmlDoc) {
		var cnt = 0;
		var final_target = [];
		$(xmlDoc).find("action").each(function () {
			if($(this)[0].getAttribute("id") === params_key.logactid) {
				//console.log(1)
				var attr = $(this).children("attr")[0];
				var val = attr.getAttribute("value").split('#');
				var key = attr.getAttribute("key").split('#');
				var type = $(this)[0].getAttribute("type");
				var target = [];

				for (var i = 0; i < key.length; i++) {
					var cur_key_value = params_key[key[i]];
					if(cur_key_value != null) {
						cur_key_value = cur_key_value.toString();
					}
					//console.log("value: " + val[i] + " key: " + key[i] + " cur_key_value: " + cur_key_value);
					var headIndex = ifContain(val[i], cur_key_value);
					//console.log(headIndex);
					if(headIndex >= 0) {
						var cnames = [], node = $(this)[0];
						var title = "";
						headIndex += cur_key_value.toString().length + 1;
						for (var j = headIndex; j < val[i].length; j++) {
							if (val[i].charAt(j) != ';') {
								title += val[i].charAt(j);
							}
							else {
								break;
							}
						};
						cnames.unshift(title);
						while(node.nodeName != "card") {
							cnames.unshift(node.getAttribute("cname"));
							node = node.parentNode;
						}
						cnames.unshift(node.getAttribute("cname"));
						var tmp = {};
						tmp.match_xml = "匹配的XML文件（显示节点树的cname属性）：" + cnames.join('-');
						tmp.cnames = cnames.join('-');
						tmp.match_key = "匹配的key：" + key[i] + " key_value: " + cur_key_value + " 对应的XML value: " + val;
						tmp.key = key[i];
						tmp.key_value = cur_key_value;
						tmp.xml_value = val;
						tmp.logactid = params_key.logactid;
						tmp.type = type;
						target.push(tmp);
						// console.log(tmp.match_xml);
						// console.log(tmp.match_key);


					}
					else {
						break;
					}
				};
				
				if(i == key.length) {
					cnt++;
					//console.clear();
					console.log("找到匹配项:");
					for(var j = 0; j < target.length; j++) {
						console.log(target[j].match_xml);
						console.log(target[j].match_key);
						final_target.push(target[j]);	
					}
				}
			}
		})

		//html = $("#content")[0].innerHTML;
		if(cnt > 0) {
			html = "";
			if(cnt > 1) {
				html += '<p id="warning">匹配到不止一条日志！<br></p>';
			}
			html += '<div class="tongji-res-cont"><table class="tongji-table tongji-table-list">';
			html += '<th>logactid</th><th>匹配的key</th><th>日志的key值</th><th>action-type值</th><th>XML-cnames</th>'

			for (var i = 0; i < final_target.length; i++) {
				html += '<tr>';
				html += '<td>' + final_target[i].logactid + '</td>';
				html += '<td>' + final_target[i].key + '</td>';
				html += '<td>' + final_target[i].key_value + '</td>';
				html += '<td>' + final_target[i].type + '</td>';
				html += '<td>' + final_target[i].cnames + '</td>';
				html += '</tr>';
			};

			html += '</table></form></div>';

			$("#content").html(html);
		}

	}

	function ifContain(val, cur_key_value) {
		if(!cur_key_value || !val) {
			//console.log("undefineD!");
			return -1;
		}

		var headIndex = 0;

		while(headIndex < val.length) {
			var index = val.indexOf(cur_key_value, headIndex), tmpIndex;
			
			if(index < 0) {
				return -1;
			}

			else {
				//检查开头
				tmpIndex = index - 1;
				if(tmpIndex >= 0 && val.charAt(tmpIndex) != ';' && val.charAt(tmpIndex) != '#') {
					headIndex += cur_key_value.toString().length;
					continue;
				}
				//检查结尾
				tmpIndex = index + cur_key_value.length;
				if(tmpIndex < val.length && val.charAt(tmpIndex).toString() != ':') {
					headIndex += cur_key_value.toString().length;
					continue;
				}

				return index;

			}
		}
	}

	F.use('lib/mod_evt',function(evt){
		evt.on('lib/log','beforeSendLog',function(arg){
			var params_key = getParamsKey(arg.logParams);
			console.log(params_key);
			validateLog(params_key, xmlDoc);
		});
	});

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
