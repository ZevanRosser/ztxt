<?php
  
  if (isset($_POST["name"])){
   
   $name = $_POST["name"];
   
    if (is_file($name)){
      echo "true";
    }else if (is_dir($name)){
      echo "true";
    }else{
      echo "false";
    }
    
  }
  
?>