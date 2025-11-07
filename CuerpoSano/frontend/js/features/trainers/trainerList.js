// trainerList.js
import { TrainerAPI } from "../../api/trainers.js";

document.addEventListener("DOMContentLoaded", () => {
    loadTrainers();
    setupModals();
});

// ---------- Referencias a modales ----------
const membersModal = document.getElementById("membersModal");
const membersModalBody = document.getElementById("membersModalBody");
const closeMembersModalBtn = document.querySelector(".closeMembersModal");

const classesModal = document.getElementById("classesModal");
const classesModalBody = document.getElementById("classesModalBody");
const closeClassesModalBtn = document.querySelector(".closeClassesModal");

// ---------- Cargar entrenadores ----------
async function loadTrainers() {
    const tableBody = document.querySelector("#trainersTable tbody");
    tableBody.innerHTML = "";

    try {
        const trainers = await TrainerAPI.getAll();

        trainers.forEach(trainer => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${trainer.id}</td>
                <td>${trainer.nombre}</td>
                <td>${trainer.dni}</td>
                <td>${trainer.telefono}</td>
                <td>${trainer.direccion}</td>
                <td>${formatDate(trainer.fechaNacimiento)}</td>
                <td>
                    <button class="btn-view-members" data-id="${trainer.id}">👥 Ver Miembros</button>
                    <button class="btn-view-classes" data-id="${trainer.id}">🏋️ Ver Clases</button>
                     <button class="btn-delete-trainer" data-id="${trainer.id}"> Eliminar</button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Asignar eventos a los botones
        document.querySelectorAll(".btn-view-members").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const trainerId = e.target.dataset.id;
                await showMembersModal(trainerId);
            });
        });

        document.querySelectorAll(".btn-view-classes").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const trainerId = e.target.dataset.id;
                await showClassesModal(trainerId);
            });
        });

        // Agregar evento a los botones de eliminar entrenador
        document.querySelectorAll(".btn-delete-trainer").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const trainerId = e.target.dataset.id;
                showConfirmDelete(
                    "¿Seguro que deseas eliminar este entrenador? Esta acción no se puede deshacer.",
                    async () => {
                        try {
                            await TrainerAPI.delete(trainerId);
                            showSuccess("Entrenador eliminado correctamente ✅");
                            await loadTrainers(); // refresca tabla
                        } catch (err) {
                            showError("Error al eliminar entrenador: " + err.message);
                        }
                    }
                );
            });
        });

    } catch (err) {
        console.error(err);
        tableBody.innerHTML = `<tr><td colspan="7" style="color:red;">❌ Error al cargar entrenadores: ${err.message}</td></tr>`;
    }
}

// ---------- Mostrar miembros en modal ----------
async function showMembersModal(trainerId) {
    try {
        const miembros = await TrainerAPI.getMiembrosAsignados(trainerId);

        // Aseguramos que sea un array
        const miembrosArray = Array.isArray(miembros) ? miembros : [];

        if (miembrosArray.length === 0) {
            membersModalBody.innerHTML = `<p style="text-align: center;">No hay miembros asignados a este entrenador.</p>`;
        } else {
            let html = `
                <div class="table-wrapper">
                    <table id="membersTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>DNI</th>
                                <th>Teléfono</th>
                                <th>Correo</th>
                                <th>Código Carnet</th>
                                <th>Tipo Membresía</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            miembros.forEach(m => {
                html += `
                    <tr>
                        <td>${m.id}</td>
                        <td>${m.nombre}</td>
                        <td>${m.dni}</td>
                        <td>${m.telefono}</td>
                        <td>${m.correo}</td>
                        <td>${m.codigoCarnet || "No asignado"}</td>
                        <td>${m.tipoMembresia || "No asignada"}</td>
                    </tr>
                `;
            });

            html += `</tbody></table></div>`;
            membersModalBody.innerHTML = html;
        }

        membersModal.classList.add("active");

    } catch (err) {
        console.error(err);
        membersModalBody.innerHTML = `<p style="color:red;">❌ Error al obtener miembros: ${err.message}</p>`;
        membersModal.classList.add("active");

    }
}

// ---------- Mostrar clases en modal ----------
async function showClassesModal(trainerId) {
    try {
        const trainer = await TrainerAPI.getById(trainerId);

        if (!trainer || !trainer.clases || trainer.clases.length === 0) {
            classesModalBody.innerHTML = `<p style="text-align: center;">No hay clases asignadas a este entrenador.</p>`;
        } else {
            let html = `
                <div class="table-wrapper">
                    <table id="classesTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Actividad</th>
                                <th>Cupo</th>
                                <th>Hora Inicio</th>
                                <th>Hora Fin</th>
                                <th>Fecha Creación</th>
                                <th>Inscriptos</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            trainer.clases.forEach(clase => {
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
                        <td>${clase.actividadNombre}</td>
                        <td>${clase.cupo}</td>
                        <td>${horaInicio}</td>
                        <td>${horaFin}</td>
                        <td>${formatDate(clase.fechaCreacion)}</td>
                        <td>${clase.inscriptosCount}</td>
                    </tr>
                `;
            });

            html += `</tbody></table></div>`;
            classesModalBody.innerHTML = html;
        }

        classesModal.classList.add("active");

    } catch (err) {
        console.error(err);
        classesModalBody.innerHTML = `<p style="color:red;">❌ Error al obtener clases: ${err.message}</p>`;
        classesModal.classList.add("active");

    }
}

// ---------- Utilidades ----------
function formatDate(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date)) return "-";
    return date.toLocaleDateString("es-AR");
}

// ---------- Configuración modales ----------
function setupModals() {
    if (membersModal && closeMembersModalBtn) {
        closeMembersModalBtn.addEventListener("click", () => {
            membersModal.classList.remove("active");
        });
    }

    if (classesModal && closeClassesModalBtn) {
        closeClassesModalBtn.addEventListener("click", () => {
            classesModal.classList.remove("active");
        });
    }

    window.addEventListener("click", (e) => {
        if (e.target === membersModal) membersModal.classList.remove("active");
        if (e.target === classesModal) classesModal.classList.remove("active");
    });
}

