// trainerRegister.js
import { TrainerAPI } from "../../api/trainers.js";

document.addEventListener("DOMContentLoaded", () => {
    trainerRegistration();
    setupRealTimeValidation();
});

function trainerRegistration() {
    const form = document.getElementById("trainerForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const trainerData = {
            nombre: form.nombre.value.trim(),
            dni: form.dni.value.trim(),
            direccion: form.direccion.value.trim(),
            telefono: form.telefono.value.trim(),
            fechaNacimiento: form.fechaNacimiento.value
        };

        // --- Validaciones ---
        if (!trainerData.nombre || !trainerData.dni || !trainerData.direccion || !trainerData.telefono || !trainerData.fechaNacimiento) {
            Swal.fire({
                icon: "warning",
                title: "Campos incompletos",
                text: "Por favor, complete todos los campos antes de continuar.",
                confirmButtonColor: "#1976d2",
                background: "#f9fafb",
                color: "#333"
            });
            return;
        }

        if (!/^\d+$/.test(trainerData.dni)) {
            Swal.fire({
                icon: "error",
                title: "DNI inválido",
                text: "El DNI debe contener solo números.",
                confirmButtonColor: "#1976d2",
                background: "#f9fafb",
                color: "#333"
            });
            return;
        }

        if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/.test(trainerData.nombre)) {
            Swal.fire({
                icon: "error",
                title: "Nombre inválido",
                text: "El nombre solo puede contener letras y espacios.",
                confirmButtonColor: "#1976d2",
                background: "#f9fafb",
                color: "#333"
            });
            return;
        }

        if (!/^[a-zA-Z0-9\s#\-,.]+$/.test(trainerData.direccion)) {
            Swal.fire({
                icon: "error",
                title: "Dirección inválida",
                text: "La dirección solo puede contener letras, números, espacios y los caracteres #, -, ,",
                confirmButtonColor: "#1976d2",
                background: "#f9fafb",
                color: "#333"
            });
            return;
        }

        if (!/^\d{7,15}$/.test(trainerData.telefono)) {
            Swal.fire({
                icon: "error",
                title: "Teléfono inválido",
                text: "El teléfono debe contener entre 7 y 15 números.",
                confirmButtonColor: "#1976d2",
                background: "#f9fafb",
                color: "#333"
            });
            return;
        }

        try {
            const nuevoTrainer = await TrainerAPI.create({
                ...trainerData,
                telefono: parseInt(trainerData.telefono)
            });

            Swal.fire({
                icon: "success",
                title: "Entrenador registrado",
                html: `
                    <p><strong>${nuevoTrainer.nombre}</strong> fue registrado correctamente.</p>
                    <p style="font-size:0.9rem; color:#555;">ID asignado: <strong>${nuevoTrainer.id}</strong></p>
                `,
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#1976d2",
                background: "#f9fafb",
                color: "#333"
            });

            form.reset();
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Error al registrar",
                text: err.message || "No se pudo registrar el entrenador.",
                confirmButtonColor: "#1976d2",
                background: "#f9fafb",
                color: "#333"
            });
        }
    });
}

// --- Validación en tiempo real ---
function setupRealTimeValidation() {
    const dniInput = document.querySelector("input[name='dni']");
    const nombreInput = document.querySelector("input[name='nombre']");
    const direccionInput = document.querySelector("input[name='direccion']");
    const telefonoInput = document.querySelector("input[name='telefono']");

    if (!dniInput || !nombreInput || !direccionInput || !telefonoInput) return;

    dniInput.addEventListener("input", () => {
        dniInput.value = dniInput.value.replace(/\D/g, "");
    });

    nombreInput.addEventListener("input", () => {
        nombreInput.value = nombreInput.value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúñÑ\s]/g, "");
    });

    direccionInput.addEventListener("input", () => {
        direccionInput.value = direccionInput.value.replace(/[^a-zA-Z0-9\s#\-,.]/g, "");
    });

    telefonoInput.addEventListener("input", () => {
        telefonoInput.value = telefonoInput.value.replace(/\D/g, "");
    });
}
