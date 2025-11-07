import { MembershipsAPI } from "../../api/memberships.js";
import { MembersAPI } from "../../api/members.js";
import { PaymentAPI } from "../../api/payments.js";

document.addEventListener("DOMContentLoaded", () => {
    const btnSearch = document.getElementById("btnSearch");
    const inputDni = document.getElementById("memberDni");
    const memberDataDiv = document.getElementById("membershipData");

    let currentMembership = null;
    let paymentForMembership = null;

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

            // Buscamos pago asociado
            try {
                const payments = await PaymentAPI.getAll();
                paymentForMembership = payments.find(p => p.membresiaId === membership.id);
            } catch (err) {
                console.error("Error al cargar pagos:", err);
                paymentForMembership = null;
            }

            displayMembership(member, membership);

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

    function getEstadoMembresia(member) {
        if (!member.tipoMembresia) return "-";

        const hoy = new Date();
        const fechaVencimiento = member.fechaVencimientoMembresia ? new Date(member.fechaVencimientoMembresia) : null;

        if (fechaVencimiento && fechaVencimiento < hoy) {
            return `<span style="
                color: #d32f2f;
                font-weight: 600;
                background: #fdecea;
                padding: 3px 8px;
                border-radius: 6px;
            ">Vencida. Debe renovar.</span>`;
        }

        if (member.estaPausada) {
            return `<span style="
                color: #f9a825;
                font-weight: 600;
                background: #fff8e1;
                padding: 3px 8px;
                border-radius: 6px;
            ">Pausada</span>`;
        }

        return `<span style="
            color: #2e7d32;
            font-weight: 600;
            background: #e8f5e9;
            padding: 3px 8px;
            border-radius: 6px;
        ">Activa</span>`;
    }

    // === NUEVO: Modal comprobante de pago ===
    async function showPaymentReceiptModal(payment, member, membership) {
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
                    <p><strong>Tipo de Membresía:</strong> ${membership.tipo || "-"}</p>
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
                await generatePaymentPDF(payment, member, membership);
            }
        });
    }

    async function generatePaymentPDF(payment, member, membership) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

        let y = 25;
        const marginLeft = 20;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("Comprobante de Pago", 105, y, { align: "center" });

        y += 12;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);
        doc.text("Su Mejor Peso - Centro de Entrenamiento", 105, y, { align: "center" });

        y += 12;
        doc.setFontSize(11);
        doc.text("Fecha de emisión: " + new Date().toLocaleDateString("es-AR"), marginLeft, y);

        y += 6;
        doc.setDrawColor(200, 200, 200);
        doc.line(marginLeft, y, 190, y);

        // Datos del miembro
        y += 12;
        doc.setFont("helvetica", "bold");
        doc.text("Datos del Cliente:", marginLeft, y);
        y += 8;
        doc.setFont("helvetica", "normal");
        doc.text(`Nombre: ${member.nombre}`, marginLeft, y);
        y += 6;
        doc.text(`DNI: ${member.dni}`, marginLeft, y);
        y += 6;
        doc.text(`Tipo de Membresía: ${membership.tipo || "-"}`, marginLeft, y);

        // Datos del pago
        y += 12;
        doc.setFont("helvetica", "bold");
        doc.text("Detalles del Pago:", marginLeft, y);
        y += 8;
        doc.setFont("helvetica", "normal");
        doc.text(`Fecha de Pago: ${formatDate(payment.fechaPago)}`, marginLeft, y);
        y += 6;
        doc.text(`Monto: $${payment.monto.toLocaleString("es-AR")}`, marginLeft, y);
        y += 6;
        doc.text(`Método de Pago: ${payment.metodoPago}`, marginLeft, y);
        y += 6;
        doc.text(`ID de Pago: #${payment.id}`, marginLeft, y);

        y += 12;
        doc.setDrawColor(200, 200, 200);
        doc.line(marginLeft, y, 190, y);

        y += 18;
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Gracias por confiar en nosotros", 105, y, { align: "center" });
        y += 6;
        doc.text("Este documento es válido como comprobante de pago.", 105, y, { align: "center" });

        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, "_blank");
    }

    function displayMembership(member, membership) {
        const container = memberDataDiv;
        container.classList.remove("hidden");

        container.innerHTML = `
        <h3>Información de la membresía de ${member.nombre || "-"}</h3>
        <section class="membership-section membership-info">
            <div class="membership-section-header">
                <h4>💳 Membresía</h4>
                <div class="btns-container">
                    <button id="btnPaymentReceipt" class="btn-edit" ${!paymentForMembership ? "disabled style='opacity:0.5;cursor:not-allowed;'" : ""}>
                        🧾 Comprobante de Pago
                    </button>
                    <button id="btnPauseMembership" class="btn-edit btn-pause">⏸️ Pausar</button>
                    <button id="btnUnpauseMembership" class="btn-edit btn-unpause">▶️ Reanudar</button>
                </div>
            </div>
            <p><strong>ID:</strong> ${membership.id || "-"}</p>
            <p><strong>Tipo:</strong> ${membership.tipo || "No asignada"}</p>
            <p><strong>Costo Final:</strong> ${membership.costo != null ? `$${membership.costo}` : "-"}</p>
            <p><strong>Fecha de Emisión:</strong> ${formatDate(membership.fechaEmision)}</p>
            <p><strong>Fecha de Vencimiento:</strong> ${formatDate(membership.fechaVencimiento)}</p>
            <p><strong>Estado:</strong> ${getEstadoMembresia(member)}</p>
        </section>

        <section class="membership-section personal-info">
            <h4>🧑 Datos Personales del miembro</h4>
            <p><strong>ID:</strong> ${member.id || "-"}</p>
            <p><strong>DNI:</strong> ${member.dni || "-"}</p>
            <p><strong>Dirección:</strong> ${member.direccion || "-"}</p>
            <p><strong>Teléfono:</strong> ${member.telefono || "-"}</p>
            <p><strong>Correo:</strong> ${member.correo || "-"}</p>
            <p><strong>Fecha de Nacimiento:</strong> ${formatDate(member.fechaNacimiento)}</p>
        </section>
        `;

        configureMembershipButtons(member, membership);
    }

    function configureMembershipButtons(member, membership) {
        const btnPause = document.getElementById("btnPauseMembership");
        const btnUnpause = document.getElementById("btnUnpauseMembership");
        const btnReceipt = document.getElementById("btnPaymentReceipt");

        const hoy = new Date();
        const fechaVencimiento = member.fechaVencimientoMembresia
            ? new Date(member.fechaVencimientoMembresia)
            : null;

        const estaVencida = fechaVencimiento && fechaVencimiento < hoy;

        // === Lógica principal de botones ===
        if (estaVencida) {
            // Si está vencida: ambos botones desactivados
            btnPause.disabled = true;
            btnPause.style.opacity = 0.5;
            btnPause.style.cursor = "not-allowed";

            btnUnpause.disabled = true;
            btnUnpause.style.opacity = 0.5;
            btnUnpause.style.cursor = "not-allowed";
        }
        else if (member.estaPausada) {
        // Si está pausada: solo permitir reanudar
            btnPause.disabled = true;
            btnPause.style.opacity = 0.5;
            btnPause.style.cursor = "not-allowed";

            btnUnpause.disabled = false;
            btnUnpause.style.opacity = 1;
            btnUnpause.style.cursor = "pointer";
        } else {
            // Si está activa: solo permitir pausar
            btnPause.disabled = false;
            btnPause.style.opacity = 1;
            btnPause.style.cursor = "pointer";

            btnUnpause.disabled = true;
            btnUnpause.style.opacity = 0.5;
            btnUnpause.style.cursor = "not-allowed";
        }

        // Listener único para pausa
        btnPause.onclick = async () => {
            showConfirm("¿Deseas pausar esta membresía?", async () => {
                try {
                    const inicioPausa = new Date().toISOString();
                    await MembershipsAPI.pause(membership.id, inicioPausa);
                    const newMember = await MembersAPI.getByDni(member.dni);
                    const refreshed = await MembershipsAPI.getById(membership.id);
                    displayMembership(newMember, refreshed);
                    showSuccess("Membresía pausada correctamente ✅");
                } catch (err) {
                    console.error(err);
                    showError("Error al pausar la membresía.");
                }
            });
        };

        // Listener único para reanudar
        btnUnpause.onclick = async () => {
            showConfirm("¿Deseas reanudar esta membresía?", async () => {
                try {
                    await MembershipsAPI.unpause(membership.id);
                    const refreshed = await MembershipsAPI.getById(membership.id);
                    const newMember = await MembersAPI.getByDni(member.dni);
                    displayMembership(newMember, refreshed);
                    showSuccess("Membresía reanudada correctamente ✅");
                } catch (err) {
                    console.error(err);
                    showError("Error al reanudar la membresía.");
                }
            });
        };

        // Listener del comprobante
        if (btnReceipt && paymentForMembership) {
            btnReceipt.onclick = () => showPaymentReceiptModal(paymentForMembership, member, membership);
        }
    }

});
