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

    // Cargar actividades y entrenadores en los select
    try {
        const [actividades, entrenadores] = await Promise.all([
            ActivityAPI.getAll(),
            TrainerAPI.getAll()
        ]);

        // Llenar select de actividades
        actividades.forEach(act => {
            const option = document.createElement("option");
            option.value = act.id;
            option.textContent = act.nombre;
            actividadSelect.appendChild(option);
        });

        // Llenar select de entrenadores
        entrenadores.forEach(ent => {
            const option = document.createElement("option");
            option.value = ent.id;
            option.textContent = ent.nombre;
            entrenadorSelect.appendChild(option);
        });

    } catch (err) {
        console.error("Error cargando actividades o entrenadores:", err);
        resultDiv.textContent = "❌ No se pudieron cargar actividades o entrenadores.";
        resultDiv.style.color = "red";
    }

    // Manejar submit del formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        resultDiv.textContent = "";

        const formData = new FormData(form);

        // Leer fecha y horas
        const fecha = formData.get("fecha"); // 'YYYY-MM-DD'
        const horaInicio = formData.get("horaInicio"); // 'HH:mm'
        const horaFin = formData.get("horaFin");       // 'HH:mm'

        if (!fecha || !horaInicio || !horaFin) {
            resultDiv.textContent = "❌ Debe ingresar fecha, hora de inicio y hora de fin.";
            resultDiv.style.color = "red";
            return;
        }

        let cupo = parseInt(formData.get("cupo"));


        // Armar DateTime completos
        const horaInicioDate = new Date(`${fecha}T${horaInicio}`);
        const horaFinDate = new Date(`${fecha}T${horaFin}`);

        if (horaFinDate <= horaInicioDate) {
            resultDiv.textContent = "❌ La hora de fin debe ser mayor que la hora de inicio.";
            resultDiv.style.color = "red";
            return;
        }

        const claseData = {
            Nombre: formData.get("nombre"),
            HoraInicio: horaInicioDate.toISOString(),
            HoraFin: horaFinDate.toISOString(),
            Cupo: cupo,
            ActividadId: parseInt(formData.get("actividadId")),
            EntrenadorId: parseInt(formData.get("entrenadorId"))
        };


        try {
            const nuevaClase = await ClassAPI.create(claseData);
            resultDiv.textContent = `✅ Clase "${nuevaClase.nombre}" registrada correctamente.`;
            resultDiv.style.color = "green";
            form.reset();
        } catch (err) {
            console.error("Error registrando clase:", err);
            resultDiv.textContent = `❌ Error al registrar la clase: ${err.message || err}`;
            resultDiv.style.color = "red";
        }
    });
}
