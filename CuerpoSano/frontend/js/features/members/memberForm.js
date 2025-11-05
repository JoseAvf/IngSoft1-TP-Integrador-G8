import { MembersAPI } from "../../api/members.js";
import { MembershipsAPI } from "../../api/memberships.js";
import { PaymentAPI } from "../../api/payments.js"; // NUEVO 
import { setupMembershipSelector } from "./membershipSelector.js";
import { calcularDescuentos } from "./costCalculator.js";

export function setupMemberForm() {
    const form = document.getElementById("memberForm");
    const btnSelectMembership = document.getElementById("btnSelectMembership");
    const btnPagar = document.getElementById("btnPagar"); // 🔹 nuevo botón en el HTML
    const btnCrear = form.querySelector('button[type="submit"]');

    const inputTipo = document.getElementById("membresiaTipo");
    const inputId = document.getElementById("membresiaId");
    const costoBaseSpan = document.getElementById("costoBase");
    const descuentoSpan = document.getElementById("descuento");
    const totalPagarSpan = document.getElementById("totalPagar");

    const modal = document.getElementById("paymentModal");
    const btnConfirmarPago = document.getElementById("btnConfirmarPago");
    const btnCancelarPago = document.getElementById("btnCancelarPago");
    const resumenTipo = document.getElementById("resumenTipo");
    const resumenTotal = document.getElementById("resumenTotal");
    const metodoPagoSelect = document.getElementById("metodoPago");

    let membresiaSeleccionada = null;
    let pagoRealizado = null; // 🔹 para guardar el pago confirmado

    // Inicialmente ocultamos y deshabilitamos
    btnCrear.disabled = true;


    // --- Validación de DNI antes de abrir selector de membresía ---
    btnSelectMembership.addEventListener("click", async () => {
        const dni = form.dni.value.trim();
        const fechaNacimiento = form.fechaNacimiento.value;

        if (!dni) {
            alert("Debe ingresar un DNI antes de seleccionar la membresía.");
            return;
        }
        if (!fechaNacimiento) {
            alert("Debe ingresar la fecha de nacimiento antes de seleccionar la membresía.");
            return;
        }

        try {
            const miembroExistente = await MembersAPI.getByDni(dni);
            if (miembroExistente) {
                alert(`⚠️ Ya existe un miembro registrado con el DNI ${dni}.`);
                return;
            }
        } catch (err) {
            // Si la API devuelve 404 está bien, significa que no existe
            if (err.message && !err.message.includes("404")) {
                console.error("Error verificando DNI:", err);
                alert("Ocurrió un error al verificar el DNI. Intente nuevamente.");
                return;
            }
        }

        membershipSelector.open();
    });

    // Configuramos el selector de membresía
    const membershipSelector = setupMembershipSelector((membresia) => {
        membresiaSeleccionada = membresia;

        // Calculamos descuentos basados en edad/estudiante
        const miembroTemp = {
            fechaNacimiento: form.fechaNacimiento.value,
            esEstudiante: form.querySelector('input[name="esEstudiante"]')?.checked || false,
        };
        const { descuento, total } = calcularDescuentos(miembroTemp, membresia);

        // Mostramos resumen
        inputTipo.value = membresia.tipo;
        inputId.value = membresia.id;
        costoBaseSpan.textContent = `$${membresia.costo}`;
        descuentoSpan.textContent = `${descuento}%`;
        totalPagarSpan.textContent = `$${total.toFixed(2)}`;

        // Mostrar botón de pago
        document.getElementById("btnPagarContainer").classList.remove("hidden");
    });

    

    // === Paso intermedio: Pago ===
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
        const metodo = metodoPagoSelect.value;
        if (!metodo) return alert("Seleccione un método de pago.");

        modal.classList.add("hidden");

        // Simulación de pago (podrías reemplazarlo con un POST real)
        try {
            const pago = await PaymentAPI.create({
                fecha: new Date().toISOString(),
                monto: parseFloat(totalPagarSpan.textContent.replace("$", "")),
                metodoPago: metodo,
                membresiaId: null // se asocia luego
            });

            pagoRealizado = pago;
            alert(`✅ Pago realizado correctamente (${metodo}). Ahora puede crear el miembro.`);

            btnPagar.disabled = true;
            btnCrear.disabled = false;

        } catch (err) {
            alert("Error al procesar el pago: " + err.message);
        }
    });

    // Evento submit: crear miembro y membresía
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!membresiaSeleccionada) {
            alert("Debe seleccionar una membresía antes de registrar el miembro.");
            return;
        }
        if (!pagoRealizado) {
            alert("Debe realizar el pago antes de crear el miembro.");
            return;
        }

        try {
            // Datos del miembro
            const nuevoMiembroData = {
                nombre: form.nombre.value.trim(),
                dni: form.dni.value.trim(),
                direccion: form.direccion.value.trim(),
                telefono: parseInt(form.telefono.value.trim()),
                fechaNacimiento: form.fechaNacimiento.value,
                correo: form.correo.value.trim(),
                esEstudiante: form.querySelector('input[name="esEstudiante"]').checked
            };

            // Crear miembro
            const miembroCreado = await MembersAPI.create(nuevoMiembroData);

            // Crear membresía asociada
            const nuevaMembresia = await MembershipsAPI.create({
                MiembroId: miembroCreado.id,
                Tipo: membresiaSeleccionada.tipo,
                CostoBase: membresiaSeleccionada.costo,
                EsEstudiante: form.querySelector('input[name="esEstudiante"]').checked,
            });

            // // Actualizar pago: asociar con membresía y marcar pagada
            await PaymentAPI.update(pagoRealizado.id, {
                membresiaId: nuevaMembresia.id
            });


            // Mostrar mensaje de éxito
            alert(`✅ Miembro "${miembroCreado.nombre}" registrado con membresía "${nuevaMembresia.tipo}", con costo de $${nuevaMembresia.costo}.`);

            // Reset formulario y resumen
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
            alert("Error al registrar miembro o membresía: " + err.message);
        }
    });
}
