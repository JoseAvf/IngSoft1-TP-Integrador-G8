// activityList.js
import { ActivityAPI } from "../../api/activities.js";

document.addEventListener("DOMContentLoaded", () => {
    loadActivities();
    setupModals();
});

// ---------- Modales ----------
const classesModal = document.getElementById("classesModal");
const classesModalContent = document.getElementById("modalBody");
const closeClassesModalBtn = document.querySelector(".closeModal");

const deleteModal = document.getElementById("deleteModal");
const closeDeleteBtn = document.querySelector(".closeDeleteModal");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

let activityIdToDelete = null;

// ---------- Cargar actividades ----------
async function loadActivities() {
    const tableBody = document.querySelector("#activitiesTable tbody");
    tableBody.innerHTML = "";

    try {
        const activities = await ActivityAPI.getAll();

        activities.forEach(activity => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${activity.id}</td>
                <td>${activity.nombre}</td>
                <td>${activity.activa ? "✅ Activa" : "❌ Inactiva"}</td>
                <td>
                    <button class="btn-view-classes" data-id="${activity.id}">Ver Clases</button>
                    <button class="btn-delete-activity" data-id="${activity.id}" style="padding:8px 15px; background-color:#d32f2f; color:white; border:none; border-radius:6px;">Eliminar</button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Eventos botones Ver Clases
        document.querySelectorAll(".btn-view-classes").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const activityId = e.target.dataset.id;
                await showClassesModal(activityId);
            });
        });

        // Eventos botones Eliminar
        document.querySelectorAll(".btn-delete-activity").forEach(btn => {
            btn.addEventListener("click", (e) => {
                activityIdToDelete = e.target.dataset.id;
                deleteModal.style.display = "block";
            });
        });

    } catch (err) {
        console.error(err);
        tableBody.innerHTML = `<tr><td colspan="4" style="color:red;">❌ Error al cargar actividades: ${err.message}</td></tr>`;
    }
}

// ---------- Mostrar clases en modal ----------
async function showClassesModal(activityId) {
    try {
        const activity = await ActivityAPI.getById(activityId);

        if (!activity || !activity.clases || activity.clases.length === 0) {
            classesModalContent.innerHTML = `<p>No hay clases asignadas a esta actividad.</p>`;
        } else {
            let html = `<div class="table-wrapper">
                            <table id="modalClassesTable">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Cupo</th>
                                        <th>Hora Inicio</th>
                                        <th>Hora Fin</th>
                                        <th>Fecha Creación</th>
                                        <th>Entrenador</th>
                                        <th>Inscriptos</th>
                                    </tr>
                                </thead>
                                <tbody>`;

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
                        <td>${clase.cupo}</td>
                        <td>${horaInicio}</td>
                        <td>${horaFin}</td>
                        <td>${new Date(clase.fechaCreacion).toLocaleDateString('es-AR')}</td>
                        <td>${clase.entrenadorNombre}</td>
                        <td>${clase.inscriptosCount}</td>
                    </tr>
                `;
            });

            html += `</tbody></table></div>`;
            classesModalContent.innerHTML = html;
        }

        classesModal.style.display = "block";

    } catch (err) {
        console.error(err);
        classesModalContent.innerHTML = `<p style="color:red;">❌ Error al obtener clases: ${err.message}</p>`;
        classesModal.style.display = "block";
    }
}

// ---------- Configuración modales ----------
function setupModals() {
    // --- Cierre modal Ver Clases ---
    if (classesModal && closeClassesModalBtn) {
        closeClassesModalBtn.addEventListener("click", () => {
            classesModal.style.display = "none";
        });
    }

    // --- Cierre modal Delete ---
    if (deleteModal && closeDeleteBtn && cancelDeleteBtn) {
        closeDeleteBtn.addEventListener("click", () => {
            deleteModal.style.display = "none";
            activityIdToDelete = null;
        });
        cancelDeleteBtn.addEventListener("click", () => {
            deleteModal.style.display = "none";
            activityIdToDelete = null;
        });
    }

    // --- Confirmar eliminación ---
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener("click", async () => {
            if (!activityIdToDelete) return;

            try {
                await ActivityAPI.delete(activityIdToDelete);
                alert("✅ Actividad eliminada correctamente.");
                deleteModal.style.display = "none";
                activityIdToDelete = null;
                loadActivities();
            } catch (err) {
                console.error(err);
                alert("❌ Error al eliminar actividad: " + err.message);
            }
        });
    }

    // --- Cerrar clic fuera de modales ---
    window.addEventListener("click", (e) => {
        if (e.target === classesModal) classesModal.style.display = "none";
        if (e.target === deleteModal) {
            deleteModal.style.display = "none";
            activityIdToDelete = null;
        }
    });
}
