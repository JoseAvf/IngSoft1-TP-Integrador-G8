// ===============================
//   auth.js — CuerpoSano System
// ===============================

// ✅ Verificación de sesión
(function () {
    const userRole = localStorage.getItem("userRole");

    if (!userRole) {
        // Si no hay sesión, redirigir directamente
        window.location.replace("login.html");
    } else {
        // Si hay sesión, mostrar contenido al cargar
        document.addEventListener("DOMContentLoaded", () => {
            document.body.style.display = "flex";
            const roleEl = document.getElementById("userRole");
            if (roleEl) roleEl.textContent = `👤 ${userRole}`;
        });
    }
})();

// ✅ Cargar SweetAlert2 dinámicamente (no hace falta tocar cada HTML)
(function loadSweetAlert() {
    const existing = document.querySelector('script[src*="sweetalert2"]');
    if (!existing) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
        script.defer = true;
        document.head.appendChild(script);
    }
})();



// ✅ ==== Funciones globales de alerta con SweetAlert2 ====

// ℹ️ Avisos informativos o advertencias suaves
window.showAlert = (msg, icon = "info", title = "Aviso") => {
    Swal.fire({
        title: title,
        text: msg,
        icon: icon,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#1976d2",
        background: "#f9fafb",
        color: "#333",
    });
};

window.showCloseSession = (msg, icon = "info", title = "Aviso") => {
    Swal.fire({
        title: title,
        text: msg,
        icon: icon,
        background: "#f9fafb",
        color: "#333",
        showConfirmButton: false, // ❌ No mostrar ningún botón
        timer: 2000,              // ⏱ Opcional: se cierra sola en 2 segundos
        timerProgressBar: true,     // Barra de progreso si querés
        allowOutsideClick: false, // ❌ No se cierra al hacer click fuera
        allowEscapeKey: false     // ❌ No se cierra al presionar Esc

    });
};

// ⚠️ Confirmaciones con callback
window.showConfirm = (msg, onConfirm, title = "¿Estás seguro?") => {
    Swal.fire({
        title: title,
        text: msg,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#1976d2",
        cancelButtonColor: "#9e9e9e",
        background: "#f9fafb",
        color: "#333",
    }).then((result) => {
        if (result.isConfirmed && typeof onConfirm === "function") {
            onConfirm();
        }
    });
};

// ⚠️ Confirmaciones con callback
window.showConfirmDelete = (msg, onConfirm, title = "⚠️ Atención") => {
    Swal.fire({
        title: title,
        text: msg,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d32f2f",
        cancelButtonColor: "#9e9e9e",
        background: "#f9fafb",
        color: "#333",
    }).then((result) => {
        if (result.isConfirmed && typeof onConfirm === "function") {
            onConfirm();
        }
    });
};

// ❌ Errores importantes
window.showError = (msg, title = "⚠️ Error") => {
    Swal.fire({
        title: title,
        text: msg,
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#d32f2f",
        background: "#fff5f5",
        color: "#333",
    });
};

// ✅ Éxitos o acciones completadas
window.showSuccess = (msg, title = "✅ Éxito") => {
    Swal.fire({
        title: title,
        text: msg,
        icon: "success",
        confirmButtonText: "Genial",
        confirmButtonColor: "#2e7d32",
        background: "#f0fff4",
        color: "#333",
        timer: 4500,
        timerProgressBar: true,
    });
};
