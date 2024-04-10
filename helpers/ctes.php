<?php
    date_default_timezone_set('Europe/Madrid');

    //Datos de mi servidor privado
    /*$servername = "localhost";  
    $username = "root";    
    $password = "4690aGa!=$$";  
    $dbname = "cim";*/

    //Datos del servidor del CIM
    $servername = "lldn637.servidoresdns.net";
    $username = "qaik701";
    $password = "Ant0n10Cabr0n";
    $dbname = "qaik695";

    $options = array(
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4",
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    );

    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password, $options);

    $timer = 1500;