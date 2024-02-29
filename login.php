<?php
    require_once 'helpers/ctes.php';
    require_once 'helpers/AuthHelper.php';
    require_once 'helpers/cleanTokens.php';

    $cleanTokens = new cleanTokens();
    $cleanTokens->deleteOldTokens();

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $response = AuthHelper::login($_POST['user'], $_POST['password']);
        header('Content-Type: application/json');
        echo json_encode($response);
    }