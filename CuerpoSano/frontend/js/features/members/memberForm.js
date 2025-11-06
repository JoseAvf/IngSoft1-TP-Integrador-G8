import { MembersAPI } from "../../api/members.js";
import { MembershipsAPI } from "../../api/memberships.js";
import { PaymentAPI } from "../../api/payments.js";
import { setupMembershipSelector } from "./membershipSelector.js";
import { calcularDescuentos } from "./costCalculator.js";

export function setupMemberForm() {
    const form = document.getElementById("memberForm");
    const btnSelectMembership = document.getElementById("btnSelectMembership");
    const btnPagar = document.getElementById("btnPagar");
    const btnCrear = form.querySelector('button[type="submit"]');

    const inputTipo = document.getElementById("membresiaTipo");
    const inputId = document.getElementById("membresiaId");
    const costoBaseSpan = document.getElementById("costoBase");
    const descuentoSpan = document.getElementById("descuento");
    const totalPagarSpan = document.getElementById("totalPagar");

    /*const modal = document.getElementById("paymentModal");
    const btnConfirmarPago = document.getElementById("btnConfirmarPago");
    const btnCancelarPago = document.getElementById("btnCancelarPago");
    const resumenTipo = document.getElementById("resumenTipo");
    const resumenTotal = document.getElementById("resumenTotal");
    const metodoPagoSelect = document.getElementById("metodoPago");*/

    let membresiaSeleccionada = null;
    let pagoRealizado = null;

    btnCrear.disabled = true;

    // --- Validación de DNI antes de abrir selector de membresía ---
    btnSelectMembership.addEventListener("click", async () => {
        const dni = form.dni.value.trim();
        const fechaNacimiento = form.fechaNacimiento.value;

        if (!dni) return showAlert("Debe ingresar un DNI antes de seleccionar la membresía.", "warning");
        if (!fechaNacimiento) return showAlert("Debe ingresar la fecha de nacimiento antes de seleccionar la membresía.", "warning");

        try {
            const miembroExistente = await MembersAPI.getByDni(dni);
            if (miembroExistente) {
                showError(`Ya existe un miembro registrado con el DNI ${dni}.`);
                return;
            }
        } catch (err) {
            if (err.message && !err.message.includes("404")) {
                console.error("Error verificando DNI:", err);
                showError("Ocurrió un error al verificar el DNI. Intente nuevamente.");
                return;
            }
        }

        membershipSelector.open();
    });

    // Configuración del selector de membresías
    const membershipSelector = setupMembershipSelector((membresia) => {
        membresiaSeleccionada = membresia;

        const miembroTemp = {
            fechaNacimiento: form.fechaNacimiento.value,
            esEstudiante: form.querySelector('input[name="esEstudiante"]')?.checked || false,
        };
        const { descuento, total } = calcularDescuentos(miembroTemp, membresia);

        inputTipo.value = membresia.tipo;
        inputId.value = membresia.id;
        costoBaseSpan.textContent = `$${membresia.costo}`;
        descuentoSpan.textContent = `${descuento}%`;
        totalPagarSpan.textContent = `$${total.toFixed(2)}`;

        document.getElementById("btnPagarContainer").classList.remove("hidden");
    });


    // === Paso intermedio: Pago con SweetAlert2 ===
    btnPagar.addEventListener("click", async () => {
        if (!membresiaSeleccionada)
            return showAlert("Seleccione una membresía antes de continuar.", "warning");

        const resumenTipo = membresiaSeleccionada.tipo;
        const resumenTotal = totalPagarSpan.textContent;

        // Mostramos el modal usando SweetAlert2
        const { value: metodo } = await Swal.fire({
            title: "💳 Confirmar Pago",
            html: `
                <div style="text-align:center;">
                    <p style="margin:4px 0;"><strong>Membresía:</strong> ${resumenTipo}</p>
                    <p style="margin:4px 0;"><strong>Total a pagar:</strong> 
                        <span style="color:#007bff;font-size:1.2em;">${resumenTotal}</span>
                    </p>
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

        if (!metodo) return; // Si canceló, no hace nada

        try {
            const pago = await PaymentAPI.create({
                fecha: new Date().toISOString(),
                monto: parseFloat(totalPagarSpan.textContent.replace("$", "")),
                metodoPago: metodo,
                membresiaId: null,
            });

            pagoRealizado = pago;
            showSuccess(`✅ Pago realizado correctamente (${metodo}). Ahora puede crear el miembro.`);

            btnPagar.disabled = true;
            btnCrear.disabled = false;

        } catch (err) {
            showError("Error al procesar el pago: " + err.message);
        }
    });


    // === Creación del miembro y membresía ===
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!membresiaSeleccionada) return showAlert("Debe seleccionar una membresía antes de registrar el miembro.", "warning");
        if (!pagoRealizado) return showAlert("Debe realizar el pago antes de crear el miembro.", "warning");

        try {
            const nuevoMiembroData = {
                nombre: form.nombre.value.trim(),
                dni: form.dni.value.trim(),
                direccion: form.direccion.value.trim(),
                telefono: parseInt(form.telefono.value.trim()),
                fechaNacimiento: form.fechaNacimiento.value,
                correo: form.correo.value.trim(),
                esEstudiante: form.querySelector('input[name="esEstudiante"]').checked,
            };

            const miembroCreado = await MembersAPI.create(nuevoMiembroData);

            const nuevaMembresia = await MembershipsAPI.create({
                MiembroId: miembroCreado.id,
                Tipo: membresiaSeleccionada.tipo,
                CostoBase: membresiaSeleccionada.costo,
                EsEstudiante: form.querySelector('input[name="esEstudiante"]').checked,
            });

            await PaymentAPI.update(pagoRealizado.id, {
                membresiaId: nuevaMembresia.id,
            });

            showSuccess(`Miembro "${miembroCreado.nombre}" registrado con membresía "${nuevaMembresia.tipo}" ($${nuevaMembresia.costo}).`);

            form.reset();
            membresiaSeleccionada = null;
            pagoRealizado = null;
            btnPagar.disabled = false;
            btnCrear.disabled = true;
            document.getElementById("btnPagarContainer").classList.add("hidden");

            inputTipo.value = "";
            inputId.value = "";
            costoBaseSpan.textContent = "-";
            descuentoSpan.textContent = "%0";
            totalPagarSpan.textContent = "-";

        } catch (err) {
            showError("Error al registrar miembro o membresía: " + err.message);
        }
    });
}
