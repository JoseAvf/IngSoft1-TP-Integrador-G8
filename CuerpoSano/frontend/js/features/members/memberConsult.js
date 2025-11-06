import { MembersAPI } from "../../api/members.js";
import { TrainerAPI } from "../../api/trainers.js";

document.addEventListener("DOMContentLoaded", () => {
    const btnSearch = document.getElementById("btnSearch");
    const inputDni = document.getElementById("memberDni");
    const memberDataDiv = document.getElementById("memberData");

    const modal = document.getElementById("editMemberModal");
    const form = document.getElementById("editMemberForm");
    const inputNombre = document.getElementById("editNombre");
    const inputDireccion = document.getElementById("editDireccion");
    const inputTelefono = document.getElementById("editTelefono");
    const inputCorreo = document.getElementById("editCorreo");
    const btnCancel = document.getElementById("btnCancelMemberEdit");

    let currentMember = null;

    btnSearch.addEventListener("click", async () => {
        const dni = inputDni.value.trim();
        if (!dni) {
            showAlert("Ingrese un DNI válido", "warning");
            return;
        }

        try {
            const member = await MembersAPI.getByDni(dni);

            // Si la API devuelve null, undefined o vacío
            if (!member) {
                showError(`No se encontró ningún miembro con DNI ${dni}`);
                memberDataDiv.classList.add("hidden");
                return;
            }

            displayMember(member);
        } catch (error) {
            console.error(error);

            // Detectamos si fue un 404 explícito
            if (error.message?.includes("404")) {
                showError(`No se encontró ningún miembro con DNI ${dni}`);
            } else {
                showError("Error al buscar el miembro. Intente nuevamente.");
            }

            memberDataDiv.classList.add("hidden");
        }
    });

    function formatDate(dateString) {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return isNaN(date) ? "-" : date.toLocaleDateString("es-AR");
    }

    async function displayMember(member) {

        currentMember = member;
        const container = document.getElementById("memberData");
        container.classList.remove("hidden");

        // Obtenemos el entrenador (si existe)
        let assignedTrainer = null;
        if (member.entrenadorId) {
            try {
                assignedTrainer = await TrainerAPI.getById(member.entrenadorId);
            } catch {
                console.error("Error al cargar entrenador asignado");
            }
        }

        // Render principal
        container.innerHTML = `
        <h3>Información de ${member.nombre || "-"}</h3>

        <!-- Datos personales -->
        <section class="member-section personal-info">
            <div class="member-section-header">
                <h4>🧑 Datos Personales</h4>
                <button id="btnEditMember" class="btn-edit">✏️ Editar</button>
            </div>
            <p><strong>ID:</strong> ${member.id || "-"}</p>
            <p><strong>DNI:</strong> ${member.dni || "-"}</p>
            <p><strong>Dirección:</strong> ${member.direccion || "-"}</p>
            <p><strong>Teléfono:</strong> ${member.telefono || "-"}</p>
            <p><strong>Correo:</strong> ${member.correo || "-"}</p>
            <p><strong>Fecha de Nacimiento:</strong> ${formatDate(member.fechaNacimiento)}</p>
        </section>

        <!-- Datos del carnet -->
        <section class="member-section carnet-info">
            <h4>🎫 Carnet</h4>
            <p><strong>Código:</strong> ${member.codigoCarnet || "No asignado"}</p>
            <p><strong>Fecha de Emisión:</strong> ${formatDate(member.fechaEmisionCarnet)}</p>
        </section>

        <!-- Datos de la membresía -->
        <section class="member-section membership-info">
            <h4>💳 Membresía</h4>
            <p><strong>Tipo:</strong> ${member.tipoMembresia || "No asignada"}</p>
            <p><strong>Fecha de Emisión:</strong> ${formatDate(member.fechaEmisionMembresia)}</p>
            <p><strong>Fecha de Vencimiento:</strong> ${formatDate(member.fechaVencimientoMembresia)}</p>
            <p><strong>Costo:</strong> ${member.costoMembresia != null ? `$${member.costoMembresia}` : "-"}</p>
            <p><strong>Estado:</strong> ${member.tipoMembresia ? (member.estaPausada ? "Pausada" : "Activa") : "-"}</p>
        </section>

        <!-- Entrenador asignado -->
        <section class="member-section trainer-info" id="assignedTrainerSection">
            <div class="member-section-header">
                <h4>🏋️ Entrenador Asignado</h4>
                <button id="btnAddTrainer" class="btn-edit">➕ Agregar Entrenador</button>
            </div>
            ${assignedTrainer
                ? `
                        <p><strong>Nombre:</strong> ${assignedTrainer.nombre}</p>
                        <p><strong>DNI:</strong> ${assignedTrainer.dni}</p>
                        <p><strong>Teléfono:</strong> ${assignedTrainer.telefono || "-"}</p>
                    `
                : `<p>No hay entrenador asignado</p>`
            }
        </section>
        `;

        // Editar miembro con SweetAlert
        document.getElementById("btnEditMember").addEventListener("click", async () => {
            const result = await showEditMemberModal(member);

            if (result.isConfirmed) {
                const updatedData = result.value;

                try {
                    await MembersAPI.update(member.id, updatedData);
                    showSuccess("Miembro actualizado correctamente ✅");

                    // refrescamos la vista
                    const updatedMember = { ...member, ...updatedData };
                    displayMember(updatedMember);
                } catch (err) {
                    console.error(err);
                    showError("Error al actualizar el miembro");
                }
            }
        });

        // Agregar entrenador
        document.getElementById("btnAddTrainer").addEventListener("click", async () => {
            try {
                const trainers = await TrainerAPI.getAll();
                const { value: selectedTrainerId } = await Swal.fire({
                    title: "Asignar Entrenador",
                    html: `
                        <div style="text-align:left;max-height:300px;overflow-y:auto;">
                            <label><input type="radio" name="trainerRadio" value="" ${!currentMember.entrenadorId ? "checked" : ""}> ❌ Ninguno (desasignar)</label><br>
                            ${trainers.map(tr => `
                                <label style="display:block;margin:4px 0;">
                                    <input type="radio" name="trainerRadio" value="${tr.id}" ${currentMember.entrenadorId === tr.id ? "checked" : ""}>
                                    ${tr.nombre} (${tr.dni})
                                </label>
                            `).join("")}
                        </div>
                    `,
                    showCancelButton: true,
                    confirmButtonText: "Guardar",
                    cancelButtonText: "Cancelar",
                    preConfirm: () => {
                        const checked = document.querySelector('input[name="trainerRadio"]:checked');
                        return checked ? checked.value || null : null;
                    },
                    background: "#f9fafb",
                    confirmButtonColor: "#1976d2",
                    cancelButtonColor: "#9e9e9e",
                });

                if (selectedTrainerId === undefined) return;

                await MembersAPI.assignTrainer(currentMember.dni, selectedTrainerId || null);

                if (selectedTrainerId) {
                    const assignedTrainer = await TrainerAPI.getById(selectedTrainerId);
                    document.getElementById("assignedTrainerSection").innerHTML = `
                        <div class="member-section-header">
                            <h4>🏋️ Entrenador Asignado</h4>
                            <button id="btnAddTrainer" class="btn-edit">➕ Agregar Entrenador</button>
                        </div>
                        <p><strong>Nombre:</strong> ${assignedTrainer.nombre}</p>
                        <p><strong>DNI:</strong> ${assignedTrainer.dni}</p>
                        <p><strong>Teléfono:</strong> ${assignedTrainer.telefono || "-"}</p>
                    `;
                    showSuccess("Entrenador asignado ✅");
                } else {
                    document.getElementById("assignedTrainerSection").innerHTML = `
                        <div class="member-section-header">
                            <h4>🏋️ Entrenador Asignado</h4>
                            <button id="btnAddTrainer" class="btn-edit">➕ Agregar Entrenador</button>
                        </div>
                        <p>No hay entrenador asignado</p>
                    `;
                    showSuccess("Entrenador desasignado ✅");
                }

                // refrescamos el miembro
                currentMember.entrenadorId = selectedTrainerId ? parseInt(selectedTrainerId) : null;
                displayMember(currentMember);
            } catch (err) {
                console.error(err);
                showError("Error al asignar entrenador");
            }
        });
    }

    // ====== MODAL: EDITAR MIEMBRO ======
    async function showEditMemberModal(member) {
        return Swal.fire({
            title: "✏️ Editar Miembro",
            html: `
        <div style="
            display: flex; 
            flex-direction: column; 
            gap: 18px;
                margin-top: 8px;
                padding: 10px 5px;
        ">
            <div>
                <label style="display:flex;font-weight:600;margin-bottom:6px;color:#374151;font-size:0.95rem; text-align: center;">Nombre</label>
                <input id="swal-nombre" class="swal2-input" value="${member.nombre || ""}" placeholder="Nombre del miembro" style="width:100%;">
            </div>

            <div>
                <label style="display:flex;font-weight:600;margin-bottom:6px;color:#374151;font-size:0.95rem; text-align: center;">Dirección</label>
                <input id="swal-direccion" class="swal2-input" value="${member.direccion || ""}" placeholder="Dirección" style="width:100%;">
            </div>

            <div>
                <label style="display:flex;font-weight:600;margin-bottom:6px;color:#374151;font-size:0.95rem; text-align: center;">Teléfono</label>
                <input id="swal-telefono" class="swal2-input" value="${member.telefono || ""}" type="number" placeholder="Teléfono" style="width:100%;">
            </div>

            <div>
               <label style="display:flex;font-weight:600;margin-bottom:6px;color:#374151;font-size:0.95rem; text-align: center;">Correo</label>
                <input id="swal-correo" class="swal2-input" value="${member.correo || ""}" type="email" placeholder="Correo electrónico" style="width:100%;">
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
                const nombre = document.getElementById("swal-nombre").value.trim();
                const direccion = document.getElementById("swal-direccion").value.trim();
                const telefono = document.getElementById("swal-telefono").value.trim();
                const correo = document.getElementById("swal-correo").value.trim();

                if (!nombre || !direccion || !telefono || !correo) {
                    Swal.showValidationMessage("⚠️ Complete todos los campos antes de guardar");
                    return false;
                }

                return { nombre, direccion, telefono: parseInt(telefono), correo };
            }
        });
    }

});
