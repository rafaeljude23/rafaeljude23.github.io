<?php
ob_start(); 
require_once("contact.php");
ob_end_clean();
echo $name;
?>