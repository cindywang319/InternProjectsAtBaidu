<?php
function smarty_modifier_sp_escape_js($str){

	$str = strval($str);
	
	return str_replace(array(
		"\\","'","\"","/","\n","\r"
	), array(
		"\\\\","\\x27","\\x22","\\/","\\n","\\r"
	), $str);
}

echo "dataHandler('";
$res = shell_exec('curl http://m1-super-rdtest004.vm.baidu.com:8010/xml_dir/quotaConf/nsuperplus_all.xml');
echo smarty_modifier_sp_escape_js($res);
echo
 "');";
?>