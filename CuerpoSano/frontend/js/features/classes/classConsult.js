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

    function toLocalISOString(fecha, hora) {
        // Devuelve una ISO sin convertir a UTC (hora local exacta)
        return `${fecha}T${hora}:00`;
    }

    function redondearHora30Minutos(date) {
        const ms = 1000 * 60 * 30; // 30 minutos en milisegundos
        return new Date(Math.round(date.getTime() / ms) * ms);
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
            if (!clase) return showAlert("Clase no encontrada. Ingrese un ID correcto.", "warning", "Clase no encontrada");
            displayClass(clase);
        } catch (error) {
            console.error(error);
            showError("No se pudo obtener la clase: " + error.message);
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
                    <div style="display:flex;gap:8px;">
                    <button id="btnEnrollMember" class="btn-edit">➕ Inscribir Miembro</button>
                    <button id="btnUnenrollMember" class="btn-delete">➖ Desinscribir Miembro</button>
                    </div>
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
            if (currentClass.inscriptosCount >= currentClass.cupo) {
                showAlert("⚠️ El cupo de esta clase ya está completo.", "warning", "Clase llena");
                return;
            }
            showEnrollModal();
        });

        // === Botón desinscribir miembro ===
        document.getElementById("btnUnenrollMember").addEventListener("click", async () => {
            try {
                // 1️⃣ Obtener miembros inscriptos
                const inscriptos = await ClassAPI.getMiembros(currentClass.id);

                // 2️⃣ Si no hay inscriptos, mostrar aviso
                if (!inscriptos.length) {
                    showAlert("No hay miembros inscriptos en esta clase.", "info", "Sin inscriptos");
                    return;
                }

                // 3️⃣ Construir lista visual igual que el modal de inscripción
                const optionsHTML = inscriptos.map(m => `
            <div class="miembro-opcion" data-id="${m.id}" 
                 style="display:flex;justify-content:space-between;
                        align-items:center;padding:10px 14px;
                        border:1px solid #ddd;border-radius:6px;
                        margin-bottom:6px;cursor:pointer;
                        background:#fff;transition:0.2s;">
                <span style="font-weight:600;color:#333;">${m.nombre}</span>
                <span style="color:#666;">DNI: ${m.dni}</span>
            </div>
        `).join("");

                // 4️⃣ Mostrar modal
                Swal.fire({
                    title: "➖ Desinscribir Miembro",
                    html: `
                <div id="listaDesinscribir" style="max-height:300px;overflow-y:auto;">
                    ${optionsHTML}
                </div>
            `,
                    showCancelButton: true,
                    showConfirmButton: false,
                    cancelButtonText: "Cancelar",
                    background: "#f9fafb",
                    color: "#333",
                    width: "400px",
                    didOpen: () => {
                        document.querySelectorAll(".miembro-opcion").forEach(div => {
                            div.addEventListener("click", async () => {
                                const memberId = parseInt(div.dataset.id);

                                // Confirmación antes de eliminar
                                const confirm = await Swal.fire({
                                    title: "¿Desinscribir miembro?",
                                    text: "Esta acción eliminará la inscripción del miembro en esta clase.",
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonText: "Sí, desinscribir",
                                    cancelButtonText: "Cancelar",
                                    confirmButtonColor: "#e53935",
                                    cancelButtonColor: "#9e9e9e",
                                });

                                if (confirm.isConfirmed) {
                                    try {
                                        await ClassAPI.desinscribirMiembro(currentClass.id, memberId);
                                        currentClass.inscriptosCount--;
                                        displayClass(currentClass);
                                        Swal.close();
                                        showSuccess("Miembro desinscripto correctamente ✅");
                                    } catch (err) {
                                        console.error(err);
                                        showError("Error al desinscribir miembro.");
                                    }
                                }
                            });
                            div.addEventListener("mouseenter", () => div.style.background = "#ff6666");
                            div.addEventListener("mouseleave", () => div.style.background = "#fff");
                        });
                    }
                });
            } catch (err) {
                console.error(err);
                showError("Error al obtener miembros inscriptos.");
            }
        });


    }

    // ====== MODAL: EDITAR CLASE ======
    // ====== MODAL: EDITAR CLASE ======
    function showEditClassModal(clase) {
        const inicio = new Date(clase.horaInicio);
        const fin = new Date(clase.horaFin);
        const hoy = new Date().toISOString().split("T")[0];
        const inicioRedondeado = redondearHora30Minutos(inicio);
        const finRedondeado = redondearHora30Minutos(fin);



        Swal.fire({
            title: "✏️ Editar Clase",
            html: `
        <div style="display:flex !important;flex-direction:column;gap:18px;margin-top:8px;padding:10px 5px;">
            
            <div>
                <label style="font-weight:600;margin-bottom:6px;color:#374151;font-size:0.95rem;">Nombre de la clase</label>
                <input id="swal-nombre" class="swal2-input" 
                       placeholder="Ej: Funcional Avanzado" 
                       value="${clase.nombre || ""}" 
                       pattern="[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\\s]+"
                       title="Solo letras y números"
                       style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:0.95rem;">
            </div>

            <div>
                <label style="font-weight:600;margin-bottom:6px;color:#374151;font-size:0.95rem;">Fecha</label>
                <input id="swal-fecha" type="date" class="swal2-input" 
                       min="${hoy}"
                       value="${inicio.toISOString().split("T")[0]}"
                       style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:0.95rem;">
            </div>

            <div style="display:flex;gap:16px;">
                <div style="flex:1;">
                    <label style="font-weight:600;margin-bottom:6px;color:#374151;font-size:0.95rem;">Hora inicio</label>
                    <input id="swal-horaInicio" type="time" class="swal2-input"
                           min="07:00" max="21:00"
                           step="1800"
                           value="${inicioRedondeado.toTimeString().slice(0, 5)}"
                           style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:0.95rem;">
                </div>
                <div style="flex:1;">
                    <label style="font-weight:600;margin-bottom:6px;color:#374151;font-size:0.95rem;">Hora fin</label>
                    <input id="swal-horaFin" type="time" class="swal2-input"
                           min="07:00" max="21:00"
                           step="1800"
                           value="${finRedondeado.toTimeString().slice(0, 5)}"
                           style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:0.95rem;">
                </div>
            </div>

            <div>
                <label style="font-weight:600;margin-bottom:6px;color:#374151;font-size:0.95rem;">Cupo máximo</label>
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
            width: "375px",
            focusConfirm: false,

            didOpen: () => {
                // 🧠 Validaciones dinámicas al abrir
                const nombreInput = document.getElementById("swal-nombre");
                const horaInicioInput = document.getElementById("swal-horaInicio");
                const horaFinInput = document.getElementById("swal-horaFin");

                // Solo letras y números
                nombreInput.addEventListener("input", () => {
                    nombreInput.value = nombreInput.value.replace(/[^A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s]/g, "");
                });

                // Sin horas fuera del rango
                [horaInicioInput, horaFinInput].forEach(input => {
                    input.addEventListener("input", () => {
                        if (input.value < "07:00") input.value = "07:00";
                        if (input.value > "21:00") input.value = "21:00";
                    });
                });

                // Hora fin mínima = 1h después de inicio
                horaInicioInput.addEventListener("change", () => {
                    const [h, m] = horaInicioInput.value.split(":").map(Number);
                    const minFin = new Date();
                    minFin.setHours(h + 1, m, 0, 0);
                    horaFinInput.min = minFin.toTimeString().slice(0, 5);

                    if (horaFinInput.value < horaFinInput.min) {
                        horaFinInput.value = horaFinInput.min;
                    }
                });
            },

            preConfirm: () => {
                const nombre = document.getElementById("swal-nombre").value.trim();
                const fecha = document.getElementById("swal-fecha").value;
                const horaInicio = document.getElementById("swal-horaInicio").value;
                const horaFin = document.getElementById("swal-horaFin").value;
                const cupo = parseInt(document.getElementById("swal-cupo").value);

                const hoyISO = new Date().toISOString().split("T")[0];
                const [h1, m1] = horaInicio.split(":").map(Number);
                const [h2, m2] = horaFin.split(":").map(Number);
                const diffHoras = (h2 + m2 / 60) - (h1 + m1 / 60);

                // === Validaciones ===
                if (!nombre || !fecha || !horaInicio || !horaFin || !cupo) {
                    Swal.showValidationMessage("⚠️ Complete todos los campos antes de guardar");
                    return false;
                }
                if (!/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre) || nombre.trim().length === 0) {
                    Swal.showValidationMessage("⚠️ El nombre solo puede contener letras, números y espacios (no puede estar vacío)");
                    return false;
                }
                if (fecha < hoyISO) {
                    Swal.showValidationMessage("⚠️ La fecha no puede ser anterior a hoy");
                    return false;
                }
                if (horaInicio < "07:00" || horaFin > "21:00") {
                    Swal.showValidationMessage("⚠️ Los horarios deben estar entre 07:00 y 21:00");
                    return false;
                }

                // 🚫 NUEVO: Validar múltiplos de 30 minutos
                if (![0, 30].includes(m1) || ![0, 30].includes(m2)) {
                    Swal.showValidationMessage("⚠️ Las horas deben estar en intervalos de 30 minutos (por ejemplo, 07:00, 07:30, 08:00)");
                    return false;
                }

                
                if (diffHoras < 1) {
                    Swal.showValidationMessage("⚠️ La clase debe durar al menos 1 hora");
                    return false;
                }

                // 🚫 Validar que el cupo no sea menor a los inscriptos actuales
                if (cupo < clase.inscriptosCount) {
                    Swal.showValidationMessage(
                        `⚠️ El cupo no puede ser menor a la cantidad de inscriptos actuales (${clase.inscriptosCount})`
                    );
                    return false;
                }

                return { nombre, fecha, horaInicio, horaFin, cupo };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { nombre, fecha, horaInicio, horaFin, cupo } = result.value;

                const horaInicioISO = toLocalISOString(fecha, horaInicio);
                const horaFinISO = toLocalISOString(fecha, horaFin);

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
            // 🔹 1. Obtener todos los miembros
            const allMembers = await MembersAPI.getAll();
            if (allMembers.length === 0) return showAlert("No hay miembros registrados. Registre uno primero.", "warning", "Sin miembros");

            // 🔹 2. Obtener los miembros ya inscriptos en la clase actual
            const inscriptos = await ClassAPI.getMiembros(currentClass.id);

            // 🔹 3. Crear un conjunto con los IDs inscriptos (para búsqueda rápida)
            const inscriptosIds = new Set(inscriptos.map(m => m.id));

            const hoy = new Date();

            // 🔹 3. Filtrar miembros disponibles
            const disponibles = allMembers.filter(m => {
                // Solo los que NO están inscriptos
                if (inscriptosIds.has(m.id)) return false;

                // Debe tener membresía activa
                const vencimiento = m.fechaVencimientoMembresia ? new Date(m.fechaVencimientoMembresia) : null;
                const estaActiva = !m.estaPausada && vencimiento && vencimiento >= hoy;

                return estaActiva;
            });

            // 🔹 4. Si no hay disponibles, avisar
            if (!disponibles.length) {
                showAlert("No hay miembros con membresía activa disponibles para inscribir.", "info", "Sin miembros activos");
                return;
            }

            // 🔹 6. Construir opciones del select
            const optionsHTML = disponibles.map(m => `
                <div class="miembro-opcion" data-id="${m.id}" 
                     style="display:flex;justify-content:space-between;
                            align-items:center;padding:10px 14px;
                            border:1px solid #ddd;border-radius:6px;
                            margin-bottom:6px;cursor:pointer;
                            background:#fff;transition:0.2s;">
                    <span style="font-weight:600;color:#333;">${m.nombre}</span>
                    <span style="color:#666;">DNI: ${m.dni}</span>
                </div>
            `).join("");

                        Swal.fire({
                            title: "➕ Inscribir Miembro",
                            html: `
                    <div id="listaMiembros" style="max-height:300px;overflow-y:auto;">
                        ${optionsHTML}
                    </div>
                `,
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonText: "Cancelar",
                background: "#f9fafb",
                color: "#333",
                width: "400px",
                didOpen: () => {
                    document.querySelectorAll(".miembro-opcion").forEach(div => {
                        div.addEventListener("click", async () => {
                            const memberId = parseInt(div.dataset.id);
                            try {
                                await ClassAPI.inscribirMiembro(currentClass.id, memberId);
                                currentClass.inscriptosCount++;
                                displayClass(currentClass);
                                Swal.close();
                                showSuccess("Miembro inscripto correctamente ✅");
                            } catch (err) {
                                console.error(err);
                                showError("Error al inscribir miembro.");
                            }
                        });
                        div.addEventListener("mouseenter", () => div.style.background = "#98ff98");
                        div.addEventListener("mouseleave", () => div.style.background = "#fff");
                    });
                }
            })
            .then(async (result) => {
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
