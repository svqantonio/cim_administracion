<?php

    class AuthHelper {

        public static function login($user, $password) {
            global $conn; global $timer;
            $random = random_bytes(32);
            $token = bin2hex($random);
            $password = md5($password);
            $stmt = $conn->prepare("SELECT id, username, password FROM users WHERE username = :user AND password = :password;");
            $stmt->bindParam(':user', $user);
            $stmt->bindParam(':password', $password);
            $stmt->execute();
            $result = $stmt->fetch();

            if ($result) {
                $user_id = $result['id'];
                $expiration_time = date('Y-m-d H:i:s', strtotime('+1 hour'));
                $stmt = $conn->prepare("INSERT INTO tokens SET token = :token, user_id = :user_id, token_expiration = :token_expiration;");
                $stmt->bindParam(':token', $token);
                $stmt->bindParam(':user_id', $user_id);
                $stmt->bindParam(':token_expiration', $expiration_time);

                if ($stmt->execute()) {
                    return [
                        "status" => "success",
                        "message" => "Usuario logueado correctamente",
                        "token" => $token,
                        "redirection" => "main.html",
                        "timer" => $timer,
                    ];
                } else {
                    return [
                        "status" => "error",
                        "message" => "Ha habido un error al insertar un token!",
                        "token" => null,
                        "redirection" => "login.html",
                        "timer" => $timer
                    ];
                }
            } else {
                return [
                    "status" => "error",
                    "message" => "No existe ese usuario!",
                    "token" => null,
                    "redirection" => null,
                    "timer" => null
                ];
            }
        }

        public static function register($user, $password) {
            global $conn; global $timer;

            $password = md5($password);
            $random = random_bytes(32);
            $token = bin2hex($random);

            $stmt = $conn->prepare("INSERT INTO users SET username = :user, password = :password;");
            $stmt->bindParam(':user', $user);
            $stmt->bindParam(':password', $password);
            if ($stmt->execute()) {
                $user_id = $conn->lastInsertId();
                $expiration_time = date('Y-m-d H:i:s', strtotime('+1 hour')); // Sumar una hora al tiempo actual
                $stmt = $conn->prepare("INSERT INTO tokens SET token = :token, user_id = :user_id, token_expiration = :token_expiration");
                $stmt->bindParam(':token', $token);
                $stmt->bindParam(':user_id', $user_id);
                $stmt->bindParam(':token_expiration', $expiration_time);

                if ($stmt->execute()) {
                    return [
                        "status" => "success",
                        "message" => "Usuario insertado correctamente",
                        "token" => $token,
                        "redirection" => "index.html",
                        "timer" => $timer
                    ];
                } else {
                    return [
                        "status" => "error",
                        "message" => "Error al insertar token",
                        "token" => null,
                        "redirection" => "login.html",
                        "timer" => $timer
                    ];
                }
            } else {
                return [
                    "status" => false,
                    "message" => "Error al insertar usuario: " . $stmt->errorInfo()[2],
                    "token" => null,
                    "redirection" => null,
                    "timer" => $timer
                ];
            } 
        }

        /*public static function logued($token) {
            global $conn;

            $stmt = $conn->prepare("SELECT token, token_expiration FROM tokens WHERE token = :token;");
            $stmt->bindParam(':token', $token);
            $stmt->execute();
            $result = $stmt->fetchAll(); 

            if (count($result) > 0)
                return true;
            else 
                return false;
        }

        public static function checkTokenExpiration($token) {
            global $conn;

            $stmt = $conn->prepare("SELECT token_expiration FROM tokens WHERE token = :token;");
            $stmt->bindParam(':token', $token);
            $stmt->execute();
            $result = $stmt->fetch();

            if (!$result)
                return true;
            
            return false;
        }*/

        public static function logout($token) {
            global $conn; global $timer;

            $stmt = $conn->prepare("DELETE FROM tokens WHERE token = :token;");
            $stmt->bindParam(':token', $token);
            if ($stmt->execute()) 
                return [
                    "status" => "success",
                    "message" => "Has cerrado sesión correctamente!",
                    "redirection" => "index.html",
                    "timer" => $timer
                ];
            else    
                return [
                    "status" => "error",
                    "message" => "Error al insertar usuario: " . $stmt->errorInfo()[2],
                    "redirection" => "main.html",
                    "timer" => $timer
                ]; 
        }

        public static function login_verification($token) {
            global $conn; global $timer;

            $stmt = $conn->prepare("SELECT token, token_expiration FROM tokens WHERE token = :token");
            $stmt->bindParam(':token', $token);
            $stmt->execute();

            if ($stmt->rowCount() > 0)  {
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                $token_expiration = $result['token_expiration'];
                $current_date = date('Y-m-d H:i:s');

                if ($current_date < $token_expiration) 
                    return [
                        "status" => "success"
                    ];
                else 
                    return [
                        "status" => "error",
                        "message" => "El token ha expirado",
                        "timer" => $timer
                    ];
                
            } else 
                return [
                    "status" => "error",
                    "message" => "No existe ese token en la base de datos",
                    "timer" => $timer
                ];
        }
    }