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
});// finaliza el código JS para el botón de scroll

// Evento: Maneja el envío del formulario de pedido
document.getElementById('pedidoForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Validación: Debe haber al menos un producto seleccionado
    if (productosSeleccionados.length === 0) {
        alert('Por favor, seleccione al menos un producto para su pedido.');
        return;
    }

    // Obtiene los datos del cliente
    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const direccion = document.getElementById('direccion').value.trim();

    // Validación: Todos los campos deben estar completos
    if (!nombre || !telefono || !direccion) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    // Construye el mensaje con los productos y datos del cliente
    const productos = productosSeleccionados.map(item => {
        const nombreProd = productosData[item.producto]?.nombre || item.producto;
        return `${nombreProd} (${item.cantidad}L)`;
    }).join('\n- ');

    // Calcula el total a pagar
    const totalLitros = productosSeleccionados.reduce((sum, item) => sum + item.cantidad, 0);
    const precioPorLitro = 10000;
    const totalPagar = totalLitros * precioPorLitro;
    const totalFormateado = totalPagar.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP'
    });

    // Mensaje final para enviar por WhatsApp
    const mensaje = `¡Hola! Quiero hacer un pedido:\n` +
        `*Nombre:* ${nombre}\n` +
        `*Teléfono:* ${telefono}\n` +
        `*Dirección:* ${direccion}\n` +
        `*Productos:*\n- ${productos}\n` +
        `*Total a Pagar:* ${totalFormateado}`;

    // Abre WhatsApp Web con el mensaje prellenado
    const url = `https://web.whatsapp.com/send?phone=573146145727&text=${encodeURIComponent(mensaje)}`;// modifica el número de teléfono según sea necesario
    window.open(url, '_blank');

    // Reinicia el formulario y la selección de productos
    this.reset();
    productosSeleccionados = [];
    productoImagen.src = "img/Logo Yogurt Ocad.png";
    renderProductosSeleccionados();

    // Reinicia el contador del carrito si existe
    const badgeElement = document.querySelector('#cart-count .badge');
    if (badgeElement) {
        badgeElement.textContent = "0";
    }
});// finaliza el evento de envío del formulario de pedido


// Buscador de productos
document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!query) return;

    let found = false;

    // Buscar en los productos
    document.querySelectorAll('.card').forEach(card => {
        const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
        if (title.includes(query) || desc.includes(query)) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.classList.add('border', 'border-success', 'border-3');
            setTimeout(() => card.classList.remove('border', 'border-success', 'border-3'), 2000);
            found = true;
        }
    });

    // Si no se encuentra en productos, buscar en secciones por id o contenido
    if (!found) {
        const sections = [
            { id: 'nosotros', name: 'Sobre Nosotros' },
            { id: 'productos', name: 'Productos' },
            { id: 'testimonios', name: 'Testimonios' },
            { id: 'Pedidos', name: 'Pedidos' },
            { id: 'contacto', name: 'Contacto' }
        ];

        for (const sec of sections) {
            const el = document.getElementById(sec.id);
            if (
                sec.name.toLowerCase().includes(query) ||
                sec.id.toLowerCase().includes(query) ||
                el?.textContent.toLowerCase().includes(query)
            ) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                el.classList.add('border', 'border-info', 'border-3');
                setTimeout(() => el.classList.remove('border', 'border-info', 'border-3'), 2000);
                found = true;
                break;
            }
        }
    }

    if (!found) {
        alert('No se encontraron resultados para: ' + query);
    }
});// finaliza el buscador de productos


// Datos productos del carrito (debes tenerlo también en carrito.html)
// Función para obtener productos del carrito desde localStorage
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || [];
}

// Función para guardar productos en localStorage
function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para actualizar el contador de carrito en cualquier página
function actualizarContadorCarrito() {
    const carrito = obtenerCarrito();
    const contador = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    const contadorElemento = document.getElementById('contador-carrito');
    if (contadorElemento) {
        contadorElemento.textContent = contador;
    }
}

// Función para agregar producto al carrito
function agregarAlCarrito(producto) {
    const carrito = obtenerCarrito();
    const productoExistente = carrito.find(p => p.id === producto.id);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        producto.cantidad = 1;
        carrito.push(producto);
    }

    guardarCarrito(carrito);
    actualizarContadorCarrito();
}

// Función para mostrar productos en carrito.html
function mostrarCarrito() {
    const carrito = obtenerCarrito();
    const contenedor = document.getElementById('cart-container');
    const cantidadElement = document.getElementById('cantidad');
    const precioElement = document.getElementById('precio');
    const carritoVacioElement = document.getElementById('carrito-vacio');
    const totalesContainer = document.getElementById('totales');

    if (!contenedor || !cantidadElement || !precioElement) return;

    contenedor.innerHTML = '';

    if (carrito.length === 0) {
        carritoVacioElement.classList.remove('d-none');
        totalesContainer.classList.add('d-none');
        return;
    }

    carritoVacioElement.classList.add('d-none');
    totalesContainer.classList.remove('d-none');

    let totalCantidad = 0;
    let totalPrecio = 0;

    carrito.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3');
        card.innerHTML = `
            <div class="card-body d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">Precio: $${producto.precio.toLocaleString()}</p>
                    <p class="card-text">Cantidad: ${producto.cantidad}</p>
                </div>
            </div>
        `;
        contenedor.appendChild(card);

        totalCantidad += producto.cantidad;
        totalPrecio += producto.precio * producto.cantidad;
    });

    cantidadElement.textContent = totalCantidad;
    precioElement.textContent = `$${totalPrecio.toLocaleString()}`;
}

// Ejecutar cuando cargue la página
document.addEventListener('DOMContentLoaded', function () {
    actualizarContadorCarrito();
    mostrarCarrito();
});// finaliza el código JavaScript para mostrar el carrito