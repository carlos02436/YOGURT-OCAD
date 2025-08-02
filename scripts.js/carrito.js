// Código JS para el Botón Scroll hacia abajo y devuelve al inicio
// Mostrar/ocultar el botón al hacer scroll
window.addEventListener('scroll', function () {
    const btn = document.getElementById('scrollToTopBtn');
    if (window.scrollY > 200) {
        btn.style.display = 'flex';
    } else {
        btn.style.display = 'none';
    }
});

// Scroll suave al inicio al hacer clic
document.getElementById('scrollToTopBtn').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


// Código JS para el carrito de compras
// Este script maneja la funcionalidad del carrito de compras en las páginas index.html y carrito.html
// Definición de elementos del DOM
const contenedorTarjetas = document.getElementById("cart-container");
const cantidadElement = document.getElementById("cantidad");
const precioElement = document.getElementById("precio");
const carritoVacioElement = document.getElementById("carrito-vacio");
const totalesContainer = document.getElementById("totales");
const botonReiniciar = document.getElementById("reiniciar");

// Crear tarjetas de productos desde el carrito guardado en localStorage
function crearTarjetasProductosCarrito() {
  contenedorTarjetas.innerHTML = "";

  const productos = JSON.parse(localStorage.getItem("carrito")) || [];

  if (productos.length > 0) {
    productos.forEach((producto, index) => {
      const tarjeta = document.createElement("div");
      tarjeta.className = "producto border p-3 mb-3 rounded bg-light d-flex align-items-center justify-content-between flex-wrap";
      tarjeta.innerHTML = `
        <div class="d-flex align-items-center">
          <img src="${producto.imagen || 'img/default.png'}" alt="${producto.nombre}" class="me-3" style="width: 80px; height: 80px; object-fit: cover;">
          <div>
            <h5 class="mb-1">${producto.nombre}</h5>
            <p class="mb-1">Precio unitario: $${producto.precio.toLocaleString("es-CO")}</p>
            <div class="d-flex align-items-center">
              <button class="btn btn-outline-secondary btn-sm me-2 btn-disminuir" data-index="${index}">-</button>
              <span class="cantidad mx-2">${producto.cantidad}</span>
              <button class="btn btn-outline-secondary btn-sm ms-2 btn-aumentar" data-index="${index}">+</button>
            </div>
            <p class="mt-2"><strong>Total: $${(producto.precio * producto.cantidad).toLocaleString("es-CO")}</strong></p>
          </div>
        </div>
        <button class="btn btn-danger btn-sm eliminar-producto mt-2" data-index="${index}">Eliminar</button>
      `;
      contenedorTarjetas.appendChild(tarjeta);
    });

    // Asignar eventos de cantidad y eliminar
    document.querySelectorAll(".btn-aumentar").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.dataset.index);
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carrito[index].cantidad += 1;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        crearTarjetasProductosCarrito();
      });
    });

    document.querySelectorAll(".btn-disminuir").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.dataset.index);
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carrito[index].cantidad = Math.max(1, carrito[index].cantidad - 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        crearTarjetasProductosCarrito();
      });
    });

    document.querySelectorAll(".eliminar-producto").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.dataset.index);
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carrito.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        crearTarjetasProductosCarrito();
      });
    });

  } else {
    contenedorTarjetas.innerHTML = '<p class="text-center">No hay productos en el carrito.</p>';
  }

  actualizarTotales();
  revisarMensajeVacio();
}

// Actualiza cantidad total de productos y precio total
function actualizarTotales() {
  const productos = JSON.parse(localStorage.getItem("carrito")) || [];
  let cantidad = 0;
  let precio = 0;

  productos.forEach(producto => {
    cantidad += producto.cantidad;
    precio += producto.precio * producto.cantidad;
  });

  cantidadElement.innerText = cantidad;
  precioElement.innerText = `$${precio.toLocaleString("es-CO")}`;
}

// Reinicia el carrito
function reiniciarCarrito() {
  localStorage.removeItem("carrito");
  crearTarjetasProductosCarrito();
}

// Muestra/oculta elementos según si el carrito está vacío
function revisarMensajeVacio() {
  const productos = JSON.parse(localStorage.getItem("carrito")) || [];
  const vacio = productos.length === 0;

  carritoVacioElement.classList.toggle("d-none", !vacio);
  totalesContainer.classList.toggle("d-none", vacio);
}

// Evento del botón para reiniciar carrito
if (botonReiniciar) {
  botonReiniciar.addEventListener("click", () => {
    reiniciarCarrito();
  });
}

// Llamada inicial
crearTarjetasProductosCarrito();