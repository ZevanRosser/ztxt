<?php

if (isset($_POST["name"])){
  $file = file_get_contents($_POST["name"]);
  
  if ($file == ""){
    echo $file;
  }else if (!$file){
    die("ztxt:error:ztxt");
  }else{
    echo $file;
  }
}