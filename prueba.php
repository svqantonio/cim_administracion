<?php
//La idea es que este archivo sustituya al manage_tables.php
    require_once 'helpers/errors.php';
    require_once 'helpers/ctes.php';
    require_once 'helpers/data_tables.php';

    $table = isset($_GET['table']) ? $_GET['table'] : null;
    $query = isset($_GET['query']) ? $_GET['query'] : null;
    $page = isset($_GET['page']) ? $_GET['page'] : null;
    $filter = isset($_GET['filter']) ? $_GET['filter'] : null;
    $function = isset($_GET['function']) ? $_GET['function'] : null;
    $id = isset($_GET['id']) ? $_GET['id'] : null;
        
    //Método GET para las peticiones en las que solamente se cogen datos
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if ($table === 'mujeres') {
            if ($id !== null) {
                $response = Data_tables::getWomanDates_ID($id);
            } else {
                if ($function === 'count') {
                    $response = Data_tables::countGetWomenTableDates($query); 
                } else {
                    $response = Data_tables::getWomenTableDates_prueba($query, $page, $filter);
                }
            }
        } else {
            //Cuando la tabla NO es mujeres 
            $response = Data_tables::getTableDates();
        }
    //Método POST para las peticiones donde se modifican datos
    } else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if ($function === 'deleteValues') {
            $response = Data_tables::deleteValues($table, $id);
        } else {
            if ($table === 'mujeres') {
                $response = Data_tables::editWoman($id, $data);
            } else {
                $response = Data_tables::editValues($table, $id, $value);
            }
        }
    }
    
    echo json_encode($response);