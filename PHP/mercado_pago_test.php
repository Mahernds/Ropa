<?php
// Incluye el autoload de Composer para cargar las dependencias de Mercado Pago
require __DIR__ . '/vendor/autoload.php';

// Agrega tus credenciales de acceso
MercadoPago\SDK::setAccessToken('APP_USR-7416099523556452-101016-ec9b5add2187cfe77f57ffe4d4bc1cba-752240939');

// Crea una preferencia simple
$preference = new MercadoPago\Preference();

// Crea un ítem de prueba
$item = new MercadoPago\Item();
$item->title = 'Test Product';
$item->quantity = 1;
$item->unit_price = 100.00; // Precio del producto

$preference->items = array($item);

// Guarda la preferencia
$preference->save();

// Muestra el ID de la preferencia generada
echo "Preference ID: " . $preference->id;
?>
