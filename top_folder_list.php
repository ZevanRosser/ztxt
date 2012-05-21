<?php
  session_start();
  $files = glob("../*");
  
  if (isset($_SESSION["master"])){
    if ($_SESSION["master"]==true){
      echo "<option value='../ztxt'>EDIT : ztxt</option>\n";
    }
  }
  
  foreach($files as $file){
    
    if (is_dir($file) && $file != "../ztxt"){
      $name = preg_replace("/\.\.\//", "", $file);
      echo "<option value='$file'>$name</option>\n";
    }
  }