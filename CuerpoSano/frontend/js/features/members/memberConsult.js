import { MembersAPI } from "../../api/members.js";
import { TrainerAPI } from "../../api/trainers.js";
import { PaymentAPI } from "../../api/payments.js";

document.addEventListener("DOMContentLoaded", () => {
    const btnSearch = document.getElementById("btnSearch");
    const inputDni = document.getElementById("memberDni");
    const memberDataDiv = document.getElementById("memberData");

    let currentMember = null;

    btnSearch.addEventListener("click", async () => {
        const dni = inputDni.value.trim();
        if (!dni) {
            showAlert("Ingrese un DNI válido", "warning");
            return;
        }

        try {
            const member = await MembersAPI.getByDni(dni);

            // Si la API devuelve null, undefined o vacío
            if (!member) {
                showError(`No se encontró ningún miembro con DNI ${dni}`);
                memberDataDiv.classList.add("hidden");
                return;
            }

            displayMember(member);
        } catch (error) {
            console.error(error);

            // Detectamos si fue un 404 explícito
            if (error.message?.includes("404")) {
                showError(`No se encontró ningún miembro con DNI ${dni}`);
            } else {
                showError("Error al buscar el miembro. Intente nuevamente.");
            }

            memberDataDiv.classList.add("hidden");
        }
    });

    // === NUEVO: Mostrar comprobante de pago ===
    async function showPaymentReceiptModal(payment, member) {
        Swal.fire({
           
            html: `
                <div style="
                    background: #fff;
                    width: 380px;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 6px 16px rgba(0,0,0,0.15);
                    text-align: left;
                    color: #333;
                    font-family: 'Segoe UI', sans-serif;
                ">
                    <h2 style="text-align:center; margin-bottom:10px;">Su Mejor Peso</h2>
                    <p style="text-align:center; margin-top:-8px; color:#666;">Centro de Entrenamiento</p>
                    <hr style="margin:15px 0;">
                    <p><strong>Cliente:</strong> ${member.nombre}</p>
                    <p><strong>DNI:</strong> ${member.dni}</p>
                    <p><strong>Tipo de Membresía:</strong> ${member.tipoMembresia || "-"}</p>
                    <p><strong>Fecha de Pago:</strong> ${formatDate(payment.fechaPago)}</p>
                    <p><strong>Monto:</strong> $${payment.monto.toLocaleString("es-AR")}</p>
                    <p><strong>Método de Pago:</strong> ${payment.metodoPago}</p>
                    <p><strong>ID de Pago:</strong> #${payment.id}</p>
                    <hr style="margin:15px 0;">
                    <p style="text-align:center; font-size:0.85rem; color:#555;">Gracias por su pago 💪</p>
                </div>
            `,
            showConfirmButton: true,
            confirmButtonText: "📄 Descargar PDF",
            confirmButtonColor: "#1976d2",
            background: "#f0f2f5",
            width: "auto",
            customClass: {
                popup: "no-default-swal-width"
            },
            preConfirm: async () => {
                await generatePaymentPDF(payment, member);
            }

        });
    }

    // === NUEVA FUNCIÓN: genera el PDF ===
    async function generatePaymentPDF(payment, member) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        const marginLeft = 20;
        let y = 25;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("Comprobante de Pago", 105, y, { align: "center" });

        y += 12;
        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.text("Su Mejor Peso - Centro de Entrenamiento", 105, y, { align: "center" });

        y += 12;
        doc.setFontSize(11);
        doc.text("Fecha de emisión: " + new Date().toLocaleDateString("es-AR"), marginLeft, y);

        // Línea divisoria
        y += 6;
        doc.setDrawColor(200, 200, 200);
        doc.line(marginLeft, y, 190, y);

        // Datos del miembro
        y += 12;
        doc.setFont("helvetica", "bold");
        doc.text("Datos del Cliente:", marginLeft, y);
        doc.setFont("helvetica", "normal");
        y += 8;
        doc.text(`Nombre: ${member.nombre}`, marginLeft, y);
        y += 6;
        doc.text(`DNI: ${member.dni}`, marginLeft, y);
        y += 6;
        doc.text(`Tipo de Membresía: ${member.tipoMembresia || "-"}`, marginLeft, y);

        // Datos del pago
        y += 12;
        doc.setFont("helvetica", "bold");
        doc.text("Detalles del Pago:", marginLeft, y);
        doc.setFont("helvetica", "normal");
        y += 8;
        doc.text(`Fecha de Pago: ${formatDate(payment.fechaPago)}`, marginLeft, y);
        y += 6;
        doc.text(`Monto: $${payment.monto.toLocaleString("es-AR")}`, marginLeft, y);
        y += 6;
        doc.text(`Método de Pago: ${payment.metodoPago}`, marginLeft, y);
        y += 6;
        doc.text(`ID de Pago: #${payment.id}`, marginLeft, y);

        // Línea divisoria
        y += 12;
        doc.setDrawColor(200, 200, 200);
        doc.line(marginLeft, y, 190, y);

        // Pie del comprobante
        y += 18;
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Gracias por confiar en nosotros", 105, y, { align: "center" });
        y += 6;
        doc.text("Este documento es válido como comprobante de pago.", 105, y, { align: "center" });

        // Mostrar el PDF en una nueva pestaña
        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, "_blank"); // abre el PDF en nueva pestaña
    }
    // === NUEVO: Mostrar carnet ===
    async function showCarnetModal(member) {
        Swal.fire({
            
            html: `
      <div id="carnet-card" style="
        width: 400px;
        background: linear-gradient(135deg, #1976d2, #42a5f5);
        border-radius: 12px;
        color: white;
        padding: 20px;
        box-shadow: 0 6px 14px rgba(0,0,0,0.2);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
      ">
        <div style="text-align:center;">
          <h2 style="margin:0;font-size:1.2rem;">Su Mejor Peso</h2>
          <p style="margin:0;font-size:0.9rem;">Centro de Entrenamiento</p>
        </div>
        <div style="text-align:center;">
          <h3 style="margin:6px 0;">${member.nombre}</h3>
          <p style="margin:0;">DNI: ${member.dni}</p>
          
        </div>
        <div style="width: 80%; margin-top: 6px;">
          <svg id="barcode"></svg>
        </div>
        <p style="font-size:0.75rem; opacity:0.9;">${member.codigoCarnet || member.id}</p>
        <p style="margin:1px 0 5px 0;font-size:0.8rem;">Emitido: ${formatDate(member.fechaEmisionCarnet)}</p>
      </div>
    `,
            showConfirmButton: false,
            width: "auto",
            background: "#f0f2f5",
            customClass: {
                popup: "no-default-swal-width"
            },
            didOpen: () => {
                const code = member.codigoCarnet || member.id || "0000000000";
                JsBarcode("#barcode", code, {
                    format: "CODE128",
                    lineColor: "#000000",
                    width: 0.65,
                    height: 40,
                    displayValue: false
                });
            }
        });
    }


    function formatDate(dateString) {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return isNaN(date) ? "-" : date.toLocaleDateString("es-AR");
    }

    function getEstadoMembresia(member) {
        if (!member.tipoMembresia) return "-";

        const hoy = new Date();
        const fechaVencimiento = member.fechaVencimientoMembresia ? new Date(member.fechaVencimientoMembresia) : null;

        // Si hay fecha de vencimiento y ya pasó, está vencida
        if (fechaVencimiento && fechaVencimiento < hoy) {
            return `<span style="
            color: #d32f2f;
            font-weight: 600;
            background: #fdecea;
            padding: 3px 8px;
            border-radius: 6px;
            margin-left: 3px;
        ">Vencida. Debe renovar.</span>`;
        }

        // Si está pausada
        if (member.estaPausada) {
            return `<span style="
            color: #f9a825;
            font-weight: 600;
            background: #fff8e1;
            padding: 3px 8px;
            border-radius: 6px;
            margin-left: 3px;
        ">Pausada</span>`;
        }

        // Si está activa
        return `<span style="
         color: #2e7d32;
        font-weight: 600;
        background: #e8f5e9;
        padding: 3px 8px;
        border-radius: 6px;
        margin-left: 3px;
    ">Activa</span>`;
    }


    async function displayMember(member) {

        currentMember = member;
        const container = document.getElementById("memberData");
        container.classList.remove("hidden");

        // Buscamos pago asociado
        let paymentForMembership = null;
        try {
            const payments = await PaymentAPI.getAll();
            paymentForMembership = payments.find(p => p.membresiaId === member.membresiaId);
        } catch (err) {
            console.error("Error al cargar pagos:", err);
        }

        // Obtenemos el entrenador (si existe)
        let assignedTrainer = null;
        if (member.entrenadorId) {
            try {
                assignedTrainer = await TrainerAPI.getById(member.entrenadorId);
            } catch {
                console.error("Error al cargar entrenador asignado");
            }
        }

        // Render principal
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
         <div class="member-section-header">    
            <h4>🎫 Carnet</h4>
            <button id="btnViewCard" class="btn-edit">🎫 Ver carnet</button>
        </div>
            <p><strong>Código:</strong> ${member.codigoCarnet || "No asignado"}</p>
            <p><strong>Fecha de Emisión:</strong> ${formatDate(member.fechaEmisionCarnet)}</p>
        </section>

        <!-- Datos de la membresía -->
        <section class="member-section membership-info">
        <div class="member-section-header">
                <h4>💳 Membresía</h4>
                <button id="btnPaymentReceipt" class="btn-edit" ${!paymentForMembership ? "disabled style='opacity:0.5;cursor:not-allowed;'" : ""}>
                    🧾 Comprobante de Pago
                </button>
            </div>

            <p><strong>Tipo:</strong> ${member.tipoMembresia || "No asignada"}</p>
            <p><strong>Fecha de Emisión:</strong> ${formatDate(member.fechaEmisionMembresia)}</p>
            <p><strong>Fecha de Vencimiento:</strong> ${formatDate(member.fechaVencimientoMembresia)}</p>
            <p><strong>Costo:</strong> ${member.costoMembresia != null ? `$${member.costoMembresia}` : "-"}</p>
            <p><strong>Estado:</strong> ${getEstadoMembresia(member)}</p>
        </section>

        <!-- Entrenador asignado -->
        <section class="member-section trainer-info" id="assignedTrainerSection">
            <div class="member-section-header">
                <h4>🏋️ Entrenador Asignado</h4>
                <button id="btnAddTrainer" class="btn-edit">➕ Agregar Entrenador</button>
            </div>
            ${assignedTrainer
                ? `
                        <p><strong>Nombre:</strong> ${assignedTrainer.nombre}</p>
                        <p><strong>DNI:</strong> ${assignedTrainer.dni}</p>
                        <p><strong>Teléfono:</strong> ${assignedTrainer.telefono || "-"}</p>
                    `
                : `<p>No hay entrenador asignado</p>`
            }
        </section>
        `;

        // Editar miembro con SweetAlert
        document.getElementById("btnEditMember").addEventListener("click", async () => {
            const result = await showEditMemberModal(member);

            if (result.isConfirmed) {
                const updatedData = result.value;

                try {
                    await MembersAPI.update(member.id, updatedData);
                    showSuccess("Miembro actualizado correctamente ✅");

                    // refrescamos la vista
                    const updatedMember = { ...member, ...updatedData };
                    displayMember(updatedMember);
                } catch (err) {
                    console.error(err);
                    showError("Error al actualizar el miembro");
                }
            }
        });

        document.getElementById("btnViewCard").addEventListener("click", () => {
            showCarnetModal(member);
        });

        const btnReceipt = document.getElementById("btnPaymentReceipt");
        if (paymentForMembership && btnReceipt) {
            btnReceipt.addEventListener("click", () => showPaymentReceiptModal(paymentForMembership, member));
        }


        // Agregar entrenador
        document.getElementById("btnAddTrainer").addEventListener("click", async () => {
            try {
                const trainers = await TrainerAPI.getAll();
                // ===== NUEVO MODAL DE SELECCIÓN =====
                const { value: selectedTrainerId } = await Swal.fire({
                    title: "🏋️ Asignar Entrenador",
                    html: `
                <div class="trainer-select-modal">
                    <div class="trainer-list">
                        <label class="trainer-item none-option">
                            <input type="radio" name="trainerRadio" value="" ${!currentMember.entrenadorId ? "checked" : ""}>
                            <div class="trainer-card">
                                <div class="trainer-info">
                                    <h4>❌ Sin entrenador</h4>
                                    <p>Quitar asignación actual</p>
                                </div>
                            </div>
                        </label>
                        ${trainers.map(tr => `
                            <label class="trainer-item">
                                <input type="radio" name="trainerRadio" value="${tr.id}" ${currentMember.entrenadorId === tr.id ? "checked" : ""}>
                                <div class="trainer-card">
                                    <div class="trainer-info">
                                        <h4>${tr.nombre}</h4>
                                        <p>DNI: ${tr.dni}</p>
                                        <p>Teléfono: ${tr.telefono || "-"}</p>
                                    </div>
                                </div>
                            </label>
                        `).join("")}
                    </div>
                </div>
            `,
                    background: "#f9fafb",
                    color: "#333",
                    width: 650,
                    showCancelButton: true,
                    confirmButtonText: "💾 Guardar",
                    cancelButtonText: "Cancelar",
                    confirmButtonColor: "#1976d2",
                    cancelButtonColor: "#9e9e9e",
                    customClass: {
                        popup: "no-default-swal-width-trainer shadow-xl rounded-2xl",
                        title: "text-lg font-semibold text-gray-800"
                          
                    },
                    preConfirm: () => {
                        const checked = document.querySelector('input[name="trainerRadio"]:checked');
                        return checked ? checked.value || null : null;
                    }
                });
                // ===== FIN NUEVO MODAL =====

                if (selectedTrainerId === undefined) return;

                await MembersAPI.assignTrainer(currentMember.dni, selectedTrainerId || null);

                if (selectedTrainerId) {
                    const assignedTrainer = await TrainerAPI.getById(selectedTrainerId);
                    document.getElementById("assignedTrainerSection").innerHTML = `
                        <div class="member-section-header">
                            <h4>🏋️ Entrenador Asignado</h4>
                            <button id="btnAddTrainer" class="btn-edit">➕ Agregar Entrenador</button>
                        </div>
                        <p><strong>Nombre:</strong> ${assignedTrainer.nombre}</p>
                        <p><strong>DNI:</strong> ${assignedTrainer.dni}</p>
                        <p><strong>Teléfono:</strong> ${assignedTrainer.telefono || "-"}</p>
                    `;
                    showSuccess("Entrenador asignado ✅");
                } else {
                    document.getElementById("assignedTrainerSection").innerHTML = `
                        <div class="member-section-header">
                            <h4>🏋️ Entrenador Asignado</h4>
                            <button id="btnAddTrainer" class="btn-edit">➕ Agregar Entrenador</button>
                        </div>
                        <p>No hay entrenador asignado</p>
                    `;
                    showSuccess("Entrenador desasignado ✅");
                }

                // refrescamos el miembro
                currentMember.entrenadorId = selectedTrainerId ? parseInt(selectedTrainerId) : null;
                displayMember(currentMember);
            } catch (err) {
                console.error(err);
                showError("Error al asignar entrenador");
            }
        });
    }

    // ====== MODAL: EDITAR MIEMBRO ======
    async function showEditMemberModal(member) {
        return Swal.fire({
            title: "✏️ Editar Miembro",
            html: `
        <div style="
            display: flex; 
            flex-direction: column; 
            gap: 18px;
                margin-top: 8px;
                padding: 10px 5px;
        ">
            <div>
                <label style="display:flex;font-weight:600;margin-bottom:6px;color:#374151;font-size:0.95rem; text-align: center;">Nombre</label>
                <input id="swal-nombre" class="swal2-input" value="${member.nombre || ""}" placeholder="Nombre del miembro" style="width:100%;">
            </div>

            <div>
                <label style="display:flex;font-weight:600;margin-bottom:6px;color:#374151;font-size:0.95rem; text-align: center;">Dirección</label>
                <input id="swal-direccion" class="swal2-input" value="${member.direccion || ""}" placeholder="Dirección" style="width:100%;">
            </div>

            <div>
                <label style="display:flex;font-weight:600;margin-bottom:6px;color:#374151;font-size:0.95rem; text-align: center;">Teléfono</label>
                <input id="swal-telefono" class="swal2-input" value="${member.telefono || ""}" type="number" placeholder="Teléfono" style="width:100%;">
            </div>

            <div>
               <label style="display:flex;font-weight:600;margin-bottom:6px;color:#374151;font-size:0.95rem; text-align: center;">Correo</label>
                <input id="swal-correo" class="swal2-input" value="${member.correo || ""}" type="email" placeholder="Correo electrónico" style="width:100%;">
            </div>
        </div>
        `,
            confirmButtonText: "💾 Guardar cambios",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            confirmButtonColor: "#1976d2",
            cancelButtonColor: "#9e9e9e",
            background: "#ffffff",
            color: "#333",
            width: "375px",
            customClass: {
                popup: "shadow-xl rounded-2xl",
                title: "text-lg font-semibold text-gray-800",
                confirmButton: "text-white font-medium py-2 px-4 rounded-lg",
                cancelButton: "font-medium py-2 px-4 rounded-lg"
            },
            preConfirm: () => {
                const nombre = document.getElementById("swal-nombre").value.trim();
                const direccion = document.getElementById("swal-direccion").value.trim();
                const telefono = document.getElementById("swal-telefono").value.trim();
                const correo = document.getElementById("swal-correo").value.trim();

                if (!nombre || !direccion || !telefono || !correo) {
                    Swal.showValidationMessage("⚠️ Complete todos los campos antes de guardar");
                    return false;
                }

                return { nombre, direccion, telefono: parseInt(telefono), correo };
            }
        });
    }

});
