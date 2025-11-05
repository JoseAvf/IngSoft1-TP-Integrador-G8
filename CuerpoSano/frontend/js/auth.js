// auth.js
(function () {
    const userRole = localStorage.getItem("userRole");

    if (!userRole) {
        // Si no hay sesión, redirigir directamente
        window.location.replace("login.html");
    } else {
        // Si hay sesión, mostrar el contenido
        document.addEventListener("DOMContentLoaded", () => {
            document.body.style.display = "flex";
            // Mostrar rol en el header si existe el span
            const roleEl = document.getElementById("userRole");
            if (roleEl) roleEl.textContent = `👤 ${userRole}`;
        });
    }
})();
