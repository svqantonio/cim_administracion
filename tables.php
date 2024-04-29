<?php
    //La idea es que este archivo sustituya al manage_tables.php
    require_once 'helpers/errors.php';
    require_once 'helpers/ctes.php';
    require_once 'helpers/TableHelper.php';

    $table = isset($_GET['table']) ? $_GET['table'] : null;
    $query = isset($_GET['query']) ? $_GET['query'] : null;
    $page = isset($_GET['page']) ? $_GET['page'] : null;
    $filter = isset($_GET['filter']) ? $_GET['filter'] : null;
    $function = isset($_GET['function']) ? $_GET['function'] : null;
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    $value = isset($_GET['value']) ? $_GET['value'] : null;
        
    //Método GET para las peticiones en las que solamente se cogen datos
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if ($table === 'mujeres') {
            if ($id !== null) {
                $response = TableHelper::getWomanDates_ID($id);
            } else {
                if ($function === 'count') {
                    $response = TableHelper::countGetWomenTableDates($query); 
                } else {
                    $response = TableHelper::getWomenTableDates($query, $page, $filter);
                }
            }
        } else {
            if ($function == 'pickFields') {
                $response = TableHelper::getFields($table);
            } else if ($function == 'pickTables') {
                $response = TableHelper::getTables();
            } else {
                //Cuando la tabla NO es mujeres 
                $response = TableHelper::getData($table);
            }
        }
    //Método POST para las peticiones donde se modifican datos
    } else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if ($function === 'deleteValues') {
            $response = TableHelper::deleteValues($table, $id);
        } else {
            if ($table === 'mujeres') {
                $data = json_decode(file_get_contents('php://input'), true);
                $response = TableHelper::editWoman($id, $data);
            } else {
                if ($id != 1) {
                    $response = TableHelper::editValues($table, $id, $value);
                } else {
                    $response = TableHelper::newValue($table, $value);
                }
            }
        }
    }
    
    echo json_encode($response);