import { ClassAPI } from "../../api/classes.js";
import { MembersAPI } from "../../api/members.js";


document.addEventListener("DOMContentLoaded", () => {
    const btnSearch = document.getElementById("btnSearch");
    const inputId = document.getElementById("classId");
    const classDataDiv = document.getElementById("classData");

    const toast = document.getElementById("toast"); // Si querés usar toast

    // Modal y formulario de edición
    const modal = document.getElementById("editClassModal");
    const form = document.getElementById("editClassForm");
    const inputNombre = document.getElementById("editNombre");
    const inputFechaClase = document.getElementById("editFechaClase");
    const inputHoraInicio = document.getElementById("editHoraInicio");
    const inputHoraFin = document.getElementById("editHoraFin");
    const inputCupo = document.getElementById("editCupo");
    const btnCancel = document.getElementById("btnCancelClassEdit");

    // Modal de inscripción
    const enrollModal = document.getElementById("enrollMemberModal");
    const selectMember = document.getElementById("selectMember");
    const btnConfirmEnroll = document.getElementById("btnConfirmEnroll");
    const btnCancelEnroll = document.getElementById("btnCancelEnroll");

    let currentClass = null;

    function showToast(message = "Actualizado con éxito ✅") {
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
    }

    function formatDateTime(dateString) {
        if (!dateString) return "-";
        const date = new Date(dateString);
        if (isNaN(date)) return "-";
        return date.toLocaleString("es-AR", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit"
        });
    }

    btnSearch.addEventListener("click", async () => {
        const id = parseInt(inputId.value.trim());
        if (!id || isNaN(id)) {
            alert("Ingrese un ID válido");
            return;
        }

        try {
            const clase = await ClassAPI.getById(id);
            console.log(clase);
            displayClass(clase);
        } catch (error) {
            console.error(error);
            classDataDiv.innerHTML = `<p style="color:red;">No se encontró la clase con ID ${id}</p>`;
            classDataDiv.classList.remove("hidden");
        }
    });

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

        // Abrir modal al hacer click en Editar
        const btnEdit = document.getElementById("btnEditClass");
        btnEdit.addEventListener("click", () => {
            inputNombre.value = clase.nombre || "";
            const inicio = new Date(clase.horaInicio);
            const fin = new Date(clase.horaFin);
            inputFechaClase.value = inicio.toISOString().split("T")[0];
            inputHoraInicio.value = inicio.toTimeString().slice(0, 5);
            inputHoraFin.value = fin.toTimeString().slice(0, 5);
            inputCupo.value = clase.cupo || 1;

            modal.classList.remove("hidden");
        });

        // Botón de inscribir miembro
        const btnEnroll = document.getElementById("btnEnrollMember");
        btnEnroll.addEventListener("click", async () => {
            try {
                // Traer miembros disponibles
                const members = await MembersAPI.getAll();
                selectMember.innerHTML = members.map(m => `
                    <option value="${m.id}">${m.nombre} (${m.dni})</option>
                `).join("");

                enrollModal.classList.remove("hidden");
            } catch (err) {
                console.error(err);
                alert("Error al cargar miembros");
            }
        });
    }

    // Cancelar edición
    btnCancel.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    // Guardar cambios
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!currentClass) return;

        // Armar los DateTime completos
        const horaInicioISO = new Date(`${inputFechaClase.value}T${inputHoraInicio.value}:00`).toISOString();
        const horaFinISO = new Date(`${inputFechaClase.value}T${inputHoraFin.value}:00`).toISOString();

        const updatedData = {
            nombre: inputNombre.value,
            horaInicio: horaInicioISO,
            horaFin: horaFinISO,
            cupo: parseInt(inputCupo.value)
        };

        try {
            await ClassAPI.update(currentClass.id, updatedData);
            modal.classList.add("hidden");
            currentClass = { ...currentClass, ...updatedData };

            displayClass(currentClass);
            showToast("Clase actualizada ✅");
        } catch (err) {
            console.error(err);
            alert("Error al actualizar la clase");
        }
    });

    // Modal de inscripción: cancelar
    btnCancelEnroll.addEventListener("click", () => enrollModal.classList.add("hidden"));

    // Confirmar inscripción
    btnConfirmEnroll.addEventListener("click", async () => {
        const memberId = parseInt(selectMember.value);
        if (!memberId) {
            alert("Seleccione un miembro");
            return;
        }

        try {
            await ClassAPI.inscribirMiembro(currentClass.id, memberId); // POST /{id}/inscribir/{miembroId}
            enrollModal.classList.add("hidden");

            // Actualizamos la cantidad de inscritos en currentClass
            currentClass.inscriptosCount = (currentClass.inscriptosCount || 0) + 1;

            displayClass(currentClass);
            showToast("Miembro inscripto ✅");
        } catch (err) {
            console.error(err);
            enrollModal.classList.add("hidden");
            alert("Error al inscribir miembro");
        }
    });
});
