<?php
    require_once 'helpers/AuthHelper.php';
    require_once 'helpers/ctes.php';

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $user = $_POST['user']; 
        $password = $_POST['password'];
        
            $res = AuthHelper::register($_POST['user'], $_POST['password']);

            if ($res['status'] == true) {
                echo "<script>
                            alert('" . $res['message'] . "');
                            window.location.href = 'administration_index.php';
                        </script>";
                exit;
            } else {
                echo "<script>
                            alert('" . $res['message'] . "');
                            window.history.back();
                        </script>";
                exit;
            }
    }