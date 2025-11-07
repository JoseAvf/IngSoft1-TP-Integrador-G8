// activityConsult.js
import { ActivityAPI } from "../../api/activities.js";

document.addEventListener("DOMContentLoaded", () => {
    setupActivityConsult();
});

function setupActivityConsult() {
    const btnSearch = document.getElementById("btnSearch");
    const inputId = document.getElementById("activityId");
    const resultDiv = document.getElementById("activityData");

    const modal = document.getElementById("editModal");
    const form = document.getElementById("editActivityForm");
    const inputNombre = document.getElementById("editNombre");
    const selectActiva = document.getElementById("editActiva");
    const btnCancel = document.getElementById("btnCancelEdit");

    let currentActivity = null; // guardamos la actividad actual


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

            currentActivity = activity; // guardamos la actual

            // Contenedor principal
            let html = `
                 <div class="activity-header">
                    <h3>Actividad: ${activity.nombre}</h3>
                    <button id="btnEditActivity" class="btn-edit">✏️ Editar</button>
                  </div>
               <p>Estado:
                    <span class="activity-status ${activity.activa ? "active" : "inactive"}">
                      ${activity.activa ? "Activa" : "Inactiva"}
                    </span>
                  </p>
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

            // 💡 Evento para abrir el modal
            document.getElementById("btnEditActivity").addEventListener("click", () => {
                inputNombre.value = currentActivity.nombre;
                selectActiva.value = currentActivity.activa ? "true" : "false";
                modal.classList.remove("hidden");
            });


        } catch (err) {
            console.error(err);
            resultDiv.innerHTML = `<p style="color:red;">❌ Error al consultar la actividad: ${err.message}</p>`;
            resultDiv.classList.remove("hidden");
        }
    });

    // 💾 Guardar cambios
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!currentActivity) return;

        const updatedData = {
            id: currentActivity.id,
            nombre: inputNombre.value.trim(),
            activa: selectActiva.value === "true"
        };

        try {
            await ActivityAPI.update(currentActivity.id, updatedData);
            showToast();

            // reflejar cambios en pantalla
            currentActivity.nombre = updatedData.nombre;
            currentActivity.activa = updatedData.activa;

            // refrescar info
            document.getElementById("btnSearch").click();
            modal.classList.add("hidden");

        } catch (error) {
            console.error(error);
            alert("❌ Error al actualizar la actividad: " + error.message);
        }
    });

    // ❌ Cerrar modal
    btnCancel.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    function showToast(message = "Actualizado con éxito ✅") {
        const toast = document.getElementById("toast");
        toast.textContent = message;
        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000); // desaparece después de 3s
    }

}

