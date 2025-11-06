import { MembershipsAPI } from "../../api/memberships.js";
import { MembersAPI } from "../../api/members.js";

document.addEventListener("DOMContentLoaded", () => {
    const btnSearch = document.getElementById("btnSearch");
    const inputDni = document.getElementById("memberDni");
    const memberDataDiv = document.getElementById("membershipData");

    // Modales originales eliminados (ya no se usan modales HTML)
    let currentMembership = null;

    const MEMBERSHIP_OPTIONS = [
        { tipo: "Diaria" },
        { tipo: "Semanal" },
        { tipo: "Mensual" },
        { tipo: "Anual" }
    ];

    btnSearch.addEventListener("click", async () => {
        const dni = inputDni.value.trim();
        if (!dni) {
            showAlert("Ingrese un DNI válido.", "warning");
            return;
        }

        try {
            const member = await MembersAPI.getByDni(dni);
            if (!member) {
                showError("No se encontró ningún miembro con ese DNI. Regístrelo primero.");
                return;
            }

            const membership = await MembershipsAPI.getById(member.membresiaId);
            currentMembership = membership;
            displayMembership(membership);

        } catch (error) {
            console.error(error);
            memberDataDiv.innerHTML = `<p style="color:red;text-align:center">El miembro con DNI: ${dni} no tiene una membresía asociada.</p>`;
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
        <section class="membership-section membership-info">
            <div class="membership-section-header">
                <h4>💳 Membresía</h4>
                <div class="btns-container">
                    <button id="btnPauseMembership" class="btn-edit btn-pause">⏸️ Pausar</button>
                    <button id="btnUnpauseMembership" class="btn-edit btn-unpause">▶️ Reanudar</button>
                </div>
            </div>
            <p><strong>ID:</strong> ${membership.id || "-"}</p>
            <p><strong>Tipo:</strong> ${membership.tipo || "No asignada"}</p>
            <p><strong>Costo Final:</strong> ${membership.costo != null ? `$${membership.costo}` : "-"}</p>
            <p><strong>Fecha de Emisión:</strong> ${formatDate(membership.fechaEmision)}</p>
            <p><strong>Fecha de Vencimiento:</strong> ${formatDate(membership.fechaVencimiento)}</p>
            <p><strong>Fecha de Inicio de Pausa :</strong> ${formatDate(membership.fechaPausaInicio)}</p>
            <p><strong>Fecha de Fin de Pausa:</strong> ${formatDate(membership.fechaPausaFin)}</p>
        </section>

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

        // Botón pausar
        document.getElementById("btnPauseMembership").addEventListener("click", () => {
            showConfirm("¿Deseas pausar esta membresía?", async () => {
                try {
                    const inicioPausa = new Date().toISOString();
                    await MembershipsAPI.pause(currentMembership.id, inicioPausa);
                    const refreshed = await MembershipsAPI.getById(currentMembership.id);
                    currentMembership = refreshed;
                    displayMembership(refreshed);
                    showSuccess("Membresía pausada correctamente ✅");
                } catch (err) {
                    console.error(err);
                    showError("Error al pausar la membresía.");
                }
            }, "Pausando membresía..");
        });


        // Botón despausar
        document.getElementById("btnUnpauseMembership").addEventListener("click", () => {
            showConfirm("¿Deseas reanudar esta membresía?", async () => {
                try {
                    await MembershipsAPI.unpause(currentMembership.id);
                    const refreshed = await MembershipsAPI.getById(currentMembership.id);
                    currentMembership = refreshed;
                    displayMembership(refreshed);
                    showSuccess("Membresía reanudada correctamente ✅");
                } catch (err) {
                    console.error(err);
                    showError("Error al reanudar la membresía.");
                }
            }, "Reanudando membresía..");
        });

    }
});
