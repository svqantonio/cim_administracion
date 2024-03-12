<?php

    class Data_tables {

        public static function getTableDates($table) {
            global $conn;

            $stmt = $conn->prepare("SELECT id, CAST(AES_DECRYPT(valor, 'xyz123') AS CHAR) AS valor FROM $table ORDER BY id;");
            $stmt->execute();
            $result = $stmt -> fetchAll(PDO::FETCH_ASSOC);
            
            return $result;
        }

        /*public static function getTableDate_ID($table, $id) {
            global $conn;

            $stmt = $conn->prepare("SELECT id, CAST(AES_DECRYPT(valor, 'xyz123') AS CHAR) AS valor FROM $table WHERE id = :id ORDER BY id;");
            $stmt->bindPrepare(':id', $id);
            $stmt->execute();
            $result = $stmt->fetch();

            return $result;
        }*/
    }