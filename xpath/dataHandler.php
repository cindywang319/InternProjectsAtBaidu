<!DOCTYPE html>
<html>
<body>
<?php
$day = date("Ymd",strtotime("-6 day"));
$datafile1 = fopen("/home/wangxinyi/public_html/xpath/data/xpath_clk_".$day, "r") or die("Unable to open file!");
$datafile2 = fopen("/home/wangxinyi/public_html/xpath/data/card_pv_".$day, "r") or die("Unable to open file!");
$data = array();
$pv = array();
$tmp_data = array();
$logactid = array();

while(!feof($datafile2)) {
	$line = fgets($datafile2);
	$arr = split('	', $line);
	$pv[$arr[0]] = $arr[1];
}

while(!feof($datafile1)) {
	//print "now";
	$line = fgets($datafile1);
	$arr = split('	', $line);
	$clk = $arr[2];
	$rate = $clk / $pv[$arr[0]];

	if($rate < 0.0001) {
		$tmp_data[$arr[0]][$arr[1]] = $arr[2];
	} else {
		$data[$arr[0]][$arr[1]] = $arr[2];
	}
	if(!in_array($arr[0], $logactid) && $arr[0]) {
		array_push($logactid, $arr[0]);
	}
}


foreach ($logactid as $id) {
	while ($clk_num = current($tmp_data[$id])) {
		$xpath = key($tmp_data[$id]);
		//echo $xpath." ".$clk_num."<br/>";

		while($xpath) {
			$pos = strrpos($xpath, "-");
			$xpath = substr($xpath, 0, $pos);
			if(array_key_exists($xpath, $data[$id])) {
				$data[$id][$xpath] += $clk_num;
				//echo "new: ".$data[$id][$xpath] . "<br/>";
				break;
			}
		}
		next($tmp_data[$id]);
	}
}

while ($xpath_clk = current($data)) {
	$filename = "/home/wangxinyi/public_html/xpath/interface/" . key($data) . ".json";
	$jsonfile = fopen($filename, "w+") or die("Unable to open file2!");
	$content = 'loadData({
	"pv": '.trim($pv[key($data)]).',
	"clk": [ 
';
	fwrite($jsonfile, $content);



	while ($clk = current($xpath_clk)) {
		$xpath = key($xpath_clk);
		$content = '		{
			"xpath": "'.$xpath.'",
			"clk_num": "'.trim($clk);

		if(!next($xpath_clk)) {
			$content = $content.'"
		}
';
		} 

		else {
		$content = $content.'"
		}, 
';
		}
		fwrite($jsonfile, $content);

	}
	next($data);


	$content = '	]
});';
	fwrite($jsonfile, $content);
	fclose($jsonfile);
}

fclose($datafile1);
fclose($datafile2);
?>

</body>
</html>