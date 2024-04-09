<?php

    class Data_log {

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