<?php

    require_once 'helpers/errors.php';
    require_once 'helpers/ctes.php';
    require_once 'helpers/AuthHelper.php';

    $token = isset($_GET['token']) ? $_GET['token'] : null;
    $function = isset($_GET['function']) ? $_GET['function'] : null; 

    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        if ($function != null) {
            if ($function == 'deleteTokens') {
                //$response = Auth
            }
        } else {
            if ($token != null) 
                $response = AuthHelper::login_verification($token);
            else 
                $response = [
                    "status" => "error",
                    "message" => "No has pasado ningun token!",
                    "timer" => $timer
                ];
        }
        
    }

    echo json_encode($response);