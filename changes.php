<?php

    require_once 'helpers/errors.php';
    require_once 'helpers/data_tables.php';
    require_once 'helpers/ctes.php';

    $table = isset($_GET['table']) ? $_GET['table'] : null;
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    $valor = isset($_GET['valor']) ? $_GET['valor'] : null;

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        if ($table != null) {
            if ($id != null && $valor != null) {
                $response = Data_tables::editValues($table, $id, $valor);
                header('Content-Type: application/json');
                header('Content-Type: text/html; charset=utf-8');
                echo json_encode($response);
            } else if ($id != null && $valor == null) {
                $response = Data_tables::deleteValues($table, $id);
                header('Content-Type: application/json');
                header('Content-Type: text/html; charset=utf-8');
                echo json_encode($response);
            } else {
                $response = Data_tables::getTableDates($table);
                header('Content-Type: application/json');
                header('Content-Type: text/html; charset=utf-8');
                echo json_encode($response);
            }
        } else {
            $response = array('status' => 'error', 'message' => 'No has pasado ninguna tabla!', 'timer' => $timer);
            echo json_encode(response);
        }
    }