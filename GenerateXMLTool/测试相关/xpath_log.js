/**
* @author   : xuyabin
* @date     : 2014-08-12
* @overview : xpath方式打日志
*/
F.addLog('superplus:lib/xpath_log', ['xpathLog']);
F.module('superplus:lib/xpath_log',function(require,exports,ctx){

	//统计节点 目前只统计卡片
	//这里写入需要统计的dom id即可
	//在这个dom里的点击都会尝试发送xpath日志 
	//同时需要注意 当xpath寻路发现一个节点有data-logactid字段，就会停止寻路，发送日志
	//log-id值会成为对应日志的logactid字段
	//s_ctner_contents 是卡片外框id
	var logDom = ['s_ctner_contents'];

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
	        path.push(node.getAttribute('data-logactid'));
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

	var pathLogTimer = {};
	var pathLog = function(node,path,type){
		pathLogTimer[type] && clearTimeout(pathLogTimer[type]);
		pathLogTimer[type] = setTimeout(function(){
			if (path[0] == undefined){
				return ;
			}
			var logParm = {			
				'logactid'  : path.shift(0),
				'xlogtype'  : type,
				'xnodename' : node.nodeName.toLowerCase(),
				'xpath'     : path.join('-'), //完整xpath
				'xpaths'    : path.join('-').replace(/\d/g,''), //简化的xpath

                // 根据userId抽样统计
                strategyHit: s_session.strategy_hit
			}

			for(var i=0;i<path.length;i++){
				logParm['xindex'+i] = path[i].replace(/[A-Za-z]/g,'');
				(logParm['xindex'+i] == '') && (logParm['xindex'+i] = '1');
			}
			
			var count = 3,nodel = node;

			while(count>0 && nodel && nodel.nodeName && nodel.nodeName.toLowerCase()!='a' && nodel.nodeType == 1){
				nodel = nodel.parentNode;
				count -- ;
			}
			if (nodel && nodel.nodeName && nodel.nodeName.toLowerCase()=='a'){
				logParm.title = $.trim($(nodel).text());
				logParm.url   = $(nodel).attr('href');
			}

			ctx.fire('xpathLog',logParm);
		},300);		
	};

	//绑定事件 目前只做点击日志 
	//mousedown  -> 点击
	var bindEvent = function(item){
		$('#'+item).on('mousedown',function(e){
			var t = e.target,
				xpath = (getXPath(t,$('#'+item)[0]));
			pathLog(t,xpath,'click');
		});
	};

	exports.init = function(){
		$.each(logDom,function(i,e){
			bindEvent(e);
		});
	};	
});
