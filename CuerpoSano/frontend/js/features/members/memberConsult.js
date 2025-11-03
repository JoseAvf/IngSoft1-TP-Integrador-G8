import { MembersAPI } from "../../api/members.js";
import { TrainerAPI } from "../../api/trainers.js";


document.addEventListener("DOMContentLoaded", () => {
    const btnSearch = document.getElementById("btnSearch");
    const inputDni = document.getElementById("memberDni");
    const memberDataDiv = document.getElementById("memberData");

    const toast = document.getElementById("toast");

    // Modal y formulario de edición
    const modal = document.getElementById("editMemberModal");
    const form = document.getElementById("editMemberForm");
    const inputNombre = document.getElementById("editNombre");
    const inputDireccion = document.getElementById("editDireccion");
    const inputTelefono = document.getElementById("editTelefono");
    const inputCorreo = document.getElementById("editCorreo");
    const btnCancel = document.getElementById("btnCancelMemberEdit");

    let currentMember = null;

    // Toast helper
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
        currentMember = member;


        const container = document.getElementById("memberData");
        container.classList.remove("hidden");

        container.innerHTML = `
        <h3>Información de ${member.nombre || "-"}</h3>

        <!-- Datos personales -->
        <section class="member-section personal-info">
            <div class="member-section-header">
                <h4>🧑 Datos Personales</h4>
                <button id="btnEditMember" class="btn-edit">✏️ Editar</button>
            </div>
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
            <p><strong>Estado:</strong> ${member.tipoMembresia ? (member.estaPausada ? "Pausada" : "Activa") : "-"}</p>
        </section>
    `;
        // Después de renderizar toda la info del miembro
        displayAssignedTrainer(member);

        // Abrir modal al hacer click en editar
        const btnEdit = document.getElementById("btnEditMember");
        btnEdit.addEventListener("click", () => {
            inputNombre.value = member.nombre || "";
            inputDireccion.value = member.direccion || "";
            inputTelefono.value = member.telefono || "";
            inputCorreo.value = member.correo || "";
            modal.classList.remove("hidden");
        });



        // Crear botón “Agregar Entrenador” al lado de Editar
        const btnAddTrainer = document.createElement("button");
        btnAddTrainer.textContent = "🏋️ Agregar Entrenador";
        btnAddTrainer.classList.add("btn-edit");
        btnAddTrainer.style.marginLeft ="1px"; // separación
        btnEdit.parentNode.appendChild(btnAddTrainer);

        // Modal de asignar entrenador
        const assignTrainerModal = document.getElementById("assignTrainerModal");
        const trainerListContainer = document.getElementById("trainerListContainer");
        const btnConfirmTrainer = document.getElementById("btnConfirmTrainer");
        const btnCancelTrainer = document.getElementById("btnCancelTrainer");

        let selectedTrainerId = null;

        // Abrir modal y cargar entrenadores
        btnAddTrainer.addEventListener("click", async () => {
            try {
                const trainers = await TrainerAPI.getAll();

                trainerListContainer.innerHTML = `
            <div>
                <input type="radio" name="trainerRadio" value="" id="trainerNone" ${!currentMember.entrenadorId ? "checked" : ""}>
                <label for="trainerNone">❌ Ningún entrenador (desasignar)</label>
            </div>
            ${trainers.map(tr => `
                <div>
                    <input type="radio" name="trainerRadio" value="${tr.id}" id="trainer_${tr.id}" ${currentMember.entrenadorId === tr.id ? "checked" : ""}>
                    <label for="trainer_${tr.id}">${tr.nombre} (${tr.dni})</label>
                </div>
            `).join("")}
        `;

                selectedTrainerId = currentMember.entrenadorId || null;
                assignTrainerModal.classList.remove("hidden");

                document.querySelectorAll('input[name="trainerRadio"]').forEach(radio => {
                    radio.addEventListener("change", e => {
                        selectedTrainerId = e.target.value === "" ? null : parseInt(e.target.value);
                    });
                });


            } catch (err) {
                console.error(err);
                alert("Error al cargar entrenadores");
            }
        });

        // Cancelar edición
        btnCancel.addEventListener("click", () => {
            modal.classList.add("hidden");
        });

        // Cancelar modal
        btnCancelTrainer.addEventListener("click", () => {
            assignTrainerModal.classList.add("hidden");
        });

        // Confirmar asignación
        btnConfirmTrainer.addEventListener("click", async () => {

            try {
                await MembersAPI.assignTrainer(currentMember.dni, selectedTrainerId);

                // Actualizar la vista
                let trainerSection = document.getElementById("assignedTrainerSection");
                if (!trainerSection) {
                    trainerSection = document.createElement("section");
                    trainerSection.id = "assignedTrainerSection";
                    trainerSection.classList.add("member-section", "trainer-info");
                    memberDataDiv.appendChild(trainerSection);
                }

                if (selectedTrainerId === null) {
                    trainerSection.innerHTML = `<h4>🏋️ Entrenador Asignado</h4><p>No hay entrenador asignado</p>`;
                } else {
                    const assignedTrainer = await TrainerAPI.getById(selectedTrainerId);
                    trainerSection.innerHTML = `
                <h4>🏋️ Entrenador Asignado</h4>
                <p><strong>Nombre:</strong> ${assignedTrainer.nombre}</p>
                <p><strong>DNI:</strong> ${assignedTrainer.dni}</p>
                <p><strong>Teléfono:</strong> ${assignedTrainer.telefono || "-"}</p>
            `;
                }

                // Actualizamos el currentMember
                currentMember.entrenadorId = selectedTrainerId;

                assignTrainerModal.classList.add("hidden");
                showToast(selectedTrainerId === null ? "Entrenador desasignado ✅" : "Entrenador asignado ✅");

            } catch (err) {
                console.error(err);
                alert("Error al asignar entrenador");
            }
        });

        // Guardar cambios
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            console.log("Guardar cambios");

            if (!currentMember) return;

            const updatedData = {
                nombre: inputNombre.value,
                direccion: inputDireccion.value,
                telefono: parseInt(inputTelefono.value),
                correo: inputCorreo.value
            };

            try {
                await MembersAPI.update(currentMember.id, updatedData);
                modal.classList.add("hidden");
                console.log("Miembro actualizado");
                // Actualizar los datos en pantalla
                currentMember = { ...currentMember, ...updatedData };
                displayMember(currentMember);

                showToast("Miembro actualizado ✅");
            } catch (err) {
                console.error(err);
                alert("Error al actualizar el miembro");
            }
        });
    }

    // Sección de entrenador asignado al mostrar el miembro
    async function displayAssignedTrainer(member) {
        let trainerSection = document.getElementById("assignedTrainerSection");

        if (!trainerSection) {
            trainerSection = document.createElement("section");
            trainerSection.id = "assignedTrainerSection";
            trainerSection.classList.add("member-section", "trainer-info");
            memberDataDiv.appendChild(trainerSection);
        }

        if (!member.entrenadorId) {
            trainerSection.innerHTML = `<h4>🏋️ Entrenador Asignado</h4><p>No hay entrenador asignado</p>`;
        } else {
            try {
                const assignedTrainer = await TrainerAPI.getById(member.entrenadorId);
                trainerSection.innerHTML = `
                <h4>🏋️ Entrenador Asignado</h4>
                <p><strong>Nombre:</strong> ${assignedTrainer.nombre}</p>
                <p><strong>DNI:</strong> ${assignedTrainer.dni}</p>
                <p><strong>Teléfono:</strong> ${assignedTrainer.telefono || "-"}</p>
            `;
            } catch (err) {
                console.error(err);
                trainerSection.innerHTML = `<h4>🏋️ Entrenador Asignado</h4><p>Error al cargar el entrenador</p>`;
            }
        }
    }
});

