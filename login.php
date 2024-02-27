<?php
    // Para reportar errores estas 3 primeras líneas de código
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    require_once '../helpers/AuthHelper.php';
    require_once '../helpers/ctes.php';

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $res = AuthHelper::login($_POST['user'], $_POST['password']);

        if ($res['status'] == true) {
            $token = $res['token'];
            echo "  <script>
                        alert('" . $res['message'] . "');
                        localStorage.setItem('token', $token);
                        window.location.href = 'administration_index.php';
                    </script>";
            exit;
        } else {
            echo "  <script>
                        alert('" . $res['message'] . "');
                        window.location.href = 'administration_index.php';
                    </script>";
            exit;
        }
    }