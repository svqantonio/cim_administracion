<?php

    require_once 'helpers/errors.php';
    require_once 'helpers/data_tables.php';
    require_once 'helpers/ctes.php';

    $table = isset($_GET['table']) ? $_GET['table'] : null;
    $function = isset($_GET['function']) ? $_GET['function'] : null;
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    $valor = isset($_GET['valor']) ? $_GET['valor'] : null;

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        if ($id != null && $valor != null) {
            //Terminar de ver como puedo plantear este metodo, ya que voy a tener que editar tambien las mujeres y a las muy malas los documentos. Ver si me sale rentable mandarle un json.
            $response = Data_tables::editValues($table, $id, $)
        } else {
            $response = Data_tables::getTableDates($table);
            header('Content-Type: application/json');
            header('Content-Type: text/html; charset=utf-8');
            echo json_encode($response);
        }
    }