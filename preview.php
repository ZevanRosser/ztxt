<?php
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past
if (isset($_GET["path"])){
  require_once($_GET["path"]);
}else{
  echo "ZTXT Prevew - please enter a path...";
}
