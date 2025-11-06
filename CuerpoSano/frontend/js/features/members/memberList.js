
import { MembersAPI } from "../../api/members.js";

document.addEventListener("DOMContentLoaded", async () => {

    await loadMemberList(); //carga la lista de miembros existentes
}); 

export async function loadMemberList() {
    const tableBody = document.querySelector("#membersTable tbody");
    const messageBox = document.getElementById("membersMessage");

    try {
        // Vaciar contenido previo
        tableBody.innerHTML = "";
        messageBox.textContent = "Cargando miembros...";

        // Llamar a la API
        const members = await MembersAPI.getAll();

        if (members.length === 0) {
            messageBox.textContent = "No hay miembros registrados.";
            return;
        }

        messageBox.textContent = "";

        // Renderizar filas
        members.forEach((m) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${m.id}</td>
                <td>${m.nombre}</td>
                <td>${m.dni}</td>
                <td>${m.telefono}</td>
                <td>${m.correo || "-"}</td>
                <td>${m.tipoMembresia || "Sin membresía"}</td>
                <td>${m.codigoCarnet || "-"}</td>
                <td>
                <button class="btn-delete" data-id="${m.id}">Eliminar</button>
                </td>
                `;
            tableBody.appendChild(row);
        });
        // Agregar evento a los botones de eliminar
        document.querySelectorAll(".btn-delete").forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                const id = e.target.dataset.id;
                // ✅ Usamos showConfirm en lugar de confirm
                showConfirmDelete(
                    "¿Seguro que deseas eliminar este miembro? Esta acción no se puede deshacer.",
                    async () => {
                        await deleteMember(id);
                        await loadMemberList(); // refresca lista
                    }
                );
            });
        });
    } catch (error) {
        console.error(error);
        showError("Error al cargar miembros: " + error.message);
    }
}

async function deleteMember(id) {
    try {
        await MembersAPI.delete(id);
        showSuccess("Miembro eliminado correctamente.");
    } catch (error) {
        showError("Error al eliminar miembro: " + error.message);
    }
}
