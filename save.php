<?php

if (isset($_POST["name"])){
  $name = stripslashes($_POST["name"]);
  
  $noDots = substr ( $name , 2);
  
  if (!strstr($noDots,".")){
    mkdir($name);
  }else{
    $file = fopen($name, "w") or die();
    $content = $_POST["content"];
    $content = preg_replace("/\+/", "%2B", $content);
    fwrite($file, urldecode($content));
    fclose($file);
  }
}