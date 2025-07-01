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
// Este código se ejecuta cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const contenedor = document.getElementById("carrito-productos");

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p class="text-center">No hay productos en el carrito.</p>';
        return;
    }

    carrito.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto", "border", "p-3", "mb-3", "rounded");
        div.innerHTML = `
                    <h5>${producto.nombre}</h5>
                    <p>Precio: $${producto.precio}</p>
                    <p>Cantidad: ${producto.cantidad}</p>
                `;
        contenedor.appendChild(div);
    });

    const metodosPago = document.querySelectorAll(".metodo-pago");
    metodosPago.forEach(item => {
        item.addEventListener("click", () => {
            metodosPago.forEach(m => m.classList.remove("selected"));
            item.classList.add("selected");
        });
    });
});