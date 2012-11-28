<?php

if (isset($_POST["name"])){
  $name = stripslashes($_POST["name"]);
  
  rename($name, $_POST["newName"]);
  
}
  