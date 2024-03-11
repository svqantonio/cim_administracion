<?php
    require_once 'helpers/ctes.php';

    class cleanTokens {
        public function deleteOldTokens() {
            global $conn;
    
            try {
                $stmt = $conn->prepare("DELETE FROM tokens WHERE token_expiration < NOW();");
                $stmt->execute();
            } catch (PDOException $e) {
                echo "Error al eliminar tokens: " . $e->getMessage();
            } catch (Exception $e) {
                echo "Error: " . $e->getMessage();
            }
        }
    }