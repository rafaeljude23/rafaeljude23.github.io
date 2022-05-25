<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

$fullname = $_POST['fullname'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$message = $_POST['message'];

$errors = [];
$data = [];


if (array_key_exists('email', $_POST)) {

    if (empty($_POST['fullname'])) {
        $errors['name'] = 'Name is required.';
    }

    if (empty($_POST['email'])) {
        $errors['email'] = 'Email is required.';
    }

    if (empty($_POST['phone'])) {
        $errors['phone'] = 'Subject is required';
    }

    if (!empty($errors)) {
        $data['success'] = false;
        $data['errors'] = $errors;

    } else {
        //Create an instance; passing `true` enables exceptions
        $mail = new PHPMailer(true);


        try {
            //Server settings
            // $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
            $mail->isSMTP();                                            //Send using SMTP
            $mail->Host       = 'smtp.gmail.com';                     //Set the SMTP server to send through
            $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
            $mail->Username   = 'nickalbertcals@gmail.com';                     //SMTP username
            $mail->Password   = 'oexmbxkaaiiglmfj';                               //SMTP password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
            $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

            //Recipients
            $mail->setFrom($email, 'Inspiration Marketing');
            $mail->addAddress('rafaeljude23@gmail.com', 'Inspiration Marketing');     //Add a recipient
            // $mail->addAddress('ellen@example.com');               //Name is optional
            $mail->addReplyTo($email, 'Information');
            // $mail->addCC('cc@example.com');
            // $mail->addBCC('bcc@example.com');

            //Attachments
            // $mail->addAttachment('/var/tmp/file.tar.gz');         //Add attachments
            // $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name

            //Content
            $mail->isHTML(true);                                  //Set email format to HTML
            $mail->Subject = 'New Contact From Inspiration Marketing';
            $mail->Body    = 'Email: '.$email.'<br>Full Name: '.$fullname.'<br>Subject: '.$phone.'<br>Message: '.$message;
            $mail->AltBody = 'Email: '.$email.' | Full Name: '.$fullname.' | Subject: '.$phone.' | Message: '.$message;

            $mail->send();
            $data['success'] = true;
            $data['message'] = 'Success!';
          
        } catch (Exception $e) {
            $errors['mailer-error'] = $mail->ErrorInfo;
            $data['success'] = false;
            $data['errors'] = $errors;
           
        }
       
    }

    echo json_encode($data);

    
}