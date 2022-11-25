<?php
//   curl -F token=$DEPLOY_TOKEN_42PUB  -F site=@"/tmp/${test_identy}.tar" https://42.pub/static_pages/upload.php --insecure

session_start();
$message = ''; 

if(isset($_POST['token']) && $_POST['token'] == '')
{
  if (isset($_FILES['site']) && $_FILES['site']['error'] === UPLOAD_ERR_OK)
  {
    // get details of the uploaded file
    $fileTmpPath = $_FILES['site']['tmp_name'];
    $fileName = $_FILES['site']['name'];
    $fileSize = $_FILES['site']['size'];
    $fileType = $_FILES['site']['type'];
    $fileNameCmps = explode(".", $fileName);
    $fileExtension = strtolower(end($fileNameCmps));
    
    if ($fileExtension == 'tar')
    {
      $uploadFileDir = './uploaded_files/';
      $dest_path = $uploadFileDir . $fileNameCmps[0] . ".tar";
      move_uploaded_file($fileTmpPath, $dest_path);
      $static_site_path = "/var/www/42pub/data/www/subdomain/${fileNameCmps[0]}";
      if ($fileNameCmps[0] == ""){
        $message ='broken identy'.$fileNameCmps[0];
      } else {
        // Sanitize whole here....
        exec("rm -rf ${static_site_path}");
        exec("mkdir -p ${static_site_path}");
        #$phar = new PharData($dest_path);
        #$phar->extractTo($static_site_path);
        echo "tar -xf ${dest_path} -C ${static_site_path}";
        exec("tar -xf ${dest_path} -C ${static_site_path}");
        exec("rm -rf ${dest_path}");
        $message ='site is successfully uploaded.';
      }
    }
    else
    {
      $message = 'Only tar allowed';
    }
  }
  else
  {
    $message = 'There is some error in the file upload. Please check the following error.<br>';
    $message .= 'Error:' . $_FILES['site']['error'];
  }
} else {
  $message = '403';
}



echo $message;
