import { MembershipsAPI } from "../../api/memberships.js";

export async function loadMembershipList() {
    const tbody = document.querySelector("#membershipsTable tbody");
    const messageBox = document.getElementById("membershipsMessage");
    try {
        tbody.innerHTML = "";
        messageBox.textContent = "Cargando membresías...";
        const memberships = await MembershipsAPI.getAll();
        if (memberships.length === 0) {
            messageBox.textContent = "No hay membresías registradas.";
            return;
        }
        messageBox.textContent = "";
        memberships.forEach((m) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${m.id}</td>
                <td>${m.tipo}</td>
                <td>$${m.costoFinal.toFixed(2)}</td>
                <td>${m.fechaEmision ? new Date(m.fechaEmision).toLocaleDateString() : "-"}</td>
                <td>${m.fechaVencimiento ? new Date(m.fechaVencimiento).toLocaleDateString() : "-"}
                </td>
                <td>${m.miembro?.nombre || "Sin miembro asociado"}</td>
                <td>
                <button class="btn-delete" data-id="${m.id}">🗑️</button>
                </td>
                `;
            tbody.appendChild(row);
        });
        // Event listeners para eliminar
        document.querySelectorAll(".btn-delete").forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                const id = e.target.dataset.id;
                if (confirm("¿Eliminar esta membresía?")) {
                    await MembershipsAPI.delete(id);
                    await loadMembershipList();
                }
            });
        });
    } catch (err) {
        console.error(err);
        messageBox.textContent = "❌ Error al cargar membresías.";
    }
}