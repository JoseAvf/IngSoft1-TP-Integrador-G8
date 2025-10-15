import { MembersAPI } from "../../api/members.js";

document.addEventListener("DOMContentLoaded", () => {
    const btnSearch = document.getElementById("btnSearch");
    const inputDni = document.getElementById("memberDni");
    const memberDataDiv = document.getElementById("memberData");

    btnSearch.addEventListener("click", async () => {
        const dni = inputDni.value.trim();
        if (!dni) {
            alert("Ingrese un DNI válido");
            return;
        }

        try {
            const member = await MembersAPI.getByDni(dni);
            console.log(member);
            displayMember(member);

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

    function displayMember(member) {
        const container = document.getElementById("memberData");
        container.classList.remove("hidden");

        container.innerHTML = `
        <h3>Información de ${member.nombre || "-"}</h3>

        <!-- Datos personales -->
        <section class="member-section personal-info">
            <h4>🧑 Datos Personales</h4>
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
            <p><strong>Estado:</strong> ${member.estaPausada ? "Pausada" : "Activa"}</p>
        </section>
    `;
    }
});
