// trainerConsult.js
import { TrainerAPI } from "../../api/trainers.js";

document.addEventListener("DOMContentLoaded", () => {
    const btnSearch = document.getElementById("btnSearchTrainer");
    const inputDni = document.getElementById("trainerDni");
    const trainerDataDiv = document.getElementById("trainerData");

    let currentTrainer = null;

    // ======== FUNCIÓN AUXILIAR: FECHAS ========
    function formatDate(dateString) {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return isNaN(date) ? "-" : date.toLocaleDateString("es-AR");
    }

    // ======== MODAL SWEETALERT: EDITAR ENTRENADOR ========
    async function showEditTrainerModal(trainer) {
        return Swal.fire({
            title: "✏️ Editar Entrenador",
            html: `
            <div style="
                display:flex;
                flex-direction:column;
                gap:16px;
                padding:10px;
            ">
                <div>
                   <label style="display:flex;font-weight:600;margin-bottom:6px;color:#374151;font-size:0.95rem; text-align: center;">Nombre</label>
                    <input id="swal-trainer-nombre" class="swal2-input" 
                           value="${trainer.nombre || ""}" 
                           placeholder="Nombre del entrenador"
                           style="width:100%;">
                </div>

                <div>
                    <label style="display:flex;font-weight:600;margin-bottom:6px;color:#374151;font-size:0.95rem; text-align: center;">Dirección</label>
                    <input id="swal-trainer-direccion" class="swal2-input" 
                           value="${trainer.direccion || ""}" 
                           placeholder="Dirección"
                           style="width:100%;">
                </div>

                <div>
                    <label style="display:flex;font-weight:600;margin-bottom:6px;color:#374151;font-size:0.95rem; text-align: center;">Teléfono</label>
                    <input id="swal-trainer-telefono" class="swal2-input" 
                           type="number" 
                           value="${trainer.telefono || ""}" 
                           placeholder="Teléfono"
                           style="width:100%;">
                </div>
            </div>
            `,
            confirmButtonText: "💾 Guardar cambios",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            confirmButtonColor: "#1976d2",
            cancelButtonColor: "#9e9e9e",
            background: "#ffffff",
            color: "#333",
            width: "375px",
            customClass: {
                popup: "shadow-xl rounded-2xl",
                title: "text-lg font-semibold text-gray-800",
                confirmButton: "text-white font-medium py-2 px-4 rounded-lg",
                cancelButton: "font-medium py-2 px-4 rounded-lg"
            },
            preConfirm: () => {
                const nombre = document.getElementById("swal-trainer-nombre").value.trim();
                const direccion = document.getElementById("swal-trainer-direccion").value.trim();
                const telefono = document.getElementById("swal-trainer-telefono").value.trim();

                if (!nombre || !direccion || !telefono) {
                    Swal.showValidationMessage("⚠️ Complete todos los campos antes de guardar");
                    return false;
                }

                return { nombre, direccion, telefono: parseInt(telefono) };
            }
        });
    }

    // ======== BUSCAR ENTRENADOR ========
    btnSearch.addEventListener("click", async () => {
        const dni = inputDni.value.trim();
        if (!dni) {
            showAlert("Ingrese un DNI válido", "warning");
            return;
        }

        try {
            const trainer = await TrainerAPI.getByDni(dni);
            if (!trainer) throw new Error("Entrenador no encontrado");
            displayTrainer(trainer);
        } catch (error) {
            console.error(error);
            showAlert(`No se encontró el entrenador con DNI ${dni}`, "warning", "Entrenador no encontrado");
            trainerDataDiv.innerHTML = "";
            trainerDataDiv.classList.add("hidden");
        }
    });

    // ======== MOSTRAR DATOS DEL ENTRENADOR ========
    async function displayTrainer(trainer) {
        currentTrainer = trainer;
        const container = trainerDataDiv;
        container.classList.remove("hidden");

        // --- Datos personales ---
        let html = `
        <h3>Información de ${trainer.nombre || "-"}</h3>
        <section class="trainer-section personal-info">
            <div class="trainer-section-header">
                <h4>🧑 Datos Personales</h4>
                <button id="btnEditTrainer" class="btn-edit">✏️ Editar</button>
            </div>
            <p><strong>ID:</strong> ${trainer.id || "-"}</p>
            <p><strong>Nombre:</strong> ${trainer.nombre || "-"}</p>
            <p><strong>DNI:</strong> ${trainer.dni || "-"}</p>
            <p><strong>Dirección:</strong> ${trainer.direccion || "-"}</p>
            <p><strong>Teléfono:</strong> ${trainer.telefono || "-"}</p>
            <p><strong>Fecha de Nacimiento:</strong> ${formatDate(trainer.fechaNacimiento)}</p>
        </section>
        `;

        // --- Datos del certificado ---
        html += `
        <section class="trainer-section certificate-info">
            <h4>📄 Certificado</h4>
            <p><strong>Código:</strong> ${trainer.codigoCertificado || "No asignado"}</p>
            <p><strong>Vigencia:</strong> ${trainer.vigencia ? "Vigente" : "No vigente"}</p>
            <p><strong>Fecha de Emisión:</strong> ${formatDate(trainer.fechaEmision)}</p>
            <p><strong>Fecha de Vencimiento:</strong> ${formatDate(trainer.fechaVencimiento)}</p>
        </section>
        `;

        // --- Clases del entrenador ---
        html += `
        <section class="trainer-section classes-info">
            <h4>🏋️ Clases del Entrenador</h4>
        `;

        if (Array.isArray(trainer.clases) && trainer.clases.length > 0) {
            html += `
                <div class="table-wrapper">
                    <table id="trainerClassesTable">
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
                    hour12: false, day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                });
                const horaFin = new Date(clase.horaFin).toLocaleString('es-AR', {
                    hour12: false, day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
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

            html += `
                        </tbody>
                    </table>
                </div>
            `;
        } else {
            html += `<p>No tiene clases asignadas</p>`;
        }

        html += `</section>`;

        // --- Miembros asignados ---
        try {
            const miembros = await TrainerAPI.getMiembrosAsignados(trainer.id);

            html += `
            <section class="trainer-section members-info">
                <h4>👥 Miembros Asignados</h4>
            `;

            if (Array.isArray(miembros) && miembros.length > 0) {
                html += `
                <div class="table-wrapper">
                    <table id="trainerMembersTable">
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

                html += `
                        </tbody>
                    </table>
                </div>
                `;
            } else {
                html += `<p>No tiene miembros asignados</p>`;
            }

            html += `</section>`;
        } catch (error) {
            console.error(error);
            html += `<p style="color:red;">❌ Error al obtener miembros asignados: ${error.message}</p>`;
        }

        container.innerHTML = html;

        // === Evento de edición ===
        const btnEdit = document.getElementById("btnEditTrainer");
        btnEdit.addEventListener("click", async () => {
            const result = await showEditTrainerModal(currentTrainer);

            if (result.isConfirmed) {
                const updatedData = result.value;

                try {
                    await TrainerAPI.update(currentTrainer.id, updatedData);
                    currentTrainer = { ...currentTrainer, ...updatedData };
                    showSuccess("Entrenador actualizado correctamente ✅");
                    displayTrainer(currentTrainer);
                } catch (err) {
                    console.error(err);
                    showError("Error al actualizar el entrenador");
                }
            }
        });
    }
});
