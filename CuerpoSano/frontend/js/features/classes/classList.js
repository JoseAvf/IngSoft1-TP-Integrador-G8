// classList.js
import { ClassAPI } from "../../api/classes.js";

document.addEventListener("DOMContentLoaded", () => {
    loadClasses();
    setupModals();
});

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

        // Asignar eventos
        document.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", e => {
                const id = e.target.dataset.id;
                showConfirmDelete(
                    "¿Seguro que deseas eliminar esta clase? Esta acción no se puede deshacer.",
                    async () => await eliminarClase(id)
                );
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
        showError("Error al cargar las clases: " + err.message);
    }
}

// ---------- Eliminar clase ----------
async function eliminarClase(classId) {
    try {
        await ClassAPI.delete(classId);
        showSuccess("Clase eliminada correctamente.");
        loadClasses();
    } catch (err) {
        console.error(err);
        showError("No se pudo eliminar la clase: " + err.message);
    }
}

// ---------- Mostrar miembros ----------
async function showMiembrosModal(classId) {
    const miembrosModal = document.getElementById("miembrosModal");
    const miembrosModalBody = document.getElementById("miembrosModalBody");
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
        showError("Error al obtener los miembros: " + err.message);
    }
}

// ---------- Modal de asistencia ----------
async function abrirModalAsistencia(claseId) {
    try {
        // Traemos datos de la clase y sus miembros
        const clase = await ClassAPI.getById(claseId);
        const miembros = await ClassAPI.getMiembros(claseId);

        if (!miembros || miembros.length === 0) {
            showAlert("No hay miembros inscriptos en esta clase.", "info", "Sin inscriptos");
            return;
        }

        // Traemos asistencias previas (si existen)
        let asistenciasPrevias = null;
        try {
            asistenciasPrevias = await ClassAPI.getAsistencias(claseId);
        } catch (e) {
            console.warn("No se encontraron asistencias previas o hubo un error al obtenerlas.");
        }

        // Mapeamos asistencias previas por miembroId para marcar los checkboxes
        const asistenciaMap = new Map();
        if (asistenciasPrevias && asistenciasPrevias.miembros) {
            asistenciasPrevias.miembros.forEach(a => {
                asistenciaMap.set(a.miembroId, a.asistio);
            });
        }

        const entrenadorAsistioPrevio =
            asistenciasPrevias?.entrenador?.asistio || false;

        // ====== HTML del modal ======
        const html = `
            <div class="asistencia-card">
                <div class="asistencia-header">
                    <h3>${clase.nombre}</h3>
                    <p><span class="label">Entrenador:</span> ${clase.entrenadorNombre || "No asignado"}</p>
                </div>

                <div class="asistencia-miembros">
                    <div class="miembros-header">
                        <div class="col-check"></div>
                        <div class="col-nombre">Miembro</div>
                        <div class="col-dni">DNI</div>
                    </div>

                     ${miembros.map(m => {
                         const asistioPrevio = asistenciaMap.get(m.id);
                         const checked = asistioPrevio ? "checked" : "";
                         const disabled = asistioPrevio ? "disabled" : "";
                         const itemClass = asistioPrevio ? "miembro-item asistio-previo" : "miembro-item";

                         return `
                            <div class="${itemClass}">
                                <div class="col-check">
                                    <input type="checkbox" class="check-miembro" data-id="${m.id}" ${checked} ${disabled}>
                                </div>
                                <div class="col-nombre">${m.nombre}</div>
                                <div class="col-dni">${m.dni}</div>
                            </div>
                        `;
                     }).join("")}
                </div>

               <div class="asistencia-footer">
                  <label class="entrenador-check ${entrenadorAsistioPrevio ? "asistio-previo" : ""}">
                    <input 
                      type="checkbox" 
                      id="entrenadorAsistio" 
                      ${entrenadorAsistioPrevio ? "checked disabled" : ""}
                    >
                    Entrenador asistió
                  </label>
                </div>
            </div>
        `;

        // ====== Modal principal ======
        Swal.fire({
            title: "Tomar asistencia",
            html: html,
            background: "#f9fafb",
            color: "#333",
            width: 700,
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#1976d2",
            cancelButtonColor: "#9e9e9e",
            preConfirm: async () => {
                const checks = document.querySelectorAll(".check-miembro");
                const entrenadorCheck = document.getElementById("entrenadorAsistio");

                // Recolectar asistencias
                const asistencias = Array.from(checks).map(chk => ({
                    miembroId: chk.dataset.id,
                    asistio: chk.checked
                }));

                // 🔹 Confirmación adicional antes de enviar
                return new Promise((resolve) => {
                    showConfirm(
                        "¿Deseás guardar la asistencia con los datos seleccionados? Se sobrescribirán los registros previos.",
                        async () => {
                            try {
                                // Guardar asistencias de miembros
                                for (const a of asistencias) {
                                    await ClassAPI.registrarAsistenciaMiembro(
                                        claseId,
                                        a.miembroId,
                                        a.asistio
                                    );
                                }

                                // Guardar asistencia del entrenador
                                if (clase.entrenadorId) {
                                    await ClassAPI.registrarAsistenciaEntrenador(
                                        claseId,
                                        clase.entrenadorId,
                                        entrenadorCheck.checked
                                    );
                                }

                                // Registrar inasistencias faltantes
                                await ClassAPI.registrarInasistenciasPendientes(claseId);

                                showSuccess("✅ Asistencia registrada y actualizada correctamente.");
                                resolve(true);
                            } catch (err) {
                                console.error(err);
                                showError("Error al guardar la asistencia: " + err.message);
                                resolve(false);
                            }
                        },
                        "Confirmar registro"
                    );
                });
            }
        }).then(result => {
            if (result.isConfirmed) {
                showSuccess("Asistencia registrada correctamente.");
            }
        });
    } catch (err) {
        console.error(err);
        showError("No se pudo registrar la asistencia: " + err.message);
    }
}


// ---------- Setup básico ----------
function setupModals() {
    const closeMiembrosModalBtn = document.querySelector(".closeMiembrosModal");
    const miembrosModal = document.getElementById("miembrosModal");

    if (miembrosModal && closeMiembrosModalBtn) {
        closeMiembrosModalBtn.addEventListener("click", () => {
            miembrosModal.classList.add("hidden");
        });
    }

    window.addEventListener("click", (e) => {
        if (e.target === miembrosModal) miembrosModal.classList.add("hidden");
    });
}

// ---------- Botón de impresión ----------
const printBtn = document.getElementById("btnPrint");
if (printBtn) {
    printBtn.addEventListener("click", () => {
        window.print();
    });
}
