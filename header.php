<?php
  session_start();
  
  if (isset($_GET["master"])){
    $_SESSION["master"] = true;
  }else{
    $_SESSION["master"] = false;
  }
  
$parent = ".htaccess";
  
  if (is_file($parent)){
    // some kind of message here?
  }else{
    $file = fopen($parent, "w");
    if (!$file) //die("error writing to parent directory");
      
      $str = '<FilesMatch "\.(.*)$">
        FileETag None
        <IfModule mod_headers.c>
        Header unset ETag
        Header set Cache-Control "max-age=0, no-cache, no-store, must-revalidate"
        Header set Pragma "no-cache"
        Header set Expires "Wed, 11 Jan 1984 05:00:00 GMT"
        </IfModule>
        </FilesMatch>';
    
    fwrite($file, $str);
    fclose($file);
    
    
  }