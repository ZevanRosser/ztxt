<?php
  if (!isset($_GET["p"])){
    die("no url to test");
  } 
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0;url=<?php echo $_GET['p']; ?>" />
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/theme.css">
  <style>
    body{
      padding : 15px; 
    }
  </style>
</head>
  
<body>
  loading...
</body>
</html>