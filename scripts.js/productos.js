// Búsqueda de productos y secciones
document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!query) return;

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

    // Buscar en secciones de Producto, Preparación y Beneficios si no encontró en productos
    if (!found) {
        const sections = [
            { id: 'productos', name: 'Producto' },
            { id: 'preparacion', name: 'Preparación' },
            { id: 'beneficios', name: 'Beneficios' }
        ];
        for (const sec of sections) {
            // Busca en el nombre de la sección y en el contenido de la sección
            const sectionElem = document.getElementById(sec.id);
            const sectionText = sectionElem ? sectionElem.textContent.toLowerCase() : '';
            if (
                sec.name.toLowerCase().includes(query) ||
                sec.id.toLowerCase().includes(query) ||
                sectionText.includes(query)
            ) {
                sectionElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                sectionElem.classList.add('border', 'border-success', 'border-3');
                setTimeout(() => sectionElem.classList.remove('border', 'border-success', 'border-3'), 2000);
                found = true;
                break;
            }
        }
    }

    if (!found) {
        alert('No se encontraron resultados para: ' + query);
    }
});

// Código responsivo en Celulares
// Cierra el menú colapsado en móviles al seleccionar una opción
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse && navbarCollapse.classList.contains('show')) {
            bsCollapse.hide();
        }
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