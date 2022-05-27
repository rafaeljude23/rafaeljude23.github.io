<?php

session_start();

$name = $_POST['name'];
$email = $_POST['email'];
$subject = 'New Message Request Submitted by ';
$message = $_POST['message'];
$captchaCode =  $_POST['captchacode'];
$status = '';


// Checking For Captcha..
if ( isset($captchaCode) && ($captchaCode!="") ){
// Validation: Checking entered captcha code with the generated captcha code
    if(strcasecmp($_SESSION['captcha'], $captchaCode) != 0){

        $status = "<p style='color:#FFFFFF; font-size:20px'>
<span style='background-color:#ff0000;'>Entered captcha code does not match! 
Kindly try again.</span></p>";

    }else{
        // Recipient
        // $toEmail = 'contact@maxdiversityglobal.com';
        $toEmail = 'contact@diamonddynamics.com';

        // Sender
        $from = 'email';
        $fromName = $name;

        // Subject
        $emailSubject = 'New Message Request Submitted by '.$name;

        // Message
        $htmlContent = '<h2>Contact Form Request</h2>
                    <p><b>Name:</b> '.$name.'</p>
                    <p><b>Email:</b> '.$email.'</p>
                    <p><b>Subject:</b> '.$subject.'</p>
                    <p><b>Message:</b><br/>'.$message.'</p>';

        // Header for sender info
        $headers = "From: $fromName"." <".$from.">";


        // Message lines should not exceed 70 characters (PHP rule)
        // $message = wordwrap($message, 70, "\r\n");
    }
    if(!empty($_POST['name']) && !empty($_POST['email']))
        $status.= header('Location:problem.html');


    // Send Mail
    // Set content-type header for sending HTML email
    $headers .= "\r\n". "MIME-Version: 1.0";
    $headers .= "\r\n". "Content-type:text/html;charset=UTF-8";

    // Send Mail
    if (mail($toEmail, $emailSubject, $htmlContent, $headers )) {
        echo header('Location:thankyou.html');
    } else {
        echo header('Location:problem.html');
        exit ;
    }
} 
echo $status;
?>