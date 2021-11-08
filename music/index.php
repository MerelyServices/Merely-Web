<?php
if(isset($_POST['email'])){
  require('../../mailing.conn.php');
  if(filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)){
    $email = $conn->escape_string($_POST['email']);
    if(count($email)<=255){
      $result = $conn->query("INSERT INTO subscriber(Email, ListId) VALUES(\"$email\", 1)");
      if(!$result){
        switch($conn->errno){
          case 1062: // Duplicate key
            $msg = "You've already subscribed to this list!";
            $status = 'warning';
          break;
          default:
            $msg = "An unknown error occured. Please try again later.";
            $status = 'error';
        }
      }else{
        $msg = "Success! You will be emailed when Merely Music launches.";
        $status = 'info';
      }
    }else{
      $msg = "That's an invalid email address!";
      $status = 'error';
    }
  }else{
    $msg = "That's an invalid email address!";
    $status = 'error';
  }
};
?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Merely Music</title>

  <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;1,400&display=swap" rel="stylesheet">
  <style>
    body{
      font-family: 'Roboto', sans-serif;
      color: #fff;
      line-height: 1;
      text-align: center;
    }
    .background {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: -1000;
    }
    .gradient {
      background-color: #66439A;
      background-image: linear-gradient(135deg, #813694 0%, #454B9F 100%);
      transition: background-color 2s;
    }
    .floaty{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    img.floaty{
      margin-top: -2rem;
      z-index: -100;
      width: 50vw;
      height: auto;
      min-width: 15rem;
      max-width: 30rem;
      opacity: 0.6;
    }
    h1.floaty{
      font-size: 3rem;
      margin-top: -30vh;
      font-weight: 100;
      width: 90%;
    }
    form.floaty{
      margin-top: 20vh;
      width: 70%;
      max-width: 20rem;
      background: rgba(196,196,196,0.5);
      border-radius: 2rem;
      box-shadow: rgba(0,0,0,0.25) 0 0.1rem 0.5rem;
      padding: 1rem;
      font-size: 24px;
    }
    input{
      background: rgba(255,255,255,0.5);
      border-radius: 1rem;
      box-shadow: rgba(0,0,0,0.25) 0 0.1rem 0.5rem;
      padding: 0.5rem;
      border: none;
      transition: background 250ms;
    }
    input:hover{
      background: rgba(255,255,255,0.75);
    }
    input:focus{
      outline: none;
    }
    input[type=email]{
      width: calc(100% - 3rem);
      border-radius: 1rem 0 0 1rem;
      height: 1.1em;
    }
    input[type=submit]{
      border-radius: 0 1rem 1rem 0;
      float: right;
      width: 1em;
      height: 1.1em;
      text-align: center;
      box-sizing: content-box;
    }
    .message{
      max-width: 16rem;
      background: rgba(64,64,64,0.5);
      border-radius: 2rem;
      box-shadow: rgba(0,0,0,0.25) 0 0.1rem 0.5rem;
      padding: 1rem;
      padding-top: 1.5rem;
      font-size: 1em;
      font-weight: 600;
      text-align: left;
    }
    .message.floaty{
      margin-top: calc(20vh + 5rem);
    }
    .message::before{
      position: absolute;
      font-size: 10px;
      top: 0.8rem;
      float: left;
    }
    .message.info::before{
      content: "INFO";
    }
    .message.warning::before{
      content: "WARNING";
      color: #f39c12;
    }
    .message.error::before{
      content: "ERROR";
      color: #e74c3c;
    }
  </style>
</head>
<body>
  <div class="background gradient"></div>
  <img class="floaty" src="/music/logowhite.png" width="516" height="516" alt="Merely Logo (white)">
  <h1 class="floaty">Coming soon...</h1>
  <form class="floaty" action="" method="POST">
    <input type="email" name="email" placeholder="email@example.com">
    <input type="submit" value=">">
  </form>
  <?php
  if(isset($msg)) echo "<p class=\"floaty message $status\">$msg</p>";
  ?>
</body>
</html>