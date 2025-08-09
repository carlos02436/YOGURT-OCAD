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
document.addEventListener('DOMContentLoaded', function () {
    let productosSeleccionados = [];

    const productosData = {
        'fresa': { nombre: 'Yogurt de Fresa' },
        'mora': { nombre: 'Yogurt de Mora' },
        'kummis': { nombre: 'Yogurt Kummis' }
    };

    // Agregar producto al carrito
    document.getElementById('agregarProducto').addEventListener('click', function () {
        const productoID = document.getElementById('productoSelect').value;
        const cantidad = parseFloat(document.getElementById('cantidadInput').value);

        if (!productoID || isNaN(cantidad) || cantidad <= 0) {
            alert('Seleccione un producto y cantidad válida');
            return;
        }

        const existente = productosSeleccionados.find(p => p.producto === productoID);
        if (existente) {
            existente.cantidad += cantidad;
        } else {
            productosSeleccionados.push({ producto: productoID, cantidad });
        }

        renderProductosSeleccionados();
    });

    // Mostrar productos seleccionados
    function renderProductosSeleccionados() {
        const contenedor = document.getElementById('productosSeleccionados');
        contenedor.innerHTML = '';

        if (productosSeleccionados.length === 0) {
            contenedor.innerHTML = '<span class="text-muted">Sin productos aún</span>';
            return;
        }

        productosSeleccionados.forEach((item, index) => {
            const nombreProd = productosData[item.producto]?.nombre || item.producto;

            const badge = document.createElement('span');
            badge.className = 'badge bg-secondary d-flex align-items-center gap-2 me-1 mb-1 p-2';
            badge.style.cursor = 'default';

            badge.innerHTML = `
                ${nombreProd}: ${item.cantidad}L 
                <button class="btn-close btn-close-white btn-sm ms-2" data-index="${index}" title="Quitar producto"></button>
            `;

            contenedor.appendChild(badge);
        });

        // Evento para eliminar producto
        contenedor.querySelectorAll('.btn-close').forEach(btn => {
            btn.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                if (!isNaN(index)) {
                    productosSeleccionados.splice(index, 1);
                    renderProductosSeleccionados();
                }
            });
        });
    }

    // Enviar formulario por WhatsApp
    document.getElementById('pedidoForm').addEventListener('submit', function (e) {
        e.preventDefault();

        if (productosSeleccionados.length === 0) {
            alert('Agrega al menos un producto antes de enviar el pedido.');
            return;
        }

        const nombre = document.getElementById('nombre').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const direccion = document.getElementById('direccion').value.trim();

        if (!nombre || !telefono || !direccion) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        const productos = productosSeleccionados.map(item => {
            const nombreProd = productosData[item.producto]?.nombre || item.producto;
            return `${nombreProd} (${item.cantidad}L)`;
        }).join('\n- ');

        const totalLitros = productosSeleccionados.reduce((sum, item) => sum + item.cantidad, 0);
        const precioPorLitro = 10000;
        const totalPagar = totalLitros * precioPorLitro;
        const totalFormateado = totalPagar.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP'
        });

        const mensaje = `¡Hola! Quiero hacer un pedido:\n` +
            `*Nombre:* ${nombre}\n` +
            `*Teléfono:* ${telefono}\n` +
            `*Dirección:* ${direccion}\n` +
            `*Productos:*\n- ${productos}\n` +
            `*Total a Pagar:* ${totalFormateado}`;

        const numeroWhatsApp = "573146145727";
        const esMovil = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const url = esMovil
            ? `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`
            : `https://web.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensaje)}`;

        window.open(url, '_blank');

        this.reset();
        productosSeleccionados = [];
        renderProductosSeleccionados();
        document.getElementById('productoImagen').src = "img/Logo Yogurt Ocad.png";
    });
});// finaliza el evento del formulario de pedido


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


// Cierra el menú hamburguesa al dar clic en un link del navbar (excepto "Más")
document.querySelectorAll('.navbar-collapse .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        // Si NO es el botón "Más", cierra el menú hamburguesa
        if (!link.classList.contains('dropdown-toggle')) {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        }
    });
});