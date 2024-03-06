<?php
    require_once "./helpers/ctes.php";
    require_once "./helpers/AuthHelper.php";
    require_once "./helpers/cleanTokens.php";

    $page = isset($_GET['pag']) ? $_GET['pag'] : '';
    $token = isset($_GET['token']) ? $_GET['token'] : null;
    $logout = $_GET['logout'];

    $routes = [
        'main.html' => 'main.html',
        'index.html' => 'index.html',
    ];

    if (isset($logout)) {
        if (array_key_exists($page, $routes))
            echo json_encode(array('redirect' => $page));
        else
            echo json_encode(array('error' => 'Página no encontrada'));
    } else {
        $res = AuthHelper::logued($token);
        if ($res) {
            if (array_key_exists($page, $routes))
                echo json_encode(array('redirect' => $page));
            else 
                echo json_encode(array('error' => 'Página no encontrada'));
        } else {
            return false;
        }        
    }