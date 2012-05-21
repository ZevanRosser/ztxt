<?php
  /*
  // http://php.net/manual/en/function.unlink.php
  // zibi at nora dot pl 24-Sep-2010 02:01
  
  putraworks.wordpress.com/2006/02/27/php-delete-a-file-or-a-folder-and-its-contents/
  */
  function rmdirr($dirname)
  {
    // Sanity check
    if (!file_exists($dirname)) {
      return false;
    }
    
    // Simple delete for a file
    if (is_file($dirname)) {
      return unlink($dirname);
    }
    
    // Loop through the folder
    $dir = dir($dirname);
    while (false !== $entry = $dir->read()) {
      // Skip pointers
      if ($entry == '.' || $entry == '..') {
        continue;
      }
      
      // Recurse
      rmdirr("$dirname/$entry");
    }
    
    // Clean up
    $dir->close();
    return rmdir($dirname);
  }
  
  
  
  
  if (isset($_POST["name"])){
    $name = stripslashes($_POST["name"]);
    
    
    
    rmdirr($name);
    
    
  }