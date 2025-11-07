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

    // --- Modal de pago ---
    const modal = document.getElementById("paymentModal");
    const btnConfirmarPago = document.getElementById("btnConfirmarPago");
    const btnCancelarPago = document.getElementById("btnCancelarPago");
    const resumenTipo = document.getElementById("resumenTipo");
    const resumenTotal = document.getElementById("resumenTotal");
    const metodoPagoSelect = document.getElementById("metodoPago");

    let membresiaSeleccionada = null;
    let pagoRealizado = null;

    btnRegistrar.disabled = true;

    // Configuramos el selector, pero NO lo abrimos automáticamente
    const membershipSelector = setupMembershipSelector(async (membresia) => {
        membresiaSeleccionada = membresia;

        const dni = form.dni.value.trim();
        if (!dni) return alert("Ingrese el DNI antes de seleccionar una membresía.");

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
    });

    // ✅ El modal se abrirá SOLO cuando el usuario haga clic en el botón
    btnSelectMembership.addEventListener("click", async () => {
        const dni = form.dni.value.trim();

        if (!dni) {
            alert("⚠️ Primero ingrese el DNI del miembro a asignar la membresía.");
            return;
        }

        try {
            const miembro = await MembersAPI.getByDni(dni);

            if (!miembro) {
                alert("❌ No se encontró ningún miembro con ese DNI. Por favor registre al miembro primero.");
                return;
            }

            // Ahora sí, abrimos el modal al hacer clic
            membershipSelector.open();

        } catch (error) {
            console.error("Error al buscar el miembro:", error);
            alert("Ocurrió un error al verificar el miembro. Intente nuevamente.");
        }
    });

    // === Modal de pago ===
    btnPagar.addEventListener("click", () => {
        if (!membresiaSeleccionada) return alert("Seleccione una membresía.");
        resumenTipo.textContent = membresiaSeleccionada.tipo;
        resumenTotal.textContent = totalPagarSpan.textContent;
        modal.classList.remove("hidden");
    });

    btnCancelarPago.addEventListener("click", () => {
        modal.classList.add("hidden");
        metodoPagoSelect.value = "";
    });

    btnConfirmarPago.addEventListener("click", async () => {

        console.log("1");
        const metodo = metodoPagoSelect.value;
        if (!metodo) return alert("Seleccione un método de pago.");

        modal.classList.add("hidden");
        console.log("2");
        try {
            console.log("3");
            const pago = await PaymentAPI.create({
                fecha: new Date().toISOString(),
                monto: parseFloat(totalPagarSpan.textContent.replace("$", "")),
                metodoPago: metodo,
                membresiaId: null // se asocia luego
            });
            console.log("4");
            pagoRealizado = pago;
            alert(`✅ Pago registrado correctamente (${metodo}). Ahora puede registrar la nueva membresía.`);
            btnRegistrar.disabled = false;
            btnPagar.disabled = true;

        } catch (err) {
            pagoRealizado = null;
            alert("❌ Error al procesar el pago. No se podrá continuar con el registro.");
        }
    });



    // === Envío final: crear membresía solo si hay pago ===
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!membresiaSeleccionada) {
            alert("Debe seleccionar una membresía antes de registrar.");
            return;
        }
        if (!pagoRealizado) {
            alert("Debe realizar el pago antes de registrar la membresía.");
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

            alert(`✅ Membresía "${nuevaMembresia.tipo}" registrada correctamente para "${miembro.nombre}".`);

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
            alert("❌ Error al registrar la membresía: " + err.message);
        }
    });
}
