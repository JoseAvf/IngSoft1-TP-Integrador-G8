import { MembersAPI } from "../../api/members.js";
import { MembershipsAPI } from "../../api/memberships.js";
import { setupMembershipSelector } from "../members/membershipSelector.js";
import { calcularDescuentos } from "../members/costCalculator.js";
import { PaymentAPI } from "../../api/payments.js"; // NUEVO

document.addEventListener("DOMContentLoaded", async () => {
    await membershipRegistration();

    // Solo permitir números en el DNI
    document.getElementById("dni").addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g, "");
    });
});

export async function membershipRegistration() {
    const form = document.getElementById("membershipForm");
    const btnSelectMembership = document.getElementById("btnSelectMembership");
    const btnPagar = document.getElementById("btnPagar");
    const btnRegistrar = form.querySelector('button[type="submit"]');

    const inputTipo = document.getElementById("membresiaTipo");
    const inputId = document.getElementById("membresiaId");
    const costoBaseSpan = document.getElementById("costoBase");
    const descuentoSpan = document.getElementById("descuento");
    const totalPagarSpan = document.getElementById("totalPagar");
    const chkEstudiante = document.getElementById("esEstudiante");

    let membresiaSeleccionada = null;
    let pagoRealizado = null;

    // 🔒 Bloquear botones al inicio
    btnRegistrar.disabled = true;
    btnPagar.disabled = true;

    // Configuramos el selector
    const membershipSelector = setupMembershipSelector(async (membresia) => {
        membresiaSeleccionada = membresia;

        const dni = form.dni.value.trim();
        if (!dni) return showAlert("Ingrese el DNI antes de seleccionar una membresía.", "warning");

        try {
            const miembro = await MembersAPI.getByDni(dni);
            if (!miembro) throw new Error("Miembro no encontrado");

            const miembroTemp = {
                fechaNacimiento: miembro.fechaNacimiento,
                esEstudiante: chkEstudiante.checked || false,
            };

            const { descuento, total } = calcularDescuentos(miembroTemp, membresia);

            inputTipo.value = membresia.tipo;
            inputId.value = membresia.id || "";
            costoBaseSpan.textContent = `$${membresia.costo}`;
            descuentoSpan.textContent = `${descuento}%`;
            totalPagarSpan.textContent = `$${total.toFixed(2)}`;

            // ✅ Habilitamos el botón de pagar
            btnPagar.disabled = false;

        } catch (error) {
            console.error("Error al buscar el miembro:", error);
            showError("Ocurrió un error al obtener el miembro: " + error.message);
        }
    });

    // Abrir el modal solo cuando el usuario hace clic
    btnSelectMembership.addEventListener("click", async () => {
        const dni = form.dni.value.trim();

        if (!dni) {
            showAlert("Primero ingrese el DNI del miembro a asignar la membresía.", "warning");
            return;
        }

        try {
            const miembro = await MembersAPI.getByDni(dni);

            if (!miembro) {
                showAlert("No se encontró ningún miembro con ese DNI. Registre al miembro primero.", "warning");
                return;
            }

            membershipSelector.open();
        } catch (error) {
            console.error("Error al verificar el miembro:", error);
            showError("Ocurrió un error al verificar el miembro. Intente nuevamente.");
        }
    });

    // 🔄 Recalcular dinámicamente si cambia “esEstudiante”
    chkEstudiante.addEventListener("change", () => {
        if (membresiaSeleccionada) {
            const miembroTemp = { esEstudiante: chkEstudiante.checked };
            const { descuento, total } = calcularDescuentos(miembroTemp, membresiaSeleccionada);
            descuentoSpan.textContent = `${descuento}%`;
            totalPagarSpan.textContent = `$${total.toFixed(2)}`;
        }
    });

    // === Pago con SweetAlert2 ===
    btnPagar.addEventListener("click", async () => {
        if (!membresiaSeleccionada) return showAlert("Seleccione una membresía antes de continuar.", "warning");

        const resumenTipo = membresiaSeleccionada.tipo;
        const resumenTotal = totalPagarSpan.textContent;

        const { value: metodo } = await Swal.fire({
            title: "💳 Confirmar Pago",
            html: `
                <div style="text-align:center;">
                    <p><strong>Membresía:</strong> ${resumenTipo}</p>
                    <p><strong>Total a pagar:</strong> <span style="color:#007bff;">${resumenTotal}</span></p>
                    <hr style="margin:12px 0;">
                    <label for="metodoPagoSelect" style="display:block;margin-bottom:8px;font-weight:500;">Método de Pago:</label>
                    <select id="metodoPagoSelect" class="swal2-select" style="width:80%;border-radius:8px;padding:6px;">
                        <option value="">Seleccione...</option>
                        <option value="Efectivo">💵 Efectivo</option>
                        <option value="Mercado Pago">📲 Mercado Pago</option>
                        <option value="Transferencia Bancaria">🏦 Transferencia Bancaria</option>
                        <option value="Tarjeta de Crédito">💳 Tarjeta Crédito</option>
                        <option value="Tarjeta de Débito">💳 Tarjeta Débito</option>
                    </select>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: "✅ Confirmar Pago",
            cancelButtonText: "Cancelar",
            background: "#f8fafc",
            color: "#333",
            confirmButtonColor: "#007bff",
            cancelButtonColor: "#aaa",
            preConfirm: () => {
                const select = document.getElementById("metodoPagoSelect");
                if (!select.value) {
                    Swal.showValidationMessage("Debe seleccionar un método de pago");
                    return false;
                }
                return select.value;
            }
        });

        if (!metodo) return; // Cancelado

        try {
            const pago = await PaymentAPI.create({
                fecha: new Date().toISOString(),
                monto: parseFloat(totalPagarSpan.textContent.replace("$", "")),
                metodoPago: metodo,
                membresiaId: null,
            });

            pagoRealizado = pago;
            btnRegistrar.disabled = false; // 👈 permitir auto-click


            // 💫 Auto-click con transición de carga
            await Swal.fire({
                title: "💳 Pago confirmado",
                text: "Procesando registro de la membresía...",
                icon: "success",
                showConfirmButton: false,
                allowOutsideClick: false,
                timer: 1800,
                willClose: () => btnRegistrar.click()
            });

        } catch (err) {
            pagoRealizado = null;
            showError("Error al procesar el pago: " + err.message);
        }
    });

    // === Envío final: crear membresía ===
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!membresiaSeleccionada)
            return showAlert("Debe seleccionar una membresía antes de registrar.", "warning");
        if (!pagoRealizado)
            return showAlert("Debe realizar el pago antes de registrar la membresía.", "warning");

        try {
            const miembro = await MembersAPI.getByDni(form.dni.value);

            const nuevaMembresia = await MembershipsAPI.create({
                MiembroId: miembro.id,
                Tipo: membresiaSeleccionada.tipo,
                CostoBase: membresiaSeleccionada.costo,
                EsEstudiante: chkEstudiante.checked
            });

            await PaymentAPI.update(pagoRealizado.id, {
                membresiaId: nuevaMembresia.id
            });

            await Swal.fire({
                icon: "success",
                title: "🎉 Membresía registrada",
                text: `La membresía "${nuevaMembresia.tipo}" se asignó correctamente a "${miembro.nombre}".`,
                confirmButtonColor: "#007bff"
            });

            // Reset visual
            form.reset();
            membresiaSeleccionada = null;
            pagoRealizado = null;
            btnRegistrar.disabled = true;
            btnPagar.disabled = true;
            inputTipo.value = "";
            inputId.value = "";
            costoBaseSpan.textContent = "-";
            descuentoSpan.textContent = "%0";
            totalPagarSpan.textContent = "-";

        } catch (err) {
            showError("Error al registrar la membresía: " + err.message);
        }
    });
}
