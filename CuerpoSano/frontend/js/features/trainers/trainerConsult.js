// trainerConsult.js
import { TrainerAPI } from "../../api/trainers.js";

document.addEventListener("DOMContentLoaded", () => {
    const btnSearch = document.getElementById("btnSearchTrainer");
    const inputDni = document.getElementById("trainerDni");
    const trainerDataDiv = document.getElementById("trainerData");

    const toast = document.getElementById("toast");

    // Modal y formulario de edición
    const modal = document.getElementById("editTrainerModal");
    const form = document.getElementById("editTrainerForm");
    const inputNombre = document.getElementById("editTrainerNombre");
    const inputDireccion = document.getElementById("editTrainerDireccion");
    const inputTelefono = document.getElementById("editTrainerTelefono");
    const btnCancel = document.getElementById("btnCancelTrainerEdit");

    let currentTrainer = null;

    function showToast(message = "Actualizado con éxito ✅") {
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
    }


    btnSearch.addEventListener("click", async () => {
        const dni = inputDni.value.trim(); // obtiene el DNI ingresado en forma de cadena
        if (!dni) {
            alert("Ingrese un DNI válido");
            return;
        }

        try {
            const trainer = await TrainerAPI.getByDni(dni); 
            if (!trainer) throw new Error("Entrenador no encontrado");
            displayTrainer(trainer);
        } catch (error) {
            console.error(error);
            trainerDataDiv.innerHTML = `<p style="color:red;">No se encontró el entrenador con DNI ${dni}</p>`;
            trainerDataDiv.classList.remove("hidden");
        }
    });

    function formatDate(dateString) {
        if (!dateString) return "-";
        const date = new Date(dateString);
        if (isNaN(date)) return "-";
        return date.toLocaleDateString("es-AR");
    }

    async function displayTrainer(trainer) {

        currentTrainer = trainer; // importante para edición

        const container = trainerDataDiv;
        container.classList.remove("hidden");

        // --- Datos personales ---
        let html = `
        <h3>Información de ${trainer.nombre || "-"}</h3>
        <section class="trainer-section personal-info">
            <div class="trainer-section-header">
                <h4>🧑 Datos Personales</h4>
                <button id="btnEditTrainer" class="btn-edit">✏️ Editar</button>
            </div>
            <p><strong>ID:</strong> ${trainer.id || "-"}</p>
            <p><strong>Nombre:</strong> ${trainer.nombre || "-"}</p>
            <p><strong>DNI:</strong> ${trainer.dni || "-"}</p>
            <p><strong>Dirección:</strong> ${trainer.direccion || "-"}</p>
            <p><strong>Teléfono:</strong> ${trainer.telefono || "-"}</p>
            <p><strong>Fecha de Nacimiento:</strong> ${formatDate(trainer.fechaNacimiento)}</p>
        </section>
        `;

        // --- Datos del certificado ---
        html += `
        <section class="trainer-section certificate-info">
            <h4>📄 Certificado</h4>
            <p><strong>Código:</strong> ${trainer.codigoCertificado || "No asignado"}</p>
            <p><strong>Vigencia:</strong> ${trainer.vigencia ? "Vigente" : "No vigente" || "-"}</p>
            <p><strong>Fecha de Emisión:</strong> ${formatDate(trainer.fechaEmision)}</p>
            <p><strong>Fecha de Vencimiento:</strong> ${formatDate(trainer.fechaVencimiento)}</p>
        </section>
        `;

        // --- Clases del entrenador ---
        html += `
        <section class="trainer-section classes-info">
            <h4>🏋️ Clases del Entrenador</h4>
        `;

        if (Array.isArray(trainer.clases) && trainer.clases.length > 0) {
            html += `
                <div class="table-wrapper">
                    <table id="trainerClassesTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Actividad</th>
                                <th>Cupo</th>
                                <th>Hora Inicio</th>
                                <th>Hora Fin</th>
                                <th>Fecha Creación</th>
                                <th>Inscriptos</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            trainer.clases.forEach(clase => {
                const horaInicio = new Date(clase.horaInicio).toLocaleString('es-AR', { hour12: false, day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                const horaFin = new Date(clase.horaFin).toLocaleString('es-AR', { hour12: false, day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                html += `
                    <tr>
                        <td>${clase.id}</td>
                        <td>${clase.nombre}</td>
                        <td>${clase.actividadNombre}</td>
                        <td>${clase.cupo}</td>
                        <td>${horaInicio}</td>
                        <td>${horaFin}</td>
                        <td>${formatDate(clase.fechaCreacion)}</td>
                        <td>${clase.inscriptosCount}</td>
                    </tr>
                `;
            });

            html += `
                        </tbody>
                    </table>
                </div>
            
            `;
        } else {
            html += `<p>No tiene clases asignadas</p>`;
        }

        html += `</section>`; // cierra la sección

        // --- Miembros asignados ---
        try {
            const miembros = await TrainerAPI.getMiembrosAsignados(trainer.id);

            html += `
            <section class="trainer-section members-info">
                <h4>👥 Miembros Asignados</h4>
            `;

            if (Array.isArray(miembros) && miembros.length > 0) {
                html += `
                <div class="table-wrapper">
                    <table id="trainerMembersTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>DNI</th>
                                <th>Teléfono</th>
                                <th>Correo</th>
                                <th>Código Carnet</th>
                                <th>Tipo Membresía</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                miembros.forEach(m => {
                    html += `
                        <tr>
                            <td>${m.id}</td>
                            <td>${m.nombre}</td>
                            <td>${m.dni}</td>
                            <td>${m.telefono}</td>
                            <td>${m.correo}</td>
                            <td>${m.codigoCarnet || "No asignado"}</td>
                            <td>${m.tipoMembresia || "No asignada"}</td>
                        </tr>
                    `;
                });

                html += `
                        </tbody>
                    </table>
                </div>
                `;
            } else {
                html += `<p>No tiene miembros asignados</p>`;
            }

            html += `</section>`; // cierra la sección

        } catch (error) {
            console.error(error);
            html += `<p style="color:red;">❌ Error al obtener miembros asignados: ${error.message}</p>`;
        }
        
        container.innerHTML = html;

        // Botón de edición
        const btnEdit = document.getElementById("btnEditTrainer");
        btnEdit.addEventListener("click", () => {
            inputNombre.value = currentTrainer.nombre || "";
            inputDireccion.value = currentTrainer.direccion || "";
            inputTelefono.value = currentTrainer.telefono || "";
            modal.classList.add("active");

        });

    }
    // Cancelar edición
    btnCancel.addEventListener("click", () => {
        modal.classList.remove("active");

    });

    // Guardar cambios
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!currentTrainer) return;

        const updatedData = {
            nombre: inputNombre.value.trim(),
            direccion: inputDireccion.value.trim(),
            telefono: parseInt(inputTelefono.value)
        };

        try {
            await TrainerAPI.update(currentTrainer.id, updatedData);
            currentTrainer = { ...currentTrainer, ...updatedData };

            modal.classList.remove("active");

            displayTrainer(currentTrainer);
            showToast("Entrenador actualizado ✅");
        } catch (err) {
            console.error(err);
            alert("Error al actualizar el entrenador");
        }
    });
});
