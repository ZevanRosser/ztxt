<?php

if (isset($_POST["name"])){
  $file = file_get_contents($_POST["name"]);// or die("There was an error loading " . $_POST["name"] . " you should check your permissions to make sure
    //that php can write to your projects directory. On OSX try running the terminal command chmod -R 777 projects.");
  
  echo $file;
}