import { MembershipsAPI } from "../../api/memberships.js";
import { MembersAPI } from "../../api/members.js";

document.addEventListener("DOMContentLoaded", () => {
    const btnSearch = document.getElementById("btnSearch");
    const inputDni = document.getElementById("memberDni");
    const memberDataDiv = document.getElementById("membershipData");

    // Modal y formulario de edición
    const modal = document.getElementById("editMembershipModal");
    const form = document.getElementById("editMembershipForm");
    const selectTipo = document.getElementById("editMembershipTipo");
    const checkboxEstudiante = document.getElementById("editMembershipEstudiante");
    const btnCancel = document.getElementById("btnCancelMembershipEdit");

    // Modales nuevos
    const modalPause = document.getElementById("pauseMembershipModal");
    const modalUnpause = document.getElementById("unpauseMembershipModal");
    const btnConfirmPause = document.getElementById("btnConfirmPause");
    const btnCancelPause = document.getElementById("btnCancelPause");
    const btnConfirmUnpause = document.getElementById("btnConfirmUnpause");
    const btnCancelUnpause = document.getElementById("btnCancelUnpause");

    let currentMembership = null;

    function showToast(message = "Actualizado con éxito ✅") {
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
    }

    const MEMBERSHIP_OPTIONS = [
        { tipo: "Diaria" },
        { tipo: "Semanal" },
        { tipo: "Mensual" },
        { tipo: "Anual" }
    ];

    function showToast(message = "Actualizado con éxito ✅") {
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
    }


    btnSearch.addEventListener("click", async () => {
        const dni = inputDni.value.trim();
        if (!dni) {
            alert("Ingrese un DNI válido");
            return;
        }

        try {
            const member = await MembersAPI.getByDni(dni);
            console.log(member);
            if (!member) {
                alert("❌ No se encontró ningún miembro con ese DNI. Por favor registre al miembro primero.");
                return;
            }
            const membership = await MembershipsAPI.getById(member.membresiaId);
            currentMembership = membership;


            displayMembership(membership);

        } catch (error) {
            console.error(error);
            memberDataDiv.innerHTML = `<p style="color:red;">No se encontró el miembro con DNI ${dni}</p>`;
            memberDataDiv.classList.remove("hidden");
        }
    });

    function formatDate(dateString) {
        if (!dateString) return "-";
        const date = new Date(dateString);
        if (isNaN(date)) return "-";
        return date.toLocaleDateString("es-AR");
    }

    function displayMembership(membership) {
        const container = memberDataDiv;

        container.classList.remove("hidden");

        container.innerHTML = `
        <h3>Información de la membresía de ${membership.nombre || "-"}</h3>

        <!-- Datos de la membresía -->
        <section class="membership-section membership-info">
            <div class="membership-section-header">
                <h4>💳 Membresía</h4>
                <button id="btnEditMembership" class="btn-edit">✏️ Editar</button>
                 <button id="btnPauseMembership" class="btn-edit btn-pause">⏸️ Pausar</button>
                 <button id="btnUnpauseMembership" class="btn-edit btn-unpause">▶️ Despausar</button>
            </div>
            <p><strong>ID:</strong> ${membership.id || "-"}</p>
            <p><strong>Tipo:</strong> ${membership.tipo || "No asignada"}</p>
            <p><strong>Costo Final:</strong> ${membership.costo != null ? `$${membership.costo}` : "-"}</p>
            <p><strong>Fecha de Emisión:</strong> ${formatDate(membership.fechaEmision)}</p>
            <p><strong>Fecha de Vencimiento:</strong> ${formatDate(membership.fechaVencimiento)}</p>
            <p><strong>Fecha de Inicio de Pausa :</strong> ${formatDate(membership.fechaPausaInicio)}</p>
            <p><strong>Fecha de Fin de Pausa:</strong> ${formatDate(membership.fechaPausaFin)}</p>
        </section>

        <!-- Datos personales -->
        <section class="membership-section personal-info">
            <h4>🧑 Datos Personales del miembro</h4>
            <p><strong>ID:</strong> ${membership.idMiembro || "-"}</p>
            <p><strong>DNI:</strong> ${membership.dni || "-"}</p>
            <p><strong>Dirección:</strong> ${membership.direccion || "-"}</p>
            <p><strong>Teléfono:</strong> ${membership.telefono || "-"}</p>
            <p><strong>Correo:</strong> ${membership.correo || "-"}</p>
            <p><strong>Fecha de Nacimiento:</strong> ${formatDate(membership.fechaNacimiento)}</p>
        </section>
    `;

        // Botón editar membresía
        const btnEdit = document.getElementById("btnEditMembership");
        btnEdit.addEventListener("click", () => {
            // Llenar select con opciones
            selectTipo.innerHTML = MEMBERSHIP_OPTIONS.map(opt => `
                <option value="${opt.tipo}" ${membership.tipo === opt.tipo ? "selected" : ""}>${opt.tipo}</option>
            `).join("");

            checkboxEstudiante.checked = membership.esEstudiante || false;
            modal.classList.remove("hidden"); // ✅ mostrar modal

        });

        // Botón pausar
        document.getElementById("btnPauseMembership").addEventListener("click", () => {
            modalPause.classList.remove("hidden");
        });

        // Botón despausar
        document.getElementById("btnUnpauseMembership").addEventListener("click", () => {
            modalUnpause.classList.remove("hidden");
        });
    }

    // Cancelar edición
    btnCancel.addEventListener("click", () => {
        modal.classList.add("hidden"); // ✅ ocultar modal
    });

    // Guardar cambios
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!currentMembership) return;

        const updatedData = {
            tipo: selectTipo.value,
            esEstudiante: checkboxEstudiante.checked
        };

        try {
            await MembershipsAPI.update(currentMembership.id, updatedData);
            modal.classList.add("hidden"); // ✅ ocultar modal

            // Traer la membresía completa actualizada
            const refreshedMembership = await MembershipsAPI.getById(currentMembership.id);

            // Actualizar currentMembership
            currentMembership = refreshedMembership;

            // Volver a mostrarla en pantalla
            displayMembership(currentMembership);

            modal.classList.add("hidden"); // ocultar modal
            showToast("Membresía actualizada ✅");
        } catch (err) {
            console.error(err);
            alert("Error al actualizar la membresía");
        }
    });

    // === Confirmar pausa ===
    btnConfirmPause.addEventListener("click", async () => {
        try {
            const inicioPausa = new Date().toISOString();
            await MembershipsAPI.pause(currentMembership.id, inicioPausa);
            modalPause.classList.add("hidden");

            const refreshed = await MembershipsAPI.getById(currentMembership.id);
            currentMembership = refreshed;
            displayMembership(refreshed);
            showToast("Membresía pausada ✅");
        } catch (err) {
            console.error(err);
            alert("Error al pausar membresía");
        }
    });

    btnCancelPause.addEventListener("click", () => modalPause.classList.add("hidden"));

    // === Confirmar despausa ===
    btnConfirmUnpause.addEventListener("click", async () => {
        try {
            await MembershipsAPI.unpause(currentMembership.id);
            modalUnpause.classList.add("hidden");

            const refreshed = await MembershipsAPI.getById(currentMembership.id);
            currentMembership = refreshed;
            displayMembership(refreshed);
            showToast("Membresía despausada ✅");
        } catch (err) {
            console.error(err);
            alert("Error al despausar membresía");
        }
    });

    btnCancelUnpause.addEventListener("click", () => modalUnpause.classList.add("hidden"));
});
