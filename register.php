<?php
    require_once 'helpers/AuthHelper.php';
    require_once 'helpers/ctes.php';

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {        
        $response = AuthHelper::register($_POST['user'], $_POST['password']);

        header('Content-Type: application/json');
        echo json_encode($response);
    }