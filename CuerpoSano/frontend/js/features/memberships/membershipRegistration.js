import { MembersAPI } from "../../api/members.js";
import { MembershipsAPI } from "../../api/memberships.js";
import { setupMembershipSelector } from "../members/membershipSelector.js";
import { calcularDescuentos } from "../members/costCalculator.js";
import { PaymentAPI } from "../../api/payments.js"; // NUEVO 

document.addEventListener("DOMContentLoaded", async () => {
    await membershipRegistration();
});

export async function membershipRegistration() {
    const form = document.getElementById("membershipForm");
    const btnSelectMembership = document.getElementById("btnSelectMembership");
    const btnPagar = document.getElementById("btnPagar"); // ✅ nuevo botón en el HTML
    const btnRegistrar = form.querySelector('button[type="submit"]');

    const inputTipo = document.getElementById("membresiaTipo");
    const inputId = document.getElementById("membresiaId");
    const costoBaseSpan = document.getElementById("costoBase");
    const descuentoSpan = document.getElementById("descuento");
    const totalPagarSpan = document.getElementById("totalPagar");

    /*// --- Modal de pago ---
    const modal = document.getElementById("paymentModal");
    const btnConfirmarPago = document.getElementById("btnConfirmarPago");
    const btnCancelarPago = document.getElementById("btnCancelarPago");
    const resumenTipo = document.getElementById("resumenTipo");
    const resumenTotal = document.getElementById("resumenTotal");
    const metodoPagoSelect = document.getElementById("metodoPago");*/

    let membresiaSeleccionada = null;
    let pagoRealizado = null;

    btnRegistrar.disabled = true;

    // Configuramos el selector, pero NO lo abrimos automáticamente
    const membershipSelector = setupMembershipSelector(async (membresia) => {
        membresiaSeleccionada = membresia;

        const dni = form.dni.value.trim();
        if (!dni) return showAlert("Ingrese el DNI antes de seleccionar una membresía.", "warning");
        try {
            const miembro = await MembersAPI.getByDni(dni);
            if (!miembro) throw new Error("Miembro no encontrado");

            // Calculamos descuentos
            const miembroTemp = {
                fechaNacimiento: miembro.fechaNacimiento,
                esEstudiante: form.querySelector('input[name="esEstudiante"]')?.checked || false,
            };

            const { descuento, total } = calcularDescuentos(miembroTemp, membresia);

            // Actualizamos el resumen
            inputTipo.value = membresia.tipo;
            inputId.value = membresia.id || "";
            costoBaseSpan.textContent = `$${membresia.costo}`;
            descuentoSpan.textContent = `${descuento}%`;
            totalPagarSpan.textContent = `$${total.toFixed(2)}`;

            // Mostrar botón de pago
            document.getElementById("btnPagarContainer").classList.remove("hidden");
        } catch (error) {
            console.error("Error al buscar el miembro:", error);
            showError("Ocurrió un error al obtener el miembro: " + error.message);
        }
    });

    // ✅ El modal se abrirá SOLO cuando el usuario haga clic en el botón
    btnSelectMembership.addEventListener("click", async () => {
        const dni = form.dni.value.trim();

        if (!dni) {
            showAlert("Primero ingrese el DNI del miembro a asignar la membresía.", "warning");
            return;
        }

        try {
            const miembro = await MembersAPI.getByDni(dni);

            if (!miembro) {
                showAlert("No se encontró ningún miembro con ese DNI. Por favor registre al miembro primero.", "warning");
                return;
            }

            // Ahora sí, abrimos el modal al hacer clic
            membershipSelector.open();

        } catch (error) {
            console.error("Error al buscar el miembro:", error);
            showError("Ocurrió un error al verificar el miembro. Intente nuevamente.");
        }
    });

    // === Pago usando SweetAlert2 ===
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

        if (!metodo) return; // Si canceló

        try {
            const pago = await PaymentAPI.create({
                fecha: new Date().toISOString(),
                monto: parseFloat(totalPagarSpan.textContent.replace("$", "")),
                metodoPago: metodo,
                membresiaId: null,
            });

            pagoRealizado = pago;
            showSuccess(`Pago realizado correctamente (${metodo}). Ahora puede registrar la membresía.`);
            btnPagar.disabled = true;
            btnRegistrar.disabled = false;

        } catch (err) {
            pagoRealizado = null;
            showError("Error al procesar el pago: " + err.message);
        }
    });


    // === Envío final: crear membresía solo si hay pago ===
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!membresiaSeleccionada) {
            showAlert("Debe seleccionar una membresía antes de registrar.", "warning");
            return;
        }
        if (!pagoRealizado) {
            showAlert("Debe realizar el pago antes de registrar la membresía.", "warning");
            return;
        }

        try {
            const miembro = await MembersAPI.getByDni(form.dni.value);

            const nuevaMembresia = await MembershipsAPI.create({
                MiembroId: miembro.id,
                Tipo: membresiaSeleccionada.tipo,
                CostoBase: membresiaSeleccionada.costo,
                EsEstudiante: form.querySelector('input[name="esEstudiante"]').checked
            });

            await PaymentAPI.update(pagoRealizado.id, {
                membresiaId: nuevaMembresia.id
            });

            showSuccess(`Membresía "${nuevaMembresia.tipo}" registrada correctamente para "${miembro.nombre}".`);

            // Reset visual
            form.reset();
            membresiaSeleccionada = null;
            pagoRealizado = null;
            btnRegistrar.disabled = true;
            btnPagar.disabled = false;
            document.getElementById("btnPagarContainer").classList.add("hidden");
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
