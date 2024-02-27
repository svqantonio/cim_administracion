<?php

    $servername = "localhost";  
    $username = "root";    
    $password = "";  
    $dbname = "cim_duplicada";

    $options = array(
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4",
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    );

    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password, $options);

    $files = [
        'index' => 'index.php',
        'main' => 'main.php',  
    ];