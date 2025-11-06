import { ClassAPI } from "../../api/classes.js";
import { MembersAPI } from "../../api/members.js";

document.addEventListener("DOMContentLoaded", () => {
    const btnSearch = document.getElementById("btnSearch");
    const inputId = document.getElementById("classId");
    const classDataDiv = document.getElementById("classData");

    let currentClass = null;

    function formatDateTime(dateString) {
        if (!dateString) return "-";
        const date = new Date(dateString);
        if (isNaN(date)) return "-";
        return date.toLocaleString("es-AR", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit"
        });
    }

    // Buscar clase
    btnSearch.addEventListener("click", async () => {
        const id = parseInt(inputId.value.trim());
        if (!id || isNaN(id)) {
            showAlert("Ingrese un ID válido.", "warning", "Dato inválido");
            return;
        }

        try {
            const clase = await ClassAPI.getById(id);
            displayClass(clase);
        } catch (error) {
            console.error(error);
            classDataDiv.innerHTML = `<p style="color:red;">No se encontró la clase con ID ${id}</p>`;
            classDataDiv.classList.remove("hidden");
        }
    });

    // Mostrar clase
    function displayClass(clase) {
        currentClass = clase;
        classDataDiv.classList.remove("hidden");

        classDataDiv.innerHTML = `
            <h3>Información de la Clase: ${clase.nombre || "-"}</h3>

            <section class="class-section class-info">
                <div class="class-section-header">
                    <h4>📋 Detalles de la Clase</h4>
                    <button id="btnEditClass" class="btn-edit">✏️ Editar</button>
                </div>
                <p><strong>ID:</strong> ${clase.id}</p>
                <p><strong>Nombre:</strong> ${clase.nombre || "-"}</p>
                <p><strong>Hora Inicio:</strong> ${formatDateTime(clase.horaInicio)}</p>
                <p><strong>Hora Fin:</strong> ${formatDateTime(clase.horaFin)}</p>
                <p><strong>Cupo:</strong> ${clase.cupo}</p>
                <p><strong>Fecha Creación:</strong> ${formatDateTime(clase.fechaCreacion)}</p>
            </section>

            <section class="class-section activity-info">
                <h4>🏃 Actividad</h4>
                <p><strong>ID:</strong> ${clase.actividadId}</p>
                <p><strong>Nombre:</strong> ${clase.actividadNombre || "-"}</p>
            </section>

            <section class="class-section trainer-info">
                <h4>🏋️ Entrenador</h4>
                <p><strong>ID:</strong> ${clase.entrenadorId || "-"}</p>
                <p><strong>Nombre:</strong> ${clase.entrenadorNombre || "No asignado"}</p>
            </section>

            <section class="class-section inscritos-info">
                <div class="class-section-header">
                    <h4>👥 Inscriptos</h4>
                    <button id="btnEnrollMember" class="btn-edit">➕ Inscribir Miembro</button>
                </div>
                <p><strong>Total inscritos:</strong> ${clase.inscriptosCount}</p>
            </section>
        `;

        // === Botón editar clase ===
        document.getElementById("btnEditClass").addEventListener("click", () => {
            showEditClassModal(clase);
        });

        // === Botón inscribir miembro ===
        document.getElementById("btnEnrollMember").addEventListener("click", () => {
            showEnrollModal();
        });
    }

    // ====== MODAL: EDITAR CLASE ======
    function showEditClassModal(clase) {
        const inicio = new Date(clase.horaInicio);
        const fin = new Date(clase.horaFin);

        Swal.fire({
            title: "✏️ Editar Clase",
            html: `
            <div style="
                display: flex !important;
                flex-direction: column; 
                gap: 18px; 
                margin-top: 8px;
                padding: 10px 5px;
                
            ">
                <div>
                    <label style="display:flex;font-weight:600;margin-bottom:6px;color:#374151;font-size:0.95rem; text-align: center;">Nombre de la clase</label>
                    <input id="swal-nombre" class="swal2-input" 
                           placeholder="Ej: Funcional Avanzado" 
                           value="${clase.nombre || ""}" 
                           style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:0.95rem;">
                </div>

                <div>
                    <label style="display:flex;font-weight:600;margin-bottom:6px;color:#374151;font-size:0.95rem;">Fecha</label>
                    <input id="swal-fecha" type="date" class="swal2-input" 
                           value="${inicio.toISOString().split("T")[0]}"
                           style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:0.95rem;">
                </div>

                <div style="display:flex;gap:16px;">
                    <div style="flex:1;">
                        <label style="display:flex;font-weight:600;margin-bottom:6px;color:#374151;font-size:0.95rem;">Hora inicio</label>
                        <input id="swal-horaInicio" type="time" class="swal2-input"
                               value="${inicio.toTimeString().slice(0, 5)}"
                               style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:0.95rem;">
                    </div>
                    <div style="flex:1;">
                        <label style="display:flex;font-weight:600;margin-bottom:6px;color:#374151;font-size:0.95rem;">Hora fin</label>
                        <input id="swal-horaFin" type="time" class="swal2-input"
                               value="${fin.toTimeString().slice(0, 5)}"
                               style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:0.95rem;">
                    </div>
                </div>

                <div>
                    <label style="display:flex;font-weight:600;margin-bottom:6px;color:#374151;font-size:0.95rem;">Cupo máximo</label>
                    <input id="swal-cupo" type="number" class="swal2-input" min="1" 
                           value="${clase.cupo || 1}"
                           style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:0.95rem;">
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
            width: "375px", // 🟦 Más ancho, mejora la proporción visual
            customClass: {
                popup: "shadow-xl rounded-2xl",
                title: "text-lg font-semibold text-gray-800",
                confirmButton: "text-white font-medium py-2 px-4 rounded-lg",
                cancelButton: "font-medium py-2 px-4 rounded-lg"
            },
            focusConfirm: false,
            preConfirm: () => {
                const nombre = document.getElementById("swal-nombre").value.trim();
                const fecha = document.getElementById("swal-fecha").value;
                const horaInicio = document.getElementById("swal-horaInicio").value;
                const horaFin = document.getElementById("swal-horaFin").value;
                const cupo = parseInt(document.getElementById("swal-cupo").value);

                if (!nombre || !fecha || !horaInicio || !horaFin || !cupo) {
                    Swal.showValidationMessage("⚠️ Complete todos los campos antes de guardar");
                    return false;
                }

                return { nombre, fecha, horaInicio, horaFin, cupo };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { nombre, fecha, horaInicio, horaFin, cupo } = result.value;

                const horaInicioISO = new Date(`${fecha}T${horaInicio}:00`).toISOString();
                const horaFinISO = new Date(`${fecha}T${horaFin}:00`).toISOString();

                const updatedData = {
                    nombre,
                    horaInicio: horaInicioISO,
                    horaFin: horaFinISO,
                    cupo
                };

                try {
                    await ClassAPI.update(clase.id, updatedData);
                    currentClass = { ...clase, ...updatedData };
                    displayClass(currentClass);
                    showSuccess("Clase actualizada correctamente ✅");
                } catch (err) {
                    console.error(err);
                    showError("Error al actualizar la clase.");
                }
            }
        });
    }

    // ====== MODAL: INSCRIBIR MIEMBRO ======
    async function showEnrollModal() {
        try {
            const members = await MembersAPI.getAll();
            if (!members.length) {
                showAlert("No hay miembros disponibles para inscribir.", "info");
                return;
            }

            const optionsHTML = members
                .map(m => `<option value="${m.id}">${m.nombre} (${m.dni})</option>`)
                .join("");

            Swal.fire({
                title: "➕ Inscribir Miembro",
                html: `
                    <select id="swal-member" class="swal2-select">
                        ${optionsHTML}
                    </select>
                `,
                confirmButtonText: "Inscribir",
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#2e7d32",
                cancelButtonColor: "#9e9e9e",
                background: "#f9fafb",
                color: "#333",
                preConfirm: () => {
                    const memberId = parseInt(document.getElementById("swal-member").value);
                    if (!memberId) {
                        Swal.showValidationMessage("Seleccione un miembro válido");
                        return false;
                    }
                    return memberId;
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const memberId = result.value;
                    try {
                        await ClassAPI.inscribirMiembro(currentClass.id, memberId);
                        currentClass.inscriptosCount = (currentClass.inscriptosCount || 0) + 1;
                        displayClass(currentClass);
                        showSuccess("Miembro inscripto correctamente ✅");
                    } catch (err) {
                        console.error(err);
                        showError("Error al inscribir miembro.");
                    }
                }
            });
        } catch (err) {
            console.error(err);
            showError("Error al cargar miembros.");
        }
    }
});
