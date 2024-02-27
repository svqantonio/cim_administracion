<?php

    class AuthHelper {

        public static function login($user, $password) {
            global $conn;

            $password = md5($password);
            $stmt = $conn->prepare("SELECT user, password FROM usuarios WHERE user = :user AND password = :password;");
            $stmt->bindParam(':user', $user);
            $stmt->bindParam(':password', $password);
            $stmt->execute();

            $result = $stmt->fetchAll();

            if (count($result) > 0) 
                return [
                    "status" => true,
                    "message" => "Logueado correctamente"

                ]; 
            else 
                return [
                    "status" => false,
                    "message" => "Error al loguearte"
                ];
        }

        public static function register($user, $password) {
            global $conn;

            $password = md5($password);
            $random = random_bytes(32);
            $token = bin2hex($random);

            $stmt = $conn->prepare("INSERT INTO users SET username = :user, password = :password;");
            $stmt->bindParam(':user', $user);
            $stmt->bindParam(':password', $password);
            if ($stmt->execute()) {
                $user_id = $conn->lastInsertId();
                $stmt = $conn->prepare("INSERT INTO tokens SET token = :token, user_id = :user_id;");
                $stmt->bindParam(':token', $token);
                $stmt->bindParam(':user_id', $user_id);

                if ($stmt->execute()) {
                    return [
                        "status" => true,
                        "message" => "Usuario insertado correctamente",
                        "token" => $token,
                    ];
                } else {
                    return [
                        "status" => false,
                        "message" => "Error al insertar token",
                        "token" => null
                    ];
                }
            } else {
                return [
                    "status" => false,
                    "message" => "Error al insertar usuario: " . $stmt->errorInfo()[2],
                    "token" => null
                ];
            } 
        }
    }