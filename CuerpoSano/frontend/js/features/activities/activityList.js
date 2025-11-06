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

async function loadActivities() {
    const tableBody = document.querySelector("#activitiesTable tbody");
    tableBody.innerHTML = "";

    try {
        const activities = await ActivityAPI.getAll();

        if (!activities.length) {
            tableBody.innerHTML = `<tr><td colspan="4">No hay actividades registradas.</td></tr>`;
            return;
        }

        activities.forEach(activity => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${activity.id}</td>
                <td>${activity.nombre}</td>
                <td>${activity.activa ? "✅ Activa" : "❌ Inactiva"}</td>
                <td>
                    <button class="btn-view-classes" data-id="${activity.id}">Ver Clases</button>
                    <button class="btn-delete-activity" data-id="${activity.id}" 
                        style="padding:8px 15px; background-color:#d32f2f; color:white; border:none; border-radius:6px;">
                        Eliminar
                    </button>
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

        // Eventos botones Eliminar (SweetAlert)
        document.querySelectorAll(".btn-delete-activity").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = e.target.dataset.id;
                showConfirmDelete(
                    "¿Seguro que deseas eliminar esta actividad? Esta acción no se puede deshacer.",
                    async () => {
                        try {
                            await ActivityAPI.delete(id);
                            showSuccess("Actividad eliminada correctamente ✅");
                            loadActivities();
                        } catch (err) {
                            console.error(err);
                            showError("Error al eliminar la actividad: " + err.message);
                        }
                    }
                );
            });
        });

    } catch (err) {
        console.error(err);
        showError("Error al cargar las actividades: " + err.message);
        tableBody.innerHTML = `<tr><td colspan="4" style="color:red;">❌ Error al cargar actividades.</td></tr>`;
    }
}

// ---------- Mostrar clases en modal ----------
async function showClassesModal(activityId) {
    try {
        const activity = await ActivityAPI.getById(activityId);

        if (!activity || !activity.clases || activity.clases.length === 0) {
            showAlert("No hay clases asignadas a esta actividad.", "info", "Sin clases");
            return;
        }

        let html = `
            <div class="table-wrapper">
                <table id="modalClassesTable" class="swal2-table">
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
                    <td>${clase.cupo}</td>
                    <td>${horaInicio}</td>
                    <td>${horaFin}</td>
                    <td>${new Date(clase.fechaCreacion).toLocaleDateString("es-AR")}</td>
                    <td>${clase.entrenadorNombre}</td>
                    <td>${clase.inscriptosCount}</td>
                </tr>
            `;
        });

        html += `</tbody></table></div>`;

        Swal.fire({
            title: `Clases de ${activity.nombre}`,
            html: html,
            width: "80%",
            background: "#f9fafb",
            color: "#333",
            confirmButtonText: "Cerrar",
            confirmButtonColor: "#1976d2",
        });

    } catch (err) {
        console.error(err);
        showError("Error al obtener las clases: " + err.message);
    }
}