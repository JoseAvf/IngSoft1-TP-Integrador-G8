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

    // === Función para validar si todos los campos obligatorios están completos ===
    function validarCamposCompletos() {
        // Obtener todos los inputs relevantes dentro del formulario
        const inputs = form.querySelectorAll("input[required], input:not([type=checkbox])");

        // Verificar que todos estén llenos y sean válidos según HTML5
        const todosValidos = Array.from(inputs).every(input => {
            // trim() para evitar solo espacios
            const valor = input.value.trim();
            // checkValidity() usa las validaciones nativas (type, pattern, min, max, required, etc.)
            return valor !== "" && input.checkValidity();
        });

        // Habilitar solo si los campos son válidos y hay membresía seleccionada
        btnPagar.disabled = !(todosValidos && membresiaSeleccionada !== null);
    }



    const inputTipo = document.getElementById("membresiaTipo");
    const inputId = document.getElementById("membresiaId");
    const costoBaseSpan = document.getElementById("costoBase");
    const descuentoSpan = document.getElementById("descuento");
    const totalPagarSpan = document.getElementById("totalPagar");

    const fechaInput = document.getElementById("fechaNacimiento");
    const hoy = new Date();
    const min = new Date("1915-01-01");
    const max = new Date("2020-12-31");
    fechaInput.min = min.toISOString().split("T")[0];
    fechaInput.max = max.toISOString().split("T")[0];

    // === Inicialmente los botones bloqueados ===
    btnPagar.disabled = true;
    btnCrear.disabled = true;

    // Validar en tiempo real los campos
    document.querySelectorAll("#memberForm input").forEach(input => {
        input.addEventListener("input", () => {
            input.reportValidity();
            validarCamposCompletos();
        });
    });

    let membresiaSeleccionada = null;
    let pagoRealizado = null;

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

        // 🔓 Habilitar botón de pago
        validarCamposCompletos();

    });

    // 🔁 Recalcular automáticamente si cambia "esEstudiante"
    const estudianteCheck = form.querySelector('input[name="esEstudiante"]');
    estudianteCheck.addEventListener("change", () => {
        if (!membresiaSeleccionada) return;
        const miembroTemp = {
            fechaNacimiento: form.fechaNacimiento.value,
            esEstudiante: estudianteCheck.checked,
        };
        const { descuento, total } = calcularDescuentos(miembroTemp, membresiaSeleccionada);
        descuentoSpan.textContent = `${descuento}%`;
        totalPagarSpan.textContent = `$${total.toFixed(2)}`;
    });

    // === Paso intermedio: Pago con SweetAlert2 ===
    btnPagar.addEventListener("click", async () => {
        if (!membresiaSeleccionada)
            return showAlert("Seleccione una membresía antes de continuar.", "warning");

        const resumenTipo = membresiaSeleccionada.tipo;
        const resumenTotal = totalPagarSpan.textContent;

        const { value: metodo } = await Swal.fire({
            title: "💳 Confirmar Pago",
            html: `
                <div style="text-align:center;">
                    <p><strong>Membresía:</strong> ${resumenTipo}</p>
                    <p><strong>Total a pagar:</strong> 
                        <span style="color:#007bff;font-size:1.2em;">${resumenTotal}</span>
                    </p>
                    <hr>
                    <label for="metodoPagoSelect" style="display:block;margin-bottom:8px;">Método de Pago:</label>
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

        if (!metodo) return;

        try {
            const pago = await PaymentAPI.create({
                fecha: new Date().toISOString(),
                monto: parseFloat(totalPagarSpan.textContent.replace("$", "")),
                metodoPago: metodo,
                membresiaId: null,
            });

            pagoRealizado = pago;

            // 🔄 Mostrar carga de creación automática
            await Swal.fire({
                title: "✅ Pago Realizado",
                text: "Creando usuario...",
                icon: "info",
                allowOutsideClick: false,
                showConfirmButton: false,
                timer: 1800,
                timerProgressBar: true,
                background: "#f9fafb",
                color: "#333"
            });

            btnPagar.disabled = true;
            btnCrear.disabled = false;

            // Simular click automático en "Registrar miembro"
            form.requestSubmit();

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

            await Swal.fire({
                icon: "success",
                title: "Miembro creado correctamente",
                text: `Miembro "${miembroCreado.nombre}" con membresía "${nuevaMembresia.tipo}" ($${nuevaMembresia.costo}).`,
                confirmButtonColor: "#007bff"
            });

            // Reset total
            form.reset();
            membresiaSeleccionada = null;
            pagoRealizado = null;
            btnPagar.disabled = true;
            btnCrear.disabled = true;

            inputTipo.value = "";
            inputId.value = "";
            costoBaseSpan.textContent = "-";
            descuentoSpan.textContent = "%0";
            totalPagarSpan.textContent = "-";
            validarCamposCompletos();

        } catch (err) {
            showError("Error al registrar miembro o membresía: " + err.message);
        }
    });
}
