// classRegistration.js
import { ClassAPI } from "../../api/classes.js";
import { ActivityAPI } from "../../api/activities.js";
import { TrainerAPI } from "../../api/trainers.js";

document.addEventListener("DOMContentLoaded", async () => {
    await initClassForm();
});

async function initClassForm() {
    const form = document.getElementById("classForm");
    const actividadSelect = document.getElementById("actividadSelect");
    const entrenadorSelect = document.getElementById("entrenadorSelect");
    const resultDiv = document.getElementById("classFormResult");
    const fechaInput = document.getElementById("fecha");
    const horaInicioInput = document.getElementById("horaInicio");
    const horaFinInput = document.getElementById("horaFin");
    const nombreInput = document.getElementById("nombre");

    // 🔒 Fecha mínima: hoy
    const hoy = new Date();
    fechaInput.min = hoy.toISOString().split("T")[0];

    // 🔡 Validación en tiempo real: solo letras y números en el nombre
    nombreInput.addEventListener("input", () => {
        nombreInput.value = nombreInput.value.replace(/[^A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s]/g, "");
    });

    const horaInicio = document.getElementById("horaInicio");
    const horaFin = document.getElementById("horaFin");

    // Evitar elegir fuera del rango permitido
    [horaInicio, horaFin].forEach(input => {
        input.addEventListener("input", () => {
            const valor = input.value;
            if (valor < "07:00" || valor > "21:00") {
                input.value = ""; // resetea si elige algo fuera del rango
            }
        });
    });

    // Actualizar hora mínima de fin según la de inicio
    horaInicio.addEventListener("change", () => {
        horaFin.min = horaInicio.value;
        if (horaFin.value && horaFin.value < horaInicio.value) {
            horaFin.value = "";
        }
    });


    // 🕑 Restricción de horario y sincronización de inicio/fin
    horaInicioInput.addEventListener("change", () => {
        const horaInicio = horaInicioInput.value;
        if (horaInicio) {
            horaFinInput.min = horaInicio; // no permitir menor que inicio
        }
    });

    // 🕒 Reforzar límites horarios 7:00 - 21:00
    [horaInicioInput, horaFinInput].forEach(input => {
        input.addEventListener("input", () => {
            if (input.value < "07:00") input.value = "07:00";
            if (input.value > "21:00") input.value = "21:00";
        });
    });

    // 📋 Cargar actividades y entrenadores
    try {
        const [actividades, entrenadores] = await Promise.all([
            ActivityAPI.getAll(),
            TrainerAPI.getAll()
        ]);

        actividades.forEach(act => {
            const option = document.createElement("option");
            option.value = act.id;
            option.textContent = act.nombre;
            actividadSelect.appendChild(option);
        });

        entrenadores.forEach(ent => {
            const option = document.createElement("option");
            option.value = ent.id;
            option.textContent = ent.nombre;
            entrenadorSelect.appendChild(option);
        });
    } catch (err) {
        console.error("Error cargando actividades o entrenadores:", err);
        return showError("No se pudieron cargar actividades o entrenadores.");
    }

    // 📩 Envío del formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        resultDiv.textContent = "";

        const formData = new FormData(form);

        const nombre = formData.get("nombre").trim();
        const fecha = formData.get("fecha");
        const horaInicio = formData.get("horaInicio");
        const horaFin = formData.get("horaFin");
        const cupo = parseInt(formData.get("cupo"));

        // 🧾 Validaciones previas
        if (!/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre)) {
            return showAlert("El nombre de la clase solo puede contener letras, números y espacios.", "warning");
        }

        if (!fecha || !horaInicio || !horaFin) {
            return showAlert("Debe ingresar fecha, hora de inicio y hora de fin.", "warning");
        }

        const hoyISO = new Date().toISOString().split("T")[0];
        if (fecha < hoyISO) {
            return showAlert("La fecha de la clase no puede ser anterior al día actual.", "warning");
        }

        const horaInicioDate = new Date(`${fecha}T${horaInicio}`);
        const horaFinDate = new Date(`${fecha}T${horaFin}`);

        // ⏰ Validar que la hora de fin sea al menos 1 hora después
        const diferenciaHoras = (horaFinDate - horaInicioDate) / (1000 * 60 * 60); // diferencia en horas
        if (diferenciaHoras < 1) {
            return showAlert("La hora de fin debe ser al menos 1 hora después de la hora de inicio.", "warning");
        }


        if (horaInicio < "07:00" || horaFin > "21:00") {
            return showAlert("Los horarios deben estar entre las 07:00 y las 21:00.", "warning");
        }

        const claseData = {
            Nombre: nombre,
            HoraInicio: horaInicioDate.toISOString(),
            HoraFin: horaFinDate.toISOString(),
            Cupo: cupo,
            ActividadId: parseInt(formData.get("actividadId")),
            EntrenadorId: parseInt(formData.get("entrenadorId"))
        };

        try {
            const nuevaClase = await ClassAPI.create(claseData);
            showSuccess(`✅ Clase "${nuevaClase.nombre}" registrada correctamente.`);
            form.reset();
        } catch (err) {
            console.error("Error registrando clase:", err);
            showError(`Error al registrar la clase: ${err.message || err}`);
        }
    });
}
