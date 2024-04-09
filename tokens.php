<?php

    require_once 'helpers/errors.php';
    require_once 'helpers/cleanTokens.php';

    $token = isset($_GET['token']) ? $_GET['token'] : null;
    $function = isset($_GET['function']) ? $_GET['function'] : null;
    
    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        if ($token != null) {        
            $instancia = new cleanTokens();
            $response = $instancia->checkTokenDate($token);
        } 
    } else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        if ($function == 'deleteOldTokens') {
            $manejo_tokens = new cleanTokens();
            $response = $manejo_tokens->deleteOldTokens();
        } 
    }
    echo json_encode($response);