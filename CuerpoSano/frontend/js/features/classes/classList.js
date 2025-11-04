// classList.js
import { ClassAPI } from "../../api/classes.js";

document.addEventListener("DOMContentLoaded", () => {
    loadClasses();
    setupModals();
});

// ---------- Referencias ----------
const deleteModal = document.getElementById("deleteModal");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const closeDeleteBtn = document.querySelector(".closeDeleteModal");

let classIdToDelete = null;

// ---------- Cargar listado de clases ----------
async function loadClasses() {
    const tableBody = document.querySelector("#classesTable tbody");
    tableBody.innerHTML = "";

    try {
        const classes = await ClassAPI.getAll();

        if (!classes || classes.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="8">No hay clases registradas.</td></tr>`;
            return;
        }

        classes.forEach(c => {
            const row = document.createElement("tr");

            const horaInicio = new Date(c.horaInicio).toLocaleString("es-AR", {
                day: "2-digit", month: "2-digit", year: "numeric",
                hour: "2-digit", minute: "2-digit", hour12: false
            });

            const horaFin = new Date(c.horaFin).toLocaleString("es-AR", {
                day: "2-digit", month: "2-digit", year: "numeric",
                hour: "2-digit", minute: "2-digit", hour12: false
            });

            row.innerHTML = `
                <td>${c.id}</td>
                <td>${c.nombre || "-"}</td>
                <td>${c.actividadNombre || "-"}</td>
                <td>${c.entrenadorNombre || "No asignado"}</td>
                <td>${horaInicio}</td>
                <td>${horaFin}</td>
                <td>${c.inscriptosCount}</td>
                <td>${c.cupo}</td>
                <td>
                    <button class="btn-delete" data-id="${c.id}" style="background-color:#d32f2f; color:white;"> Eliminar</button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Asignar eventos a botones
        document.querySelectorAll(".btn-edit").forEach(btn => {
            btn.addEventListener("click", e => {
                const id = e.target.dataset.id;
                window.location.href = `./classEdit.html?id=${id}`;
            });
        });

        document.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", e => {
                classIdToDelete = e.target.dataset.id;
                deleteModal.classList.remove("hidden"); // ✅ Mostrar modal centrado
            });
        });

    } catch (err) {
        console.error(err);
        tableBody.innerHTML = `<tr><td colspan="8" style="color:red;">❌ Error al cargar clases: ${err.message}</td></tr>`;
    }
}

// ---------- Configuración modales ----------
function setupModals() {
    // Modal de eliminación
    if (deleteModal && closeDeleteBtn && cancelDeleteBtn) {
        closeDeleteBtn.addEventListener("click", closeDeleteModal);
        cancelDeleteBtn.addEventListener("click", closeDeleteModal);
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener("click", async () => {
            if (!classIdToDelete) return;
            try {
                await ClassAPI.delete(classIdToDelete);
                alert("✅ Clase eliminada correctamente.");
                closeDeleteModal();
                loadClasses();
            } catch (err) {
                console.error(err);
                alert("❌ Error al eliminar clase: " + err.message);
            }
        });
    }

    // Cerrar modal al hacer clic fuera
    window.addEventListener("click", (e) => {
        if (e.target === deleteModal) closeDeleteModal();
    });
}

// Cerrar modal
function closeDeleteModal() {
    deleteModal.classList.add("hidden");
    classIdToDelete = null;
}

// ---------- Botón de impresión ----------
const printBtn = document.getElementById("btnPrint");
if (printBtn) {
    printBtn.addEventListener("click", () => {
        window.print(); // 🖨️ abre el diálogo de impresión del navegador
    });
}
