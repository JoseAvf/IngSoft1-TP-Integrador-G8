// classList.js
import { ClassAPI } from "../../api/classes.js";

document.addEventListener("DOMContentLoaded", () => {
    loadClasses();
    setupModals();
});

// ---------- Referencias ----------
const deleteModal = document.getElementById("deleteModal");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const closeDeleteBtn = document.querySelector(".closeDeleteModal");

const miembrosModal = document.getElementById("miembrosModal");
const miembrosModalBody = document.getElementById("miembrosModalBody");
const closeMiembrosModalBtn = document.querySelector(".closeMiembrosModal");

let classIdToDelete = null;

// ---------- Cargar listado de clases ----------
async function loadClasses() {
    const tableBody = document.querySelector("#classesTable tbody");
    tableBody.innerHTML = "";

    try {
        const classes = await ClassAPI.getAll();

        if (!classes || classes.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="8">No hay clases registradas.</td></tr>`;
            return;
        }

        classes.forEach(c => {
            const row = document.createElement("tr");

            const horaInicio = new Date(c.horaInicio).toLocaleString("es-AR", {
                day: "2-digit", month: "2-digit", year: "numeric",
                hour: "2-digit", minute: "2-digit", hour12: false
            });

            const horaFin = new Date(c.horaFin).toLocaleString("es-AR", {
                day: "2-digit", month: "2-digit", year: "numeric",
                hour: "2-digit", minute: "2-digit", hour12: false
            });

            row.innerHTML = `
                <td>${c.id}</td>
                <td>${c.nombre || "-"}</td>
                <td>${c.actividadNombre || "-"}</td>
                <td>${c.entrenadorNombre || "No asignado"}</td>
                <td>${horaInicio}</td>
                <td>${horaFin}</td>
                <td>${c.inscriptosCount}</td>
                <td>${c.cupo}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-ver-miembros" data-id="${c.id}" style="background-color:#1976d2; color:white;">👥 Inscriptos</button>
                        <button class="btn-asistencia" data-id="${c.id}" style="background-color:#1976d2; color:white;">📋 Asistencia</button>
                        <button class="btn-delete" data-id="${c.id}" style="background-color:#d32f2f; color:white;"> Eliminar</button>
                    </div>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Asignar eventos a botones
        document.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", e => {
                classIdToDelete = e.target.dataset.id;
                deleteModal.classList.remove("hidden"); // ✅ Mostrar modal centrado
            });
        });

        document.querySelectorAll(".btn-ver-miembros").forEach(btn => {
            btn.addEventListener("click", async e => {
                const classId = e.target.dataset.id;
                await showMiembrosModal(classId);
            });
        });

        document.addEventListener("click", async (e) => {
            if (e.target.classList.contains("btn-asistencia")) {
                const claseId = e.target.dataset.id;
                await abrirModalAsistencia(claseId);
            }
        });



    } catch (err) {
        console.error(err);
        tableBody.innerHTML = `<tr><td colspan="8" style="color:red;">❌ Error al cargar clases: ${err.message}</td></tr>`;
    }
}

// ---------- Configuración modales ----------

// ---------- Mostrar modal de miembros ----------
async function showMiembrosModal(classId) {
    miembrosModalBody.innerHTML = "<p>Cargando miembros...</p>";
    miembrosModal.classList.remove("hidden");

    try {
        const miembros = await ClassAPI.getMiembros(classId);
        if (!miembros || miembros.length === 0) {
            miembrosModalBody.innerHTML = `<p>No hay miembros inscriptos en esta clase.</p>`;
            return;
        }

        let html = `
            <div class="table-wrapper">
                <table id="miembrosTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>DNI</th>
                            <th>Carnet</th>
                            <th>Tipo Membresía</th>
                            <th>Entrenador</th>
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
                    <td>${m.codigoCarnet || "No asignado"}</td>
                    <td>${m.tipoMembresia || "No asignada"}</td>
                    <td>${m.entrenadorNombre || "No asignado"}</td>
                </tr>
            `;
        });

        html += `</tbody></table></div>`;
        miembrosModalBody.innerHTML = html;

    } catch (err) {
        console.error(err);
        miembrosModalBody.innerHTML = `<p style="color:red;">❌ Error al obtener miembros: ${err.message}</p>`;
    }
}

