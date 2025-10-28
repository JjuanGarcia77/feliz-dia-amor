// Elementos del DOM
const btnPerdon = document.getElementById("btnPerdon");
const btnCelebrar = document.getElementById("btnCelebrar");
const volver1 = document.getElementById("volver1");
const volver2 = document.getElementById("volver2");
const pantalla = document.querySelector(".pantalla-inicial");
const carta = document.getElementById("carta");
const celebracion = document.getElementById("celebracion");
const cancion = document.getElementById("cancion");
const musicaRomantica = document.getElementById("musicaRomantica");
const canvas = document.getElementById("ramoCanvas");
const ctx = canvas.getContext("2d");

// Tamaño del canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Botones principales
btnPerdon.addEventListener("click", () => {
    pantalla.style.display = "none";
    carta.style.display = "flex";
});

btnCelebrar.addEventListener("click", () => {
    pantalla.style.display = "none";
    celebracion.style.display = "flex";
    generarRamo();
    cancion.play();
});

// Volver desde carta
volver1.addEventListener("click", () => {
    carta.style.display = "none";
    pantalla.style.display = "flex";
});

// Volver desde celebración
volver2.addEventListener("click", () => {
    celebracion.style.display = "none";
    pantalla.style.display = "flex";
    cancion.pause();
    cancion.currentTime = 0;
    musicaRomantica.pause();
    musicaRomantica.currentTime = 0;
});

// ---- Dibujo del ramo ----
const flores = [];
const mensajes = [
    "Te amo con el alma 💚",
    "Eres mi vida 🌿",
    "Mi razón de sonreír ✨",
    "Eres mi paz y mi locura 💫",
    "Mi corazón te pertenece 💚",
    "Eres todo para mí 💖",
    "Mi destino eres tú 🌸",
    "Te pienso siempre 💚"
];

function dibujarTallo(x, y, h) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - h);
    ctx.strokeStyle = "#0d6b3e";
    ctx.lineWidth = 4;
    ctx.stroke();
}

function dibujarHoja(x, y, lado) {
    ctx.beginPath();
    ctx.ellipse(x + lado * 15, y - 10, 18, 10, Math.PI / 4 * lado, 0, Math.PI * 2);
    ctx.fillStyle = "#2ecc71";
    ctx.fill();
}

function dibujarFlor(x, y, color) {
    const petalos = 6;
    for (let i = 0; i < petalos; i++) {
        const ang = (Math.PI * 2 / petalos) * i;
        const px = x + Math.cos(ang) * 20;
        const py = y + Math.sin(ang) * 20;
        ctx.beginPath();
        ctx.arc(px, py, 12, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fillStyle = "#145a32";
    ctx.fill();
}

function generarRamo() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    flores.length = 0;
    const baseX = canvas.width / 2;
    const baseY = canvas.height * 0.85;
    const cantidad = 8;

    for (let i = 0; i < cantidad; i++) {
        const x = baseX + (i - cantidad / 2) * 80;
        const h = 200 + Math.random() * 60;
        const color = `hsl(${Math.random() * 60 + 90}, 70%, 60%)`;
        const mensaje = mensajes[i % mensajes.length];

        dibujarTallo(x, baseY, h);
        dibujarHoja(x, baseY - h / 2, i % 2 === 0 ? 1 : -1);
        dibujarHoja(x, baseY - h / 3, i % 2 === 0 ? -1 : 1);
        dibujarFlor(x, baseY - h, color);

        flores.push({ x, y: baseY - h, mensaje });
    }
}

// ---- Mostrar mensaje al tocar flor ----
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    flores.forEach(flor => {
        const dx = mx - flor.x;
        const dy = my - flor.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);

        // rango ampliado para que funcione con toda la flor
        if (distancia < 45) {
            mostrarMensaje(flor.mensaje, flor.x, flor.y - 15);

            // 💚 reproducir canción completa solo si no está sonando
            if (musicaRomantica.paused) {
                musicaRomantica.currentTime = 0;
                musicaRomantica.play();
            }
        }
    });
});

// ---- Animación de mensaje ----
function mostrarMensaje(texto, x, y) {
    const mensaje = document.createElement("div");
    mensaje.className = "mensaje-flor";
    mensaje.innerText = texto;
    mensaje.style.left = `${x}px`;
    mensaje.style.top = `${y}px`;
    document.body.appendChild(mensaje);

    // animación suave
    setTimeout(() => {
        mensaje.style.opacity = "1";
        mensaje.style.transform = "translateY(-20px)";
    }, 100);

    // se desvanece lentamente
    setTimeout(() => {
        mensaje.style.opacity = "0";
        mensaje.style.transform = "translateY(-60px)";
        setTimeout(() => mensaje.remove(), 1200);
    }, 3000);
}
