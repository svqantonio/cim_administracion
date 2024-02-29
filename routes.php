<?php
// router.php
require_once "./helpers/ctes.php";
require_once "./helpers/AuthHelper.php";
require_once "./helpers/cleanTokens.php";

$page = isset($_GET['pag']) ? $_GET['pag'] : '';
$token = isset($_GET['token']) ? $_GET['token'] : null;

// Definir las rutas y los controladores correspondientes
$routes = [
    'main.html' => 'main.html',
];

$res = AuthHelper::logued($token);
if ($res) {
    // Verificar si la ruta solicitada existe en el array de rutas
    if (array_key_exists($page, $routes)) {
        // Devolver la URL de redirección
        echo json_encode(array('redirect' => $page));
    } else {
        // Redirigir a una página de error o manejar la solicitud de otra manera
        echo json_encode(array('error' => 'Página no encontrada'));
    }
} else {
    return false;
}