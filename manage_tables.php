<?php

    require_once 'helpers/errors.php';
    require_once 'helpers/ctes.php';
    require_once 'helpers/data_tables.php';

    //Estos valores en caso de no introducirlos los setea a null
    $table = isset($_GET['table']) ? $_GET['table'] : null;
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    $valor = isset($_GET['valor']) ? $_GET['valor'] : null;
    $function = isset($_GET['function']) ? $_GET['function'] : null;

    //Como este archivo viene de peticiones xhr y siempre les pongo que sean post, hay que comprobar esto de lo contrario no funcionaria
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        if ($table != null) {
            if ($table == 'mujeres') {
                //Tengo que hacer una diferenciacion entre mujeres y las demas tablas porque tienen diferente formato, al menos hasta el dia 17/03/2024 no tengo conocimientos para eso ya que la tabla mujeres esta cifrada con blobs, si no estuviese cifrada no habria ningun problema pero ya ese formato esta mas que fijado.
                if ($valor == null) {
                    //Si valor es null es porque no haces operaciones de editar
                    if ($id != null) {
                        if ($function == 'women_id') {
                            //El usuario esta pidiendo los datos especificos de una mujer
                            $response = Data_tables::getWomanDates_ID($id);
                        } else if ($function == 'women_delete') {
                            //El usuario esta pidiendo borrar una mujer
                            $response = Data_tables::deleteValues($table, $id);
                        }
                    } else {
                        //Estamos ante el caso de que el usuario pida los 3/4 datos de las mujeres para la tabla general
                        $response = Data_tables::getWomenTableDates();
                    }
                } else {
                    $data = json_decode(file_get_contents('php://input'), true);
                    //Como existe la tabla que es mujeres y también existe valor, significa que tenemos el caso de que el usuario quiere editar mujeres
                    $response = Data_tables::editWoman($id, $data);
                }
            } else {
                //Esto en caso de que sean las otras tablas auxiliares que todas tienen el mismo formato
                if ($id != null && $valor != null) {
                    //Si existe id y valor es porque estas editando valores
                    $response = Data_tables::editValues($table, $id, $valor);
                } else if ($id != null && $valor == null) {
                    //Si existe id pero no valor es porque estas borrando
                    $response = Data_tables::deleteValues($table, $id);
                } else {
                    //Si no existe id ni valor es porque quieres todos los datos de la tabla
                    $response = Data_tables::getTableDates($table);
                }
            }
        } else {
            //Si no metes tabla te devuelve error
            $response = array('status' => 'error', 'message' => 'No has pasado ninguna tabla!', 'timer' => $timer);
        }
    }
    echo json_encode($response);