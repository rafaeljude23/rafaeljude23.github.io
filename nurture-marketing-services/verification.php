<?php

    session_start();
    require_once("paths.php");

    //You can customize your captcha settings here

    $captcha_code = '';
    $captcha_image_height = 50;
    $captcha_image_width = 130;
    $total_characters_on_image = 5;

    //The characters that can be used in the CAPTCHA code.
    //avoid all confusing characters and numbers (For example: l, 1 and i)
    $possible_captcha_letters = 'bcdfghjkmnpqrstvwxyz23456789';
    $captcha_font = 'arial';


    // Set the environment variable for GD
    putenv('GDFONTPATH=' . realpath('.'));
    $font = 'arial';
    // END OF ADDITION FOR THE GD LIBRARY

    $count = 0;
    while ($count < $total_characters_on_image) {
        $captcha_code .= substr(
            $possible_captcha_letters,
            mt_rand(0, strlen($possible_captcha_letters)-1),
            1);
        $count++;
    }

    $captcha_font_size = $captcha_image_height * 0.65;

    $captchaBg_index = rand(0, count($captchas)-1);

    $imgBgPath = $captchas[$captchaBg_index]->src;
    $captcha_text_color = $captchas[$captchaBg_index]->textColor; 


    $imageInit = imagecreatefrompng($imgBgPath);

    $imageInit_width = imagesx($imageInit);
    $imageInit_height = imagesy($imageInit);

    $image = imagecreatetruecolor($captcha_image_width, $captcha_image_height);

    imagealphablending( $image, false );
    imagesavealpha( $image, true );

    imagecopyresampled($image, $imageInit, 0, 0, 0, 0, $captcha_image_width, $captcha_image_height, $imageInit_width, $imageInit_height);


    $array_text_color = hextorgb($captcha_text_color);
    $captcha_text_color = imagecolorallocate(
        $image,
        $array_text_color['red'],
        $array_text_color['green'],
        $array_text_color['blue']
    );

    /* Create a text box and add 6 captcha letters code in it */

    $text_box = imagettfbbox(
        $captcha_font_size,
        0,
        $captcha_font,
        $captcha_code
    );

    $x = ($captcha_image_width - $text_box[4])/2;
    $y = ($captcha_image_height - $text_box[5])/2;

    imagettftext(
        $image,
        $captcha_font_size,
        0,
        $x,
        $y,
        $captcha_text_color,
        $captcha_font,
        $captcha_code
    );

    /* Show captcha image in the html page */
    // defining the image type to be shown in browser widow

    header('Content-Type: image/jpeg');
    imagejpeg($image); //showing the image
    imagedestroy($captcha_image); //destroying the image instance
    $_SESSION['captcha'] = $captcha_code;

    function hextorgb ($hexstring){
        $integar = hexdec($hexstring);
        return array("red" => 0xFF & ($integar >> 0x10),
            "green" => 0xFF & ($integar >> 0x8),
            "blue" => 0xFF & $integar);
    }

?>