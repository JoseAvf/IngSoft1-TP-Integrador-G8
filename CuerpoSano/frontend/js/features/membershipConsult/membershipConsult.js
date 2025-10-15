import { MembershipsAPI } from "../../api/memberships.js";
import { MembersAPI } from "../../api/members.js";

document.addEventListener("DOMContentLoaded", () => {
    const btnSearch = document.getElementById("btnSearch");
    const inputDni = document.getElementById("memberDni");
    const memberDataDiv = document.getElementById("membershipData");

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
        const container = document.getElementById("membershipData");
        container.classList.remove("hidden");

        container.innerHTML = `
        <h3>Información de la membresía de ${membership.nombre || "-"}</h3>

        <!-- Datos de la membresía -->
        <section class="membership-section membership-info">
            <h4>💳 Membresía</h4>
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
    }
});
