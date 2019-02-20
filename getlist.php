<?php 
require("../common/include/functions.php");
require("../common/include/mysqli_class.php");
require("../common/class/includeall.php");

$id=(int)$_GET['id'];

if(empty($id)) exit;
$activ_id=$id;

$db = new Mysqlidb();
if(!$db->isconn())
{
  $succ=0;
  $errstr='系统正忙,请稍后再试！';	
  echo $errstr;
  exit;
}

//调取ipad拍照的照片和单反上传的照片
$sql = "select * from ipad_qd_img  where  activ_id = '{$activ_id}'  ORDER BY a_id desc limit 0,760";
$rs =$db->get_all($sql);


for ($i=0; $i <count($rs) ; $i++) { 
	
  $res[$i]['a_id'] = $rs[$i]['a_id'];
  $res[$i]['imgSrc'] = $rs[$i]['picurl'];//头像
}
if(empty($rs)) $res=array();


$redata=array(
				'rows'=>$res,
	);
	echo json_encode($redata);
	exit;





?>