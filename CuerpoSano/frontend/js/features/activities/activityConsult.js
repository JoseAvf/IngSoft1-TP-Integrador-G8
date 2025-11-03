// activityConsult.js
import { ActivityAPI } from "../../api/activities.js";

document.addEventListener("DOMContentLoaded", () => {
    setupActivityConsult();
});

function setupActivityConsult() {
    const btnSearch = document.getElementById("btnSearch");
    const inputId = document.getElementById("activityId");
    const resultDiv = document.getElementById("activityData");

    btnSearch.addEventListener("click", async () => {
        const id = parseInt(inputId.value.trim());

        // Validación del ID
        if (isNaN(id) || id <= 0) {
            resultDiv.innerHTML = `<p style="color:red;">⚠️ ID inválido. Debe ser un número mayor que 0.</p>`;
            resultDiv.classList.remove("hidden");
            return;
        }

        try {
            const activity = await ActivityAPI.getById(id);

            if (!activity) {
                resultDiv.innerHTML = `<p style="color:red;">❌ No se encontró ninguna actividad con ID ${id}.</p>`;
                resultDiv.classList.remove("hidden");
                return;
            }

            // Contenedor principal
            let html = `
                <h3>Actividad: ${activity.nombre}</h3>
                <p>Estado: ${activity.activa ? "✅ Activa" : "❌ Inactiva"}</p>
            `;

            if (activity.clases && activity.clases.length > 0) {
                html += `<div class="activity-section">
                            <h4>Clases asociadas:</h4>
                            <div class="table-wrapper">
                                <table id="activitiesTable">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Hora Inicio</th>
                                            <th>Hora Fin</th>
                                            <th>Cupo</th>
                                            <th>Fecha Creación</th>
                                            <th>Entrenador</th>
                                            <th>Inscriptos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                `;

                activity.clases.forEach(clase => {

                    const horaInicio = new Date(clase.horaInicio).toLocaleString('es-AR', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', hour12: false
                    });
                    const horaFin = new Date(clase.horaFin).toLocaleString('es-AR', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', hour12: false
                    });

                    html += `
                        <tr>
                            <td>${clase.id}</td>
                            <td>${clase.nombre}</td>
                            <td>${horaInicio}</td>
                            <td>${horaFin}</td>
                            <td>${clase.cupo}</td>
                            <td>${new Date(clase.fechaCreacion).toLocaleDateString()}</td>
                            <td>${clase.entrenadorNombre}</td>
                            <td>${clase.inscriptosCount}</td>
                        </tr>
                    `;
                });

                html += `        </tbody>
                                </table>
                            </div>
                         </div>`;
            } else {
                html += `<p>No hay clases asignadas a esta actividad.</p>`;
            }

            resultDiv.innerHTML = html;
            resultDiv.classList.remove("hidden");

        } catch (err) {
            console.error(err);
            resultDiv.innerHTML = `<p style="color:red;">❌ Error al consultar la actividad: ${err.message}</p>`;
            resultDiv.classList.remove("hidden");
        }
    });
}
