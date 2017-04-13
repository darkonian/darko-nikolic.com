<?php
    $to="info@darko-nikolic.com";
    $subject = $_POST['subject'];
    $message = $_POST['text'];
    $from = $_POST['email'];
    $headers = "Contact form mail from:". $_POST['name']." - ".$from;
    mail($to,$subject,$message,$headers);
?>