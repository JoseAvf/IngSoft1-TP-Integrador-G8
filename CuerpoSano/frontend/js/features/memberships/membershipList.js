import { MembershipsAPI } from "../../api/memberships.js";

document.addEventListener("DOMContentLoaded", async () => {
    await loadMembershipList();
});

export async function loadMembershipList() {
    const tbody = document.querySelector("#membershipsTable tbody");
    const messageBox = document.getElementById("membershipsMessage");

    try {
        tbody.innerHTML = "";
        messageBox.textContent = "Cargando membresías...";

        const memberships = await MembershipsAPI.getAll();

        if (!memberships || memberships.length === 0) {
            messageBox.textContent = "No hay membresías registradas.";
            return;
        }

        messageBox.textContent = "";

        memberships.forEach((m) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${m.id}</td>
                <td>${m.nombre || "-"}</td>
                <td>${m.dni || "-"}</td>
                <td>${m.tipo || "-"}</td>
                <td>$${m.costo?.toFixed(2) || "-"}</td>
                <td>${m.fechaEmision ? new Date(m.fechaEmision).toLocaleDateString() : "-"}</td>
                <td>${m.fechaVencimiento ? new Date(m.fechaVencimiento).toLocaleDateString() : "-"}</td>
                <td>${m.fechaPausaInicio ? new Date(m.fechaPausaInicio).toLocaleDateString() : "-"}</td>
                <td>${m.fechaPausaFin ? new Date(m.fechaPausaFin).toLocaleDateString() : "-"}</td>
                <td>
                    <button class="btn-delete" data-id="${m.id}">Eliminar</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Event listeners para eliminar
        document.querySelectorAll(".btn-delete").forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                const id = e.target.dataset.id;
                showConfirmDelete(
                    "¿Seguro que deseas eliminar esta membresía? Esta acción no se puede deshacer.",
                    async () => {
                        await deleteMembership(id);
                        await loadMembershipList(); // refresca lista
                    }
                );
            });
        });

    } catch (err) {
        console.error(err);
        messageBox.textContent = "❌ Error al cargar membresías.";
    }
}

async function deleteMembership(id) {
    try {
        await MembershipsAPI.delete(id);
        showSuccess("Membresia eliminada correctamente.");
    } catch (error) {
        showError("Error al eliminar membresia: " + error.message);
    }
}
