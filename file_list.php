<?php

if (isset($_REQUEST["dir"])){
  $dir = $_REQUEST["dir"];
}else{
  if (is_dir("../projects")){
    $dir = "../projects";
  }else{
    die("you need to add a projects directory");
  }
}

$output = shell_exec('chmod 777 -R ' . $dir);

$index = 0;

$data = array();


$files = array_merge(glob("$dir/.htaccess"), glob("$dir/.htpasswd"));
$files = array_merge(glob("$dir/*"), $files);
showContents($files, $dir, $data);

echo "<ul id='documentList'>";
toList($data);
echo "</ul>";

// 

function splitLast($str, $exp="/\//"){
  $n = preg_split($exp, $str);
  return $n[count($n) - 1];
}


function showContents($folder, $name, &$data){
  $n = $name;//splitLast($name) . "/x";
  $data[$n] = array();
  //$data[$n[count($n) - 1]] = array();
  $dirs = array();
  foreach($folder as $key){
    
    if (is_dir($key) && $key !="condos" && $key != "properties"){
      array_push($dirs, $key);
    }else{
      $k = $key; //splitLast($key);
      $data[$n][$k] = $k;
    }
  }
  if (count($dirs) > 0){
    foreach ($dirs as $dir){
       $files = array_merge(glob("$dir/.htaccess"), glob("$dir/.htpasswd"));
       $files = array_merge(glob("$dir/*"), $files);
      showContents($files, $dir, $data[$n]);
    }
  }
}

$top = 0;
// http://stackoverflow.com/questions/1884188/how-to-convert-a-multi-level-array-to-ul
function toList($multi_dimensional_array){
  global $top;
  $m = $multi_dimensional_array;

  $keys = array();
  foreach($m as $key=>$value)
  {
          $keys[] = $key;
  }

  $i = 0;
  while($i < count($multi_dimensional_array))
  {
          $isDirectory = is_array($multi_dimensional_array[$keys[$i]]);
          
          
          $path = $keys[$i];
          $key = splitLast($keys[$i]);
          
          if($isDirectory)
          {
          
          echo '<li class="directory" data-path="'.$path.'"><span data-path="'.$path.'">'.$key.'</span>';
                  echo '<ul>';
                  
                  toList($multi_dimensional_array[$keys[$i]]);
                  echo '</ul>';
                  $top++;
          }else{
            $ext = splitLast($key,"/\./");
            echo '<li class="ext_'.$ext.' file" data-path="'.$path.'" data-ext="'.$ext.'"><span data-path="'.$path.'">'.$key.'</span>';
          }
          echo '</li>';
          $i++;
  }
}
