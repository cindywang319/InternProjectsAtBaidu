<!DOCTYPE html>
<html>
<head>
<title>Edit XML</title>
<script src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.0.js"></script>
<script type="text/javascript">
function addContent(str) {
	$('#code')[0].value += str + "\n";
}
function writeEntry() {
	var content = $('#code')[0].value;
	alert(content);
	<?php 
		writeDocument($content); 
	?>;
}
</script>

<link rel=stylesheet href="../codemirror/doc/docs.css">
<link rel="stylesheet" href="../codemirror/lib/codemirror.css">
<script src="../codemirror/lib/codemirror.js"></script>
<script src="../codemirror/xml/xml.js"></script>
<style type="text/css">
.CodeMirror {
	border-top: 1px solid black; 
	border-bottom: 1px solid black;
}
</style>
</head>

<article>
<h2>XML Editor</h2>
<form><textarea id="code" name="code">

</textarea></form>

<?php
$datafile1 = fopen("/home/wangxinyi/public_html/xml/sample.xml", "r") or die("Unable to open!");
while (!feof($datafile1)) {
	$line = "'".rtrim(fgets($datafile1))."'";
	echo "<script>addContent($line)</script>";
}
function writeDocument($content) {
	$des = "/home/wangxinyi/public_html/xml/new_sample.xml";
	$xmlfile = fopen($des, "w+") or die("Unable to open file2!");
	fwrite($xmlfile, $content);
}
fclose($datafile1);
?>

<script>
  var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
	mode: "text/html",
	lineNumbers: true,
	//lineWrapping: true,
  });
</script>
</article>

</html>