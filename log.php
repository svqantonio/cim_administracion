<?php

    require_once 'helpers/errors.php';
    require_once 'helpers/ctes.php';
    require_once 'helpers/AuthHelper.php';

    $function = isset($_GET['function']) ? $_GET['function'] : null;

    //En ambos es POST ya que cuando me logueo inserto token, y en el logout borro token
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        if ($function !== null) {
            if ($function === 'login') {
                $response = AuthHelper::login($_POST['user'], $_POST['password']);
            } else if ($function === 'logout') {
                $response = AuthHelper::logout($_POST['token']);
            } else if ($function === 'register') {
                $response = AuthHelper::register($_POST['user'], $_POST['password']);
            }
        }
    }
    echo json_encode($response);