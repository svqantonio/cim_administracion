<?php

    class Data_tables {

        public static function getTableDates($table) {
            global $conn;

            $stmt = $conn->prepare("SELECT id, CAST(AES_DECRYPT(valor, 'xyz123') AS CHAR) AS valor FROM $table ORDER BY id;");
            $stmt->execute();
            $result = $stmt -> fetchAll(PDO::FETCH_ASSOC);
            
            return $result;
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