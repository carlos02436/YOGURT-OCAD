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
document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;

    // === INDEX.HTML ===
    if (path.includes("index.html") || path === "/" || path === "") {
        const botones = document.querySelectorAll(".comprar-btn, .add-to-cart-btn");

        botones.forEach(boton => {
            boton.addEventListener("click", () => {
                const tarjeta = boton.closest(".producto-card");
                const nombre = tarjeta.querySelector(".producto-nombre").textContent.trim();
                const precioTexto = tarjeta.querySelector(".producto-precio").textContent.trim();
                const precio = parseFloat(precioTexto.replace(/\$|\./g, "").replace(",", "."));

                // Por defecto se añade 1 unidad
                const cantidad = 1;

                let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
                const existente = carrito.find(p => p.nombre === nombre);

                if (existente) {
                    existente.cantidad += cantidad;
                } else {
                    carrito.push({ nombre, precio, cantidad });
                }

                localStorage.setItem("carrito", JSON.stringify(carrito));

                if (boton.classList.contains("comprar-btn")) {
                    window.location.href = "carrito.html#carrito";
                } else {
                    alert("✅ Producto añadido al carrito");
                }
            });
        });
    }

    // === CARRITO.HTML ===
    if (path.includes("carrito.html")) {
        const contenedor = document.getElementById("carrito-productos");

        function renderizarCarrito() {
            const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            contenedor.innerHTML = "";

            if (carrito.length === 0) {
                contenedor.innerHTML = '<p class="text-center">No hay productos en el carrito.</p>';
                return;
            }

            carrito.forEach((producto, index) => {
                const div = document.createElement("div");
                div.classList.add("producto", "border", "p-3", "mb-3", "rounded", "bg-light");
                div.innerHTML = `
                    <h5>${producto.nombre}</h5>
                    <p>Precio unitario: $${producto.precio.toLocaleString("es-CO")}</p>
                    <div class="d-flex align-items-center mb-2">
                        <span class="me-2">Cantidad:</span>
                        <button class="boton-cantidad btn btn-sm btn-outline-secondary" data-action="disminuir" data-index="${index}">-</button>
                        <span class="mx-2 cantidad">${producto.cantidad}</span>
                        <button class="boton-cantidad btn btn-sm btn-outline-secondary" data-action="aumentar" data-index="${index}">+</button>
                    </div>
                    <p><strong>Total: $${(producto.precio * producto.cantidad).toLocaleString("es-CO")}</strong></p>
                    <button class="btn btn-danger btn-sm eliminar-producto" data-index="${index}">Eliminar</button>
                `;
                contenedor.appendChild(div);
            });

            document.querySelectorAll(".boton-cantidad").forEach(btn => {
                btn.addEventListener("click", () => {
                    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
                    const index = parseInt(btn.dataset.index);
                    const action = btn.dataset.action;

                    if (action === "aumentar") {
                        carrito[index].cantidad += 1;
                    } else if (action === "disminuir") {
                        carrito[index].cantidad = Math.max(1, carrito[index].cantidad - 1);
                    }

                    localStorage.setItem("carrito", JSON.stringify(carrito));
                    renderizarCarrito();
                });
            });

            document.querySelectorAll(".eliminar-producto").forEach(btn => {
                btn.addEventListener("click", () => {
                    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
                    const index = parseInt(btn.dataset.index);
                    carrito.splice(index, 1);
                    localStorage.setItem("carrito", JSON.stringify(carrito));
                    renderizarCarrito();
                });
            });
        }

        renderizarCarrito();

        const metodosPago = document.querySelectorAll(".metodo-pago");
        metodosPago.forEach(item => {
            item.addEventListener("click", () => {
                metodosPago.forEach(m => m.classList.remove("selected"));
                item.classList.add("selected");
            });
        });
    }
});
