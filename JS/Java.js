let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let carritoTotal = JSON.parse(localStorage.getItem('carritoTotal')) || 0;

// Actualiza el contador del carrito en todas las páginas
document.addEventListener('DOMContentLoaded', actualizarCarritoCount);
document.addEventListener('DOMContentLoaded', actualizarCarritoPagina);

// Función para añadir productos al carrito
function agregarAlCarrito(nombreProducto, precioProducto) {
  // Verificar si el producto ya existe en el carrito
  const existingProduct = carrito.find(producto => producto.nombre === nombreProducto);

  if (existingProduct) {
    existingProduct.cantidad += 1;  // Incrementar cantidad si ya existe
  } else {
    carrito.push({ nombre: nombreProducto, precio: precioProducto, cantidad: 1 });  // Agregar nuevo producto
  }

  carritoTotal += precioProducto;

  // Guardar en localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));
  localStorage.setItem('carritoTotal', JSON.stringify(carritoTotal));

  // Actualizar el contador en el carrito
  actualizarCarritoCount();

  // Mostrar el mensaje de confirmación
  mostrarMensaje(`Has añadido ${nombreProducto} al carrito.`);
}

// Función para mostrar un mensaje cuando se agrega al carrito
function mostrarMensaje(mensaje) {
  const mensajeDiv = document.getElementById("mensaje");
  if (mensajeDiv) {
    mensajeDiv.innerText = mensaje;
    mensajeDiv.style.color = "green";
    setTimeout(() => {
      mensajeDiv.innerText = "";
    }, 3000);
  }
}

// Función para actualizar el contador del carrito
function actualizarCarritoCount() {
  const carritoCount = document.getElementById("carrito-count");
  let totalProductos = 0;
  carrito.forEach(producto => totalProductos += producto.cantidad);  // Contar todos los productos
  if (carritoCount) {
    carritoCount.innerText = `(${totalProductos})`;
  }
}

// Función para actualizar el carrito en la página del carrito
function actualizarCarritoPagina() {
  const listaCarrito = document.getElementById("lista-carrito");
  const totalSpan = document.getElementById("total");

  if (listaCarrito && carrito.length > 0) {
    listaCarrito.innerHTML = "";  // Limpiar la lista antes de volver a cargarla

    carrito.forEach((producto, index) => {
      const productoDiv = document.createElement("div");
      productoDiv.innerHTML = `
        ${producto.nombre} (x${producto.cantidad}) - $${producto.precio * producto.cantidad} 
        <button onclick="disminuirCantidad(${index})">-</button>
        <button onclick="eliminarProducto(${index})">Eliminar</button>
      `;
      listaCarrito.appendChild(productoDiv);
    });

    if (totalSpan) {
      totalSpan.innerText = carritoTotal;
    }
  } else if (listaCarrito) {
    listaCarrito.innerText = "El carrito está vacío.";
    if (totalSpan) {
      totalSpan.innerText = "0";
    }
  }
}

// Función para disminuir la cantidad de un producto
function disminuirCantidad(indice) {
  if (carrito[indice].cantidad > 1) {
    carrito[indice].cantidad -= 1;
    carritoTotal -= carrito[indice].precio;
  } else {
    eliminarProducto(indice);  // Si la cantidad es 1, eliminar el producto
  }

  // Guardar en localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));
  localStorage.setItem('carritoTotal', JSON.stringify(carritoTotal));

  // Actualizar el carrito
  actualizarCarritoCount();
  actualizarCarritoPagina();
}

// Función para eliminar un producto del carrito
function eliminarProducto(indice) {
  carritoTotal -= carrito[indice].precio * carrito[indice].cantidad;
  carrito.splice(indice, 1);

  // Guardar en localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));
  localStorage.setItem('carritoTotal', JSON.stringify(carritoTotal));

  actualizarCarritoCount();
  actualizarCarritoPagina();
}

// Función para vaciar todo el carrito
function vaciarCarrito() {
  carrito = [];
  carritoTotal = 0;

  // Guardar en localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));
  localStorage.setItem('carritoTotal', JSON.stringify(carritoTotal));

  actualizarCarritoCount();
  actualizarCarritoPagina();
}
