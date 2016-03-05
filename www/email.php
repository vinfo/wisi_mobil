<?php
require 'php_mailer/PHPMailerAutoload.php';

// Do not edit this if you are not familiar with php
error_reporting (E_ALL ^ E_NOTICE);
$post = (!empty($_POST)) ? true : false;
if($post) {
    
    $name = stripslashes($_POST['name'] . ' ' . $_POST['last_name']);
    $mail = $_POST['mail'];
    $title = stripslashes($_POST['title']);
    $msg = stripslashes($_POST['message']);
    
    // Check Name Field
    if(!$name) {
        $error .= 'Please enter your name.<br />';
    }
    
    // Checks Email Field
    if(!$mail) { 
        $error .= 'Please enter an e-mail address.<br />';
    }

    // Checks Subject Field
    if(!$title) {
        $error .= 'Please enter your subject.<br />';
    }
    
    // Checks Message (length)
    if(!$msg) {
        $error .= "Please enter your message.<br />";
    }
    
    // Let's send the email.
    if(!$error) {
        
        $mailer = new PHPMailer;

        //$mailer->SMTPDebug = 3;                               // Enable verbose debug output

        $mailer->isSMTP();                                      // Set mailer to use SMTP
        //Set the hostname of the mail server
        $mailer->Host = 'smtp.gmail.com';
        //Set the SMTP port number - 587 for authenticated TLS, a.k.a. RFC4409 SMTP submission
        $mailer->Port = 587;
        //Set the encryption system to use - ssl (deprecated) or tls
        $mailer->SMTPSecure = 'tls';
        //Whether to use SMTP authentication
        $mailer->SMTPAuth = true;
        //Username to use for SMTP authentication - use full email address for gmail
        $mailer->Username = "krzysztof.furtak@gmail.com";
        //Password to use for SMTP authentication
        $mailer->Password = "Zub-zyp-Nvx-8uo";

        $mailer->From = $mail;
        $mailer->FromName = $name;
        $mailer->addAddress('krzysztof.furtak@gmail.com', 'Information');     // Add a recipient
        $mailer->addReplyTo($mail, $name);

        $mailer->isHTML(true);                                  // Set email format to HTML

        $mailer->Subject = $title;
        $mailer->Body    = $msg;

        if(!$mailer->send()) {
            $response['error'] = true;
            $response['msg'] = 'Message could not be sent.';
            $response['msg'] .= 'Mailer Error: ' . $mailer->ErrorInfo;
        } else {
            $response['error'] = false;
            $response['msg'] = 'Message has been sent';
        }

    } else {
        $response['error'] = true;
        $response['msg'] = $error;
    }

    echo json_encode($response);
}
