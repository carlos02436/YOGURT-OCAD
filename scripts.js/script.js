// Datos de los productos disponibles
const productosData = {
    fresa: { nombre: "Yogurt de Fresa", imagen: "img/fresa.jpg" },
    mora: { nombre: "Yogurt de Mora", imagen: "img/mora.jpg" },
    kummis: { nombre: "Yogurt Kummis", imagen: "img/fresa2.jpg" }
};

// Arreglo para almacenar los productos seleccionados por el usuario
let productosSeleccionados = [];

// Referencias a elementos del DOM
const productoSelect = document.getElementById('productoSelect');
const cantidadInput = document.getElementById('cantidadInput');
const agregarProductoBtn = document.getElementById('agregarProducto');
const productosSeleccionadosDiv = document.getElementById('productosSeleccionados');
const productosHiddenDiv = document.getElementById('productosHidden');
const productoImagen = document.getElementById('productoImagen');

// Evento: Cambia la imagen al seleccionar un producto
productoSelect.addEventListener('change', function () {
    const value = this.value;
    if (productosData[value]) {
        productoImagen.src = productosData[value].imagen;
        productoImagen.style.display = 'block';
    } else {
        productoImagen.style.display = 'none';
    }
});

// Evento: Agrega el producto seleccionado al arreglo y actualiza la vista
agregarProductoBtn.addEventListener('click', function () {
    const prodValue = productoSelect.value;
    const cantidad = parseInt(cantidadInput.value, 10);

    // Validación de selección y cantidad
    if (!prodValue || isNaN(cantidad) || cantidad < 1) return;

    // Agrega el producto al arreglo
    productosSeleccionados.push({ producto: prodValue, cantidad: cantidad });

    // Reinicia los campos de selección
    productoSelect.selectedIndex = 0;
    cantidadInput.value = 1;
    productoImagen.src = "img/Logo Yogurt Ocad.png";

    // Actualiza la lista de productos seleccionados
    renderProductosSeleccionados();
});

// Función: Renderiza los productos seleccionados en la interfaz
function renderProductosSeleccionados() {
    productosSeleccionadosDiv.innerHTML = '';
    productosHiddenDiv.innerHTML = '';

    productosSeleccionados.forEach((item, idx) => {
        // Crea la visualización del producto seleccionado
        const badge = document.createElement('span');
        badge.className = "badge bg-primary d-flex align-items-center";
        badge.style.gap = "6px";
        badge.style.fontSize = "1rem";
        badge.innerHTML = `
            ${productosData[item.producto].nombre} (${item.cantidad}L)
            <button type="button" class="btn-close btn-close-white btn-sm ms-1 remove-producto" data-idx="${idx}" aria-label="Eliminar"></button>
        `;
        productosSeleccionadosDiv.appendChild(badge);

        // Crea inputs ocultos para enviar los datos en el formulario
        const inputProd = document.createElement('input');
        inputProd.type = "hidden";
        inputProd.name = "producto[]";
        inputProd.value = item.producto;
        productosHiddenDiv.appendChild(inputProd);

        const inputCant = document.createElement('input');
        inputCant.type = "hidden";
        inputCant.name = "cantidad[]";
        inputCant.value = item.cantidad;
        productosHiddenDiv.appendChild(inputCant);
    });
}

// Evento: Elimina un producto seleccionado al hacer clic en el botón de eliminar
productosSeleccionadosDiv.addEventListener('click', function (e) {
    if (e.target.classList.contains('remove-producto')) {
        const idx = parseInt(e.target.getAttribute('data-idx'), 10);
        productosSeleccionados.splice(idx, 1);
        renderProductosSeleccionados();
    }
});

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
});

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
});

/**
 * Contador del carrito basado en el HTML proporcionado.
 * El contador se muestra en el <span class="badge bg-primary ms-2">0</span> junto al ícono del carrito.
 */

// Referencia al badge del contador
const cartBadge = document.querySelector('.d-flex.align-items-center .badge.bg-primary');

// Inicializa el contador
let cartCount = 0;

// Función para actualizar el contador visual
function actualizarContador() {
    if (cartBadge) {
        cartBadge.textContent = cartCount;
    }
}

// Función para agregar producto al carrito y actualizar contador
function agregarAlCarrito() {
    cartCount++;
    actualizarContador();
}

// Asignar el evento a los botones que agregan producto (deben tener la clase .add-to-cart-btn)
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', agregarAlCarrito);
});

// Llama actualizarContador() al inicio para mostrar el valor correcto desde el inicio
actualizarContador();

// Evento que controla el menú de navegación para que cierre al hacer clic en un enlace
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const bsCollapse = new bootstrap.Collapse(document.getElementById('navbarSupportedContent'), {
        toggle: false
    });

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            // Cierra el menú si está abierto
            if (document.querySelector('.navbar-toggler').offsetParent !== null) {
                bsCollapse.hide();
            }
        });
    });
});

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
