<?php
// Permitir solicitudes desde localhost durante el desarrollo
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require __DIR__ . '/vendor/autoload.php';
echo "Llego hasta aquí"; // Para verificar si el archivo se ejecuta

// Si es una solicitud OPTIONS (pre-flight), finaliza aquí.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Agrega tus credenciales de acceso de Mercado Pago
MercadoPago\SDK::setAccessToken('APP_USR-7416099523556452-101016-ec9b5add2187cfe77f57ffe4d4bc1cba-752240939');

// Crea una preferencia de pago
$preference = new MercadoPago\Preference();

// Configura un ítem de prueba
$item = new MercadoPago\Item();
$item->title = 'Test Product';
$item->quantity = 1;
$item->unit_price = 100.00;
$preference->items = array($item);

// Guarda la preferencia
$preference->save();

// Devuelve el ID de la preferencia
echo $preference->id;
?>
