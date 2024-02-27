<?php
    // Para reportar errores estas 3 primeras líneas de código
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    require_once 'helpers/ctes.php';
    require_once 'helpers/AuthHelper.php';

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $response = AuthHelper::login($_POST['user'], $_POST['password']);

        header('Content-Type: application/json');
        echo json_encode($response);
    }