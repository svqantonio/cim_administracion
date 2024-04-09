<?php

    class Data_tables {

        public static function getTableDates($table) {
            global $conn;

            $stmt = $conn->prepare("SELECT id, CAST(AES_DECRYPT(valor, 'xyz123') AS CHAR) AS valor FROM $table ORDER BY id;");
            $stmt->execute();
            $result = $stmt -> fetchAll(PDO::FETCH_ASSOC);
            
            return $result;
        }

        public static function getWomenTableDates() {
            global $conn; 

            $stmt = $conn->prepare("SELECT id, nombre, apellidos, CAST(AES_DECRYPT(dni,'xyz123') AS CHAR) AS dni, CAST(AES_DECRYPT(fecha_nac,'xyz123') AS CHAR) AS fecha_nac, CAST(AES_DECRYPT(direccion,'xyz123') AS CHAR) AS direccion FROM mujeres ORDER BY nombre;");
            $stmt->execute();
            $result = $stmt -> fetchAll(PDO::FETCH_ASSOC); 
            return $result;
        }

        //Funcion del archivo prueba.php y prueba.js
        public static function getWomenTableDates_prueba($query, $page, $filter) {
            global $conn;
            $offset = $page * 50;
            
            if (($query === null || $query === 'null') && ($filter === null || $filter === 'null')) { //Vamos a hacer la instancia normal de cuando carga la página
                $stmt = $conn->prepare("SELECT id, nombre, apellidos, CAST(AES_DECRYPT(dni,'xyz123') AS CHAR) AS dni, CAST(AES_DECRYPT(fecha_nac,'xyz123') AS CHAR) AS fecha_nac, CAST(AES_DECRYPT(direccion,'xyz123') AS CHAR) AS direccion FROM mujeres ORDER BY nombre LIMIT 50 offset $offset");
            } else if ($query !== null && $filter === null) { //El usuario busca y se le devuelven los resultados, se crea la paginacion y esta dentro de la pagina 0. Cabe recalcar que esta instancia tambien sirve para usar la paginacion dentro de la busqueda
                $stmt = $conn->prepare("SELECT id, nombre, apellidos, CAST(AES_DECRYPT(dni,'xyz123') AS CHAR) AS dni, CAST(AES_DECRYPT(fecha_nac,'xyz123') AS CHAR) AS fecha_nac, CAST(AES_DECRYPT(direccion,'xyz123') AS CHAR) AS direccion FROM mujeres $query ORDER BY nombre LIMIT 50 offset $offset");
            } else if ($query !== null && $filter !== null) { //Este es el caso de que use un filtro dentro de la paginacion
                $stmt = $conn->prepare("SELECT id, nombre, apellidos, CAST(AES_DECRYPT(dni,'xyz123') AS CHAR) AS dni, CAST(AES_DECRYPT(fecha_nac,'xyz123') AS CHAR) AS fecha_nac, CAST(AES_DECRYPT(direccion,'xyz123') AS CHAR) AS direccion FROM mujeres $query ORDER BY $filter LIMIT 50 offset $offset");
            }
            //echo "Consulta SQL: " . $stmt->queryString . "<br>";
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }

        public static function countGetWomenTableDates($query) {
            global $conn;

            if ($query === null) {
                $stmt = $conn->prepare("SELECT COUNT(nombre) AS count FROM mujeres");
            } else {
                $stmt = $conn->prepare("SELECT COUNT(:query) AS count FROM mujeres");
                $stmt->bindParam(":query", $query);
            }

            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result;
        }

        public static function getWomanDates_ID($id) {
            global $conn;

            $stmt = $conn->prepare("SELECT 
            m.id AS id, 
            m.nombre AS nombre, 
            m.apellidos AS apellidos, 
            CAST(AES_DECRYPT(fecha_nac, 'xyz123') AS CHAR) AS fecha_nac, 
            CAST(AES_DECRYPT(m.porcentaje_discap, 'xyz123') AS CHAR) AS porcentaje_discap, 
            CAST(AES_DECRYPT(m.dni, 'xyz123') AS CHAR) AS dni, 
            CAST(AES_DECRYPT(m.direccion, 'xyz123') AS CHAR) AS direccion,
            v.id AS vivienda_id,
            CAST(AES_DECRYPT(v.valor, 'xyz123') AS CHAR) AS vivienda, 
            CAST(AES_DECRYPT(m.detalle_vivienda,'xyz123') AS CHAR) AS detalle_vivienda,
            d.id AS discapacidad_id,
            CAST(AES_DECRYPT(d.valor, 'xyz123') AS CHAR) AS discapacidad, 
            t1.id AS trabajo_comp_select_id,
            CAST(AES_DECRYPT(t1.valor, 'xyz123') AS CHAR) AS trabajo_comp_select, 
            t2.id AS trabajo_id,
            CAST(AES_DECRYPT (t2.valor, 'xyz123') AS CHAR) AS trabajo, 
            ec.id AS estado_civil_id,
            CAST(AES_DECRYPT(ec.valor, 'xyz123') AS CHAR) AS estado_civil, 
            ne.id AS nivel_estudios_id,
            CAST(AES_DECRYPT(ne.valor, 'xyz123') AS CHAR) AS nivel_estudios, 
            fi.id AS fuente_ingresos_id,
            CAST(AES_DECRYPT(fi.valor, 'xyz123') AS CHAR) AS fuente_ingresos, 
            CAST(AES_DECRYPT(m.movil, 'xyz123') AS CHAR) AS movil, 
            CAST(AES_DECRYPT(m.telefono, 'xyz123') AS CHAR) AS telefono, 
            CAST(AES_DECRYPT(m.expediente, 'xyz123') AS CHAR) AS expediente, 
            CAST(AES_DECRYPT(m.companyero, 'xyz123') AS CHAR) AS companyero, 
            CAST(AES_DECRYPT(m.trabajo_comp_desc, 'xyz123') AS CHAR) AS trabajo_comp_desc, 
            CAST(AES_DECRYPT(m.num_hijos, 'xyz123') AS CHAR) AS num_hijos, 
            CAST(AES_DECRYPT(m.edades, 'xyz123') AS CHAR) AS edades, 
            CAST(AES_DECRYPT(m.descripcion_estudios, 'xyz123') AS CHAR) AS descripcion_estudios, 
            CAST(AES_DECRYPT(m.desc_trabajo, 'xyz123') AS CHAR) AS desc_trabajo, 
            CAST(AES_DECRYPT(m.ingresos, 'xyz123') AS CHAR) AS ingresos, 
            CAST(AES_DECRYPT(m.telefono_trabajo, 'xyz123') AS CHAR) AS telefono_trabajo, 
            CAST(AES_DECRYPT(m.orden_alejamiento, 'xyz123') AS CHAR) AS orden_alejamiento, 
            CAST(AES_DECRYPT(m.demanda_empleo, 'xyz123') AS CHAR) AS demanda_empleo, 
            CAST(AES_DECRYPT(m.demanda_formacion, 'xyz123') AS CHAR) AS demanda_formacion, 
            CAST(AES_DECRYPT(m.historial, 'xyz123') AS CHAR) AS historial, 
            CAST(AES_DECRYPT(m.fecha_entrada, 'xyz123') AS CHAR) AS fecha_entrada 
            FROM mujeres m 
            LEFT JOIN vivienda v ON m.vivienda = v.id 
            LEFT JOIN discapacidad d ON m.discapacidad = d.id 
            LEFT JOIN trabajo t1 ON m.trabajo_comp_select = t1.id 
            LEFT JOIN estado_civil ec ON m.estado_civil = ec.id 
            LEFT JOIN nivel_estudios ne ON m.nivel_estudios = ne.id 
            LEFT JOIN fuente_ingresos fi ON m.fuente_ingresos = fi.id 
            LEFT JOIN trabajo t2 ON m.trabajo = t2.id 
            CROSS JOIN (
                SELECT 
                    CAST(AES_DECRYPT(m.fecha_nac, 'xyz123') AS DATE) AS fecha_nac_parsed 
                    FROM mujeres m 
                    WHERE m.id = :id_join) 
                AS parsed_dates 
                WHERE m.id = :id");
            $stmt->bindParam(':id_join', $id);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $result = $stmt -> fetch(PDO::FETCH_ASSOC); 
            
            $response = array();
            foreach($result as $key => $value) {
                //Codigo para meter los datos en un array que voy a devolver al front y con los que voy a formatear los inputs
                $response[$key] = $value;
            }

            return $response;
        }

        public static function editWoman($id, $data) {
            global $conn; global $timer;
        
            try {
                // Decodificar el JSON 
                if (!is_array($data)) 
                    $valores = json_decode($data, true); 
                else 
                    $valores = $data;
        
                $stmt = $conn->prepare("UPDATE mujeres SET nombre = :nombre, apellidos = :apellidos, fecha_nac = AES_ENCRYPT(:fecha_nac, 'xyz123'), dni = AES_ENCRYPT(:dni, 'xyz123'), direccion = AES_ENCRYPT(:direccion, 'xyz123'), vivienda = :vivienda, detalle_vivienda = AES_ENCRYPT(:detalle_vivienda, 'xyz123'), movil = AES_ENCRYPT(:movil, 'xyz123'), telefono = AES_ENCRYPT(:telefono, 'xyz123'), telefono_trabajo = AES_ENCRYPT(:telefono_trabajo, 'xyz123'), expediente = AES_ENCRYPT(:expediente, 'xyz123'), companyero = AES_ENCRYPT(:companyero, 'xyz123'), trabajo_comp_select = :trabajo_comp_select, trabajo_comp_desc = AES_ENCRYPT(:trabajo_comp_desc, 'xyz123'), estado_civil = :estado_civil, num_hijos = AES_ENCRYPT(:num_hijos, 'xyz123'), edades = AES_ENCRYPT(:edades, 'xyz123'), trabajo = :trabajo, nivel_estudios = :nivel_estudios, descripcion_estudios = AES_ENCRYPT(:descripcion_estudios, 'xyz123'), desc_trabajo = AES_ENCRYPT(:desc_trabajo, 'xyz123'), fuente_ingresos = :fuente_ingresos, ingresos = AES_ENCRYPT(:ingresos, 'xyz123'), discapacidad = :discapacidad, porcentaje_discap = AES_ENCRYPT(:porcentaje_discap, 'xyz123'), demanda_empleo = AES_ENCRYPT(:demanda_empleo, 'xyz123'), demanda_formacion = AES_ENCRYPT(:demanda_formacion, 'xyz123'), orden_alejamiento = AES_ENCRYPT(:orden_alejamiento, 'xyz123'), historial = AES_ENCRYPT(:historial, 'xyz123') WHERE id = :id;");
                $stmt->bindValue(':nombre', $valores['nombre']);
                $stmt->bindValue(':apellidos', $valores['apellidos']);
                $stmt->bindValue(':fecha_nac', $valores['fecha_nac']);
                $stmt->bindValue(':dni', $valores['dni']);
                $stmt->bindValue(':direccion', $valores['direccion']);
                $stmt->bindValue(':vivienda', $valores['vivienda']);
                $stmt->bindValue(':detalle_vivienda', $valores['detalle_vivienda']);
                $stmt->bindValue(':movil', $valores['movil']);
                $stmt->bindValue(':telefono', $valores['telefono']);
                $stmt->bindValue(':telefono_trabajo', $valores['telefono_trabajo']);
                $stmt->bindValue(':expediente', $valores['expediente']);
                $stmt->bindValue(':companyero', $valores['companyero']);
                $stmt->bindValue(':trabajo_comp_select', $valores['trabajo_comp_select']);
                $stmt->bindValue(':trabajo_comp_desc', $valores['trabajo_comp_desc']);
                $stmt->bindValue(':estado_civil', $valores['estado_civil']);
                $stmt->bindValue(':num_hijos', $valores['num_hijos']);
                $stmt->bindValue(':edades', $valores['edades']);
                $stmt->bindValue(':trabajo', $valores['trabajo_mujer']);
                $stmt->bindValue(':nivel_estudios', $valores['nivel_estudios']);
                $stmt->bindValue(':descripcion_estudios', $valores['descripcion_estudios']);
                $stmt->bindValue(':desc_trabajo', $valores['desc_trabajo']);
                $stmt->bindValue(':fuente_ingresos', $valores['fuente_ingresos']);
                $stmt->bindValue(':ingresos', $valores['ingresos']);
                $stmt->bindValue(':discapacidad', $valores['discapacidad']);
                $stmt->bindValue(':porcentaje_discap', $valores['porcentaje_discap']);
                $stmt->bindValue(':demanda_empleo', $valores['demanda_empleo']);
                $stmt->bindValue(':demanda_formacion', $valores['demanda_formacion']);
                $stmt->bindValue(':orden_alejamiento', $valores['orden_alejamiento']);
                $stmt->bindValue(':historial', $valores['historial']);
                $stmt->bindValue(':id', $valores['id']);
        
                // Ejecuta la consulta
                if ($stmt->execute()) 
                    return [
                        "status" => "success",
                        "message" => "Valor editado correctamente!",
                        "timer" => $timer
                    ];
                            
            } catch (Exception $e) {
                return [
                    "status" => "error",
                    "message" => $e->getMessage(),
                    "timer" => $timer
                ];
            }
        }

        public static function editValues($table, $id, $valor) {
            global $conn; global $timer;

            $stmt = $conn->prepare("UPDATE $table SET valor = AES_ENCRYPT(:valor, 'xyz123') WHERE id = :id;");
            $stmt->bindParam(':valor', $valor);
            $stmt->bindParam(':id', $id);
            if ($stmt->execute())
                return [
                    "status" => "success",
                    "message" => "Valor editado correctamente!",
                    "timer" => $timer
                ];
            else 
                return [
                    "status" => "error",
                    "message" => "Fallo al editar valor!",
                    "timer" => $timer 
                ];
        }

        public static function deleteValues($table, $id) {
            global $conn; global $timer;

            $stmt = $conn->prepare("DELETE FROM $table WHERE id = :id;");
            $stmt->bindParam(':id', $id);
            if ($stmt->execute()) 
                return [
                    "status" => "success",
                    "message" => "Valor borrado correctamente!",
                    "timer" => $timer
                ];
            else 
                return [
                    "status" => "error",
                    "message" => "Error al borrar valor!",
                    "timer" => $timer
                ];
        }
    }