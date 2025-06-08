//Conteo del Carrito
// Productos disponibles
const productosData = {
    fresa: { nombre: "Yogurt de Fresa", imagen: "img/fresa.jpg" },
    mora: { nombre: "Yogurt de Mora", imagen: "img/mora.jpg" },
    kummis: { nombre: "Yogurt Kummis", imagen: "img/fresa2.jpg" }
};

// Estado de productos seleccionados
window.productosSeleccionados = [];

// Elementos
const productoSelect = document.getElementById('productoSelect');
const cantidadInput = document.getElementById('cantidadInput');
const agregarProductoBtn = document.getElementById('agregarProducto');
const productosSeleccionadosDiv = document.getElementById('productosSeleccionados');
const productosHiddenDiv = document.getElementById('productosHidden');
const productoImagen = document.getElementById('productoImagen');

// Cambiar imagen al seleccionar producto
productoSelect.addEventListener('change', function () {
    const value = this.value;
    if (productosData[value]) {
        productoImagen.src = productosData[value].imagen;
        productoImagen.style.display = 'block';
    } else {
        productoImagen.style.display = 'none';
    }
});

// Añadir producto a la lista
agregarProductoBtn.addEventListener('click', function () {
    const prodValue = productoSelect.value;
    const cantidad = parseInt(cantidadInput.value, 10);

    if (!prodValue || isNaN(cantidad) || cantidad < 1) return;

    // Agregar producto al array
    productosSeleccionados.push({ producto: prodValue, cantidad: cantidad });

    // Limpiar selección
    productoSelect.selectedIndex = 0;
    cantidadInput.value = 1;
    productoImagen.src = "img/Logo Yogurt Ocad.png";

    renderProductosSeleccionados();
});

// Renderizar productos seleccionados
function renderProductosSeleccionados() {
    productosSeleccionadosDiv.innerHTML = '';
    productosHiddenDiv.innerHTML = '';
    productosSeleccionados.forEach((item, idx) => {
        // Visual
        const badge = document.createElement('span');
        badge.className = "badge bg-primary d-flex align-items-center";
        badge.style.gap = "6px";
        badge.style.fontSize = "1rem";
        badge.innerHTML = `
                        ${productosData[item.producto].nombre} (${item.cantidad}L)
                        <button type="button" class="btn-close btn-close-white btn-sm ms-1 remove-producto" data-idx="${idx}" aria-label="Eliminar"></button>
                    `;
        productosSeleccionadosDiv.appendChild(badge);

        // Campos ocultos para el formulario
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

// Eliminar producto seleccionado
productosSeleccionadosDiv.addEventListener('click', function (e) {
    if (e.target.classList.contains('remove-producto')) {
        const idx = parseInt(e.target.getAttribute('data-idx'), 10);
        productosSeleccionados.splice(idx, 1);
        renderProductosSeleccionados();
    }
});

// Validación antes de enviar
document.getElementById('pedidoForm').addEventListener('submit', function (e) {
    if (productosSeleccionados.length === 0) {
        e.preventDefault();
        alert('Por favor, seleccione al menos un producto para su pedido.');
    }
});
// Renderizar productos seleccionados al cargar la página
renderProductosSeleccionados();
document.addEventListener('DOMContentLoaded', function () {
    let cartCount = 0;
    const badgeElement = document.querySelector('#cart-count .badge');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            cartCount++;
            if (badgeElement) {
                badgeElement.textContent = cartCount;
            }
        });
    });
});

// WhatsApp envío automático al enviar el formulario
document.getElementById('pedidoForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Obtener datos del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const direccion = document.getElementById('direccion').value.trim();

    // Obtener productos seleccionados
    let productos = [];
    if (window.productosSeleccionados && Array.isArray(window.productosSeleccionados) && window.productosSeleccionados.length > 0) {
        productos = window.productosSeleccionados.map(item => {
            // productosData está en el script global
            const nombreProd = window.productosData && window.productosData[item.producto] ? window.productosData[item.producto].nombre : item.producto;
            return `${nombreProd} (${item.cantidad}L)`;
        });
    }

    if (!nombre || !telefono || !direccion || productos.length === 0) {
        e.preventDefault();
        alert('Por favor, complete todos los campos y agregue al menos un producto.');
        return;
    }

    // Construir mensaje
    let mensaje = `¡Hola! Quiero hacer un pedido:\n`;
    mensaje += `*Nombre:* ${nombre}\n`;
    mensaje += `*Teléfono:* ${telefono}\n`;
    mensaje += `*Dirección:* ${direccion}\n`;
    mensaje += `*Productos:*\n`;
    productos.forEach(p => {
        mensaje += `- ${p}\n`;
    });

    // Codificar el mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);

    // Número de WhatsApp (sin espacios ni signos)
    const numero = "573175625131";
    const url = `https://wa.me/${numero}?text=${mensajeCodificado}`;

    // Abrir WhatsApp y prevenir el envío solo si se abre WhatsApp
    window.open(url, '_blank');
    e.preventDefault();

    // Limpiar formulario y productos seleccionados
    this.reset();
    window.productosSeleccionados = [];
    document.getElementById('productoImagen').src = "img/Logo Yogurt Ocad.png";
    if (typeof renderProductosSeleccionados === "function") {
        renderProductosSeleccionados();
    }
});

// Búsqueda de productos y secciones
document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!query) return;

    // Busca en títulos y descripciones de productos y secciones
    let found = false;
    // Buscar en productos
    document.querySelectorAll('.producto-card').forEach(card => {
        const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
        if (title.includes(query) || desc.includes(query)) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.classList.add('border', 'border-success', 'border-3');
            setTimeout(() => card.classList.remove('border', 'border-success', 'border-3'), 2000);
            found = true;
        }
    });

    // Buscar en secciones principales si no encontró en productos
    if (!found) {
        const sections = [
            { id: 'nosotros', name: 'Sobre Nosotros' },
            { id: 'productos', name: 'Productos' },
            { id: 'testimonios', name: 'Testimonios' },
            { id: 'Pedidos', name: 'Pedidos' },
            { id: 'contacto', name: 'Contacto' }
        ];
        for (const sec of sections) {
            if (sec.name.toLowerCase().includes(query) || sec.id.toLowerCase().includes(query)) {
                document.getElementById(sec.id).scrollIntoView({ behavior: 'smooth', block: 'start' });
                found = true;
                break;
            }
        }
    }

    if (!found) {
        alert('No se encontraron resultados para: ' + query);
    }
});