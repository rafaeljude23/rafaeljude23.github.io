<?php
    class Captcha
    {
        public $src;
        public $textColor;
    }

    $captcha1 = new Captcha();
    $captcha1->src = 'Resources/Captcha-1.png';
    $captcha1->textColor = '0x9C92A9';

    $captcha2 = new Captcha();
    $captcha2->src = 'Resources/Captcha-2-01.png';
    $captcha2->textColor = '0x40456D';

    $captcha3 = new Captcha();
    $captcha3->src = 'Resources/Captcha-3-01.png';
    $captcha3->textColor = '0x161618';

    $captcha4 = new Captcha();
    $captcha4->src = 'Resources/Captcha-4-01.png';
    $captcha4->textColor = '0x96B1A3';

    $captcha5 = new Captcha();
    $captcha5->src = 'Resources/Captcha-5-01.png';
    $captcha5->textColor = '0x788180';

    $captcha6 = new Captcha();
    $captcha6->src = 'Resources/Captcha-6.png';
    $captcha6->textColor = '0x142864';



    $captchas = array($captcha1, $captcha2, $captcha3, $captcha4, $captcha5, $captcha6);
?>