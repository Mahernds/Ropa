let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let carritoTotal = JSON.parse(localStorage.getItem('carritoTotal')) || 0;

// Actualiza el contador del carrito en todas las páginas
document.addEventListener('DOMContentLoaded', actualizarCarritoCount);
document.addEventListener('DOMContentLoaded', actualizarCarritoPagina);

// Función para añadir productos al carrito
function agregarAlCarrito(nombreProducto, precioProducto) {
  const existingProduct = carrito.find(producto => producto.nombre === nombreProducto);

  if (existingProduct) {
    existingProduct.cantidad = parseInt(existingProduct.cantidad) + 1;
  } else {
    carrito.push({ nombre: nombreProducto, precio: parseFloat(precioProducto) * 1000, cantidad: 1 });
  }

  carritoTotal += parseFloat(precioProducto) * 1000;

  localStorage.setItem('carrito', JSON.stringify(carrito));
  localStorage.setItem('carritoTotal', JSON.stringify(carritoTotal));

  actualizarCarritoCount();
  mostrarMensaje(`Has añadido ${nombreProducto} al carrito.`);
}

// Función para iniciar el pago con Mercado Pago
async function iniciarPago() {
  try {
    // Cambia la ruta de localhost a tu dominio en producción
    const response = await fetch('https://www.nilosportswear.cl/Ropa/generar_preferencia.php');
    const preferenceId = await response.text();

    // Inicia el checkout de Mercado Pago
    const mp = new MercadoPago('TU_PUBLIC_KEY', {
      locale: 'es-AR' // Cambia según tu país
    });

    mp.checkout({
      preference: {
        id: preferenceId // ID de la preferencia generada
      },
      autoOpen: true, // Abre automáticamente el checkout
    });
  } catch (error) {
    console.error('Error al obtener el Preference ID:', error);
    alert('Hubo un error al intentar iniciar el pago. Revisa la consola para más detalles.');
  }
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
  carrito.forEach(producto => totalProductos += parseInt(producto.cantidad));
  if (carritoCount) {
    carritoCount.innerText = `(${totalProductos})`;
  }
}

// Función para actualizar el carrito en la página del carrito
function actualizarCarritoPagina() {
  const listaCarrito = document.getElementById("lista-carrito");
  const totalSpan = document.getElementById("total");

  if (listaCarrito && carrito.length > 0) {
    listaCarrito.innerHTML = "";

    carrito.forEach((producto, index) => {
      const productoDiv = document.createElement("div");
      productoDiv.classList.add("producto-carrito");

      productoDiv.innerHTML = `
        <div class="producto-detalles">
          <h3>${producto.nombre}</h3>
          <p>$${(producto.precio * producto.cantidad).toFixed(3)}</p>
          <select class="cantidad-select" onchange="actualizarCantidad(${index}, this.value)">
            ${generarOpcionesCantidad(producto.cantidad)}
          </select>
          <button class="eliminar-btn" onclick="eliminarProducto(${index})">Eliminar</button>
        </div>
      `;
      listaCarrito.appendChild(productoDiv);
    });

    if (totalSpan) {
      totalSpan.innerText = carritoTotal.toFixed(3);
    }
  } else if (listaCarrito) {
    listaCarrito.innerText = "El carrito está vacío.";
    if (totalSpan) {
      totalSpan.innerText = "0";
    }
  }
}

// Función para generar las opciones de cantidad del menú desplegable
function generarOpcionesCantidad(cantidadActual) {
  let opciones = '';
  for (let i = 1; i <= 10; i++) {
    const seleccionada = i === parseInt(cantidadActual) ? 'selected' : '';
    opciones += `<option value="${i}" ${seleccionada}>${i}</option>`;
  }
  return opciones;
}

// Función para actualizar la cantidad de un producto
function actualizarCantidad(index, nuevaCantidad) {
  const cantidadAnterior = carrito[index].cantidad;
  const nuevaCantidadNumerica = parseInt(nuevaCantidad);
  const diferencia = nuevaCantidadNumerica - cantidadAnterior;

  carrito[index].cantidad = nuevaCantidadNumerica;
  carritoTotal += diferencia * carrito[index].precio;

  // Guardar en localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));
  localStorage.setItem('carritoTotal', JSON.stringify(carritoTotal));

  actualizarCarritoPagina();
}

// Función para eliminar un producto del carrito
function eliminarProducto(index) {
  carritoTotal -= carrito[index].precio * carrito[index].cantidad;
  carrito.splice(index, 1);

  // Guardar en localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));
  localStorage.setItem('carritoTotal', JSON.stringify(carritoTotal));

  actualizarCarritoPagina();
}

// Función para vaciar todo el carrito
function vaciarCarrito() {
  carrito = [];
  carritoTotal = 0;

  // Guardar en localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));
  localStorage.setItem('carritoTotal', JSON.stringify(carritoTotal));

  actualizarCarritoPagina();
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', actualizarCarritoPagina);
