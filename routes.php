<?php
    require_once "./helpers/ctes.php";
    require_once "./helpers/AuthHelper.php";
    require_once "./helpers/cleanTokens.php";

    $page = isset($_GET['pag']) ? $_GET['pag'] : null;
    $token = isset($_GET['token']) ? $_GET['token'] : null;
    $logout = isset($_GET['logout']) ? $_GET['logout'] : null;
    $table = isset($_GET['table']) ? $_GET['table'] : null;

    $routes = array(
        'main.html' => 'main.html',
        'index.html' => 'index.html',
        'changes.php' => 'changes.php'
    );

    if (isset($logout)) {
        if (array_key_exists($page, $routes))
            echo json_encode(array('redirect' => $page));
        else
            echo json_encode(array('error' => 'Página no encontrada', 'redirect' => null));
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