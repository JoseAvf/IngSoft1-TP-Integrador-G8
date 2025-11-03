import { TrainerAPI } from "../../api/trainers.js";

document.addEventListener("DOMContentLoaded", () => {
    trainerRegistration();
    setupRealTimeValidation();
});

export function trainerRegistration() {
    const form = document.getElementById("trainerForm");
    const resultDiv = document.getElementById("trainerFormResult");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const trainerData = {
            nombre: form.nombre.value.trim(),
            dni: form.dni.value.trim(),
            direccion: form.direccion.value.trim(),
            telefono: parseInt(form.telefono.value.trim()),
            fechaNacimiento: form.fechaNacimiento.value
        };

        // Validación final antes de enviar
        if (!/^\d+$/.test(trainerData.dni)) {
            resultDiv.textContent = "⚠️ DNI inválido. Solo se permiten números.";
            resultDiv.style.color = "red";
            return;
        }
        if (!/^[a-zA-Z\s]+$/.test(trainerData.nombre)) {
            resultDiv.textContent = "⚠️ Nombre inválido. Solo se permiten letras y espacios.";
            resultDiv.style.color = "red";
            return;
        }
        if (!/^[a-zA-Z0-9\s#\-,]+$/.test(trainerData.direccion)) {
            resultDiv.textContent = "⚠️ Dirección inválida. Solo letras, números, espacios y #,-";
            resultDiv.style.color = "red";
            return;
        }

        try {
            const nuevoTrainer = await TrainerAPI.create(trainerData);
            resultDiv.textContent = `✅ Entrenador "${nuevoTrainer.nombre}" registrado correctamente con ID ${nuevoTrainer.id}.`;
            resultDiv.style.color = "green";
            form.reset();
            // Limpiamos cualquier mensaje de validación inline o divs adicionales
            // Esto asegura que los inputs vuelvan a su estado inicial
            const inputs = form.querySelectorAll("input");
            inputs.forEach(input => {
                input.value = "";
            });
        } catch (err) {
            console.error(err);
            resultDiv.textContent = `❌ Error al registrar entrenador: ${err.message}`;
            resultDiv.style.color = "red";
        }
    });
}

// Validación en tiempo real
function setupRealTimeValidation() {
    const dniInput = document.querySelector("input[name='dni']");
    const nombreInput = document.querySelector("input[name='nombre']");
    const direccionInput = document.querySelector("input[name='direccion']");

    dniInput.addEventListener("input", () => {
        dniInput.value = dniInput.value.replace(/\D/g, ""); // elimina todo lo que no sea número
    });

    nombreInput.addEventListener("input", () => {
        nombreInput.value = nombreInput.value.replace(/[^a-zA-Z\s]/g, ""); // solo letras y espacios
    });

    direccionInput.addEventListener("input", () => {
        direccionInput.value = direccionInput.value.replace(/[^a-zA-Z0-9\s#\-,]/g, ""); // letras, números, espacios, #, - y ,
    });
}
