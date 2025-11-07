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
            showAlert("Ingrese un ID válido.", "warning");
            return;
        }

        try {
            const activity = await ActivityAPI.getById(id);

            if (!activity) {
                showAlert(`No se encontró ninguna actividad con ID ${id}.`, "warning");
                return;
            }

            currentActivity = activity; // guardamos la actual
            renderActivity(activity);

        } catch (err) {
            console.error(err);
            showError("Error al consultar la actividad. Detalle: " + err.message);
        }
    });
    // 🧩 Renderizar actividad en pantalla
    function renderActivity(activity) {
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
            html += `
                <div class="activity-section">
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
                const horaInicio = new Date(clase.horaInicio).toLocaleString("es-AR", {
                    day: "2-digit", month: "2-digit", year: "numeric",
                    hour: "2-digit", minute: "2-digit", hour12: false
                });
                const horaFin = new Date(clase.horaFin).toLocaleString("es-AR", {
                    day: "2-digit", month: "2-digit", year: "numeric",
                    hour: "2-digit", minute: "2-digit", hour12: false
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

            html += `
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        } else {
            html += `<p>No hay clases asignadas a esta actividad.</p>`;
        }

        resultDiv.innerHTML = html;
        resultDiv.classList.remove("hidden");

        // ✏️ Abrir modal de edición dinámico con SweetAlert
        document.getElementById("btnEditActivity").addEventListener("click", () => {
            showEditModal(activity);
        });
    }

    // 🧩 Modal dinámico con inputs para editar
    function showEditModal(activity) {
        Swal.fire({
            title: "✏️ Editar actividad",
            html: `<div class="swal-edit-container">
                <div class="swal-field">
                    <label for="swal-nombre">Nombre:</label>
                    <input id="swal-nombre" class="swal2-input custom-swal-input" value="${activity.nombre}">
                </div>

                <div class="swal-field">
                    <label for="swal-activa">Activa:</label>
                    <select id="swal-activa" class="swal2-select custom-swal-select">
                        <option value="true" ${activity.activa ? "selected" : ""}>Activa</option>
                        <option value="false" ${!activity.activa ? "selected" : ""}>Inactiva</option>
                    </select>
                </div>
            </div>
            `,
            showCancelButton: true,
            confirmButtonText: "💾 Guardar cambios",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#1976d2",
            cancelButtonColor: "#9e9e9e",
            focusConfirm: false,
            background: "#f9fafb",
            color: "#333",
            customClass: {
                popup: "custom-swal-popup-edit",
                title: "custom-swal-title"
            },
            preConfirm: () => {
                const nombre = document.getElementById("swal-nombre").value.trim();
                const activa = document.getElementById("swal-activa").value === "true";

                if (!nombre) {
                    Swal.showValidationMessage("⚠️ El nombre no puede estar vacío");
                    return false;
                }

                return { nombre, activa };
            }
        }).then(async (result) => {
            if (!result.isConfirmed) return;

            const updatedData = {
                id: activity.id,
                nombre: result.value.nombre,
                activa: result.value.activa
            };

            try {
                await ActivityAPI.update(activity.id, updatedData);
                showSuccess("Actividad actualizada correctamente ✅");

                currentActivity = { ...activity, ...updatedData };
                renderActivity(currentActivity);
            } catch (error) {
                console.error(error);
                showError("Error al actualizar la actividad: " + error.message);
            }
        });
    }
}