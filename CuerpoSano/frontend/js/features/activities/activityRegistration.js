// activityRegistration.js
import { ActivityAPI } from "../../api/activities.js";

document.addEventListener("DOMContentLoaded", () => {
    activityRegistration();
    setupRealTimeValidation();
});

export function activityRegistration() {
    const form = document.getElementById("activityForm");
    const resultDiv = document.getElementById("activityFormResult");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const activityData = {
            nombre: form.nombre.value.trim(),
            activa: form.activa.checked
        };

        // Validación final
        if (!/^[a-zA-Z\s]+$/.test(activityData.nombre)) {
            resultDiv.textContent = "⚠️ Nombre inválido. Ingrese un nombre válido.";
            resultDiv.style.color = "red";
            return;
        }

        try {
            const nuevaActividad = await ActivityAPI.create(activityData);

            resultDiv.textContent = `✅ Actividad "${nuevaActividad.nombre}" registrada correctamente con ID ${nuevaActividad.id}.`;
            resultDiv.style.color = "green";

            // Limpiamos el formulario
            form.reset();

            // Limpiamos cualquier valor residual en los inputs
            const inputs = form.querySelectorAll("input");
            inputs.forEach(input => {
                if (input.type !== "checkbox") input.value = "";
                else input.checked = true; // Checkbox vuelve a checked por defecto
            });

        } catch (err) {
            console.error(err);
            resultDiv.textContent = `❌ Error al registrar actividad: ${err.message}`;
            resultDiv.style.color = "red";
        }
    });
}

// Validación en tiempo real del nombre
function setupRealTimeValidation() {
    const nombreInput = document.querySelector("input[name='nombre']");

    nombreInput.addEventListener("input", () => {
        nombreInput.value = nombreInput.value.replace(/[^a-zA-Z\s]/g, "");
    });
}