async function abrirModalAsistencia(claseId) {
    const modal = document.getElementById("attendanceModal");
    const lista = document.getElementById("attendanceMiembrosList");
    const claseNombre = document.getElementById("attendanceClaseNombre");
    const entrenadorNombre = document.getElementById("attendanceEntrenadorNombre");

    // ✅ Usamos ClassAPI
    const clase = await ClassAPI.getById(claseId);
    const miembros = await ClassAPI.getMiembros(claseId);

    claseNombre.textContent = clase.nombre;
    entrenadorNombre.textContent = clase.entrenadorNombre || "No asignado";

    lista.innerHTML = "";
    miembros.forEach(m => {
        const div = document.createElement("div");
        div.innerHTML = `
      <label>
        Nombre: ${m.nombre} - DNI: ${m.dni}
        <input type="checkbox" class="check-miembro" data-miembro-id="${m.id}">
      </label>
    `;
        lista.appendChild(div);
    });

    modal.classList.remove("hidden");

    // Guardar y cancelar
    document.getElementById("btnGuardarAsistencia").onclick = async () => {
        await guardarAsistencia(claseId, clase.entrenadorId);
    };
    document.getElementById("btnCancelarAsistencia").onclick = () => {
        modal.classList.add("hidden");
    };
}

async function guardarAsistencia(claseId, entrenadorId) {
    const miembrosChecks = document.querySelectorAll(".check-miembro");
    const entrenadorCheck = document.getElementById("entrenadorAsistio").checked;

    // Registrar asistencias de miembros
    for (const chk of miembrosChecks) {
        const miembroId = chk.dataset.miembroId;
        const asistio = chk.checked;
        await ClassAPI.registrarAsistenciaMiembro(claseId, miembroId, asistio);
    }

    // Registrar asistencia del entrenador
    if (entrenadorId) {
        await ClassAPI.registrarAsistenciaEntrenador(claseId, entrenadorId, entrenadorCheck);
    }

    // Marcar inasistencias restantes
    await ClassAPI.registrarInasistenciasPendientes(claseId);

    alert("✅ Asistencia registrada correctamente");
    document.getElementById("attendanceModal").classList.add("hidden");
}




function setupModals() {
    // Modal de eliminación
    if (deleteModal && closeDeleteBtn && cancelDeleteBtn) {
        closeDeleteBtn.addEventListener("click", closeDeleteModal);
        cancelDeleteBtn.addEventListener("click", closeDeleteModal);
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener("click", async () => {
            if (!classIdToDelete) return;
            try {
                await ClassAPI.delete(classIdToDelete);
                alert("✅ Clase eliminada correctamente.");
                closeDeleteModal();
                loadClasses();
            } catch (err) {
                console.error(err);
                alert("❌ Error al eliminar clase: " + err.message);
            }
        });
    }

    // Modal de miembros
    if (miembrosModal && closeMiembrosModalBtn) {
        closeMiembrosModalBtn.addEventListener("click", () => {
            miembrosModal.classList.add("hidden");
        });
    }

    // Cerrar modales al hacer clic fuera
    window.addEventListener("click", (e) => {
        if (e.target === deleteModal) closeDeleteModal();
        if (e.target === miembrosModal) miembrosModal.classList.add("hidden");
    });
}

// Cerrar modal
function closeDeleteModal() {
    deleteModal.classList.add("hidden");
    classIdToDelete = null;
}

// ---------- Botón de impresión ----------
const printBtn = document.getElementById("btnPrint");
if (printBtn) {
    printBtn.addEventListener("click", () => {
        window.print(); // 🖨️ abre el diálogo de impresión del navegador
    });
}
