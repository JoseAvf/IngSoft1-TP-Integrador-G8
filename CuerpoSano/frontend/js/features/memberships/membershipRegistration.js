import { MembersAPI } from "../../api/members.js";
import { MembershipsAPI } from "../../api/memberships.js";
import { setupMembershipSelector } from "../members/membershipSelector.js";
import { calcularDescuentos } from "../members/costCalculator.js";

document.addEventListener("DOMContentLoaded", async () => {
    await membershipRegistration();
});

export async function membershipRegistration() {
    const form = document.getElementById("membershipForm");
    const btnSelectMembership = document.getElementById("btnSelectMembership");

    const inputTipo = document.getElementById("membresiaTipo");
    const inputId = document.getElementById("membresiaId");
    const costoBaseSpan = document.getElementById("costoBase");
    const descuentoSpan = document.getElementById("descuento");
    const totalPagarSpan = document.getElementById("totalPagar");

    let membresiaSeleccionada = null;

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

    // Envío del formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!membresiaSeleccionada) {
            alert("Debe seleccionar una membresía antes de registrar el miembro.");
            return;
        }

        const miembro = await MembersAPI.getByDni(form.dni.value);

        try {
            const nuevaMembresia = await MembershipsAPI.create({
                MiembroId: miembro.id,
                Tipo: membresiaSeleccionada.tipo,
                CostoBase: membresiaSeleccionada.costo,
                EsEstudiante: form.querySelector('input[name="esEstudiante"]').checked
            });

            alert(`✅ Miembro "${miembro.nombre}" registrado con membresía "${nuevaMembresia.tipo}", con costo de $${nuevaMembresia.costo}.`);

            form.reset();
            inputTipo.value = "";
            inputId.value = "";
            costoBaseSpan.textContent = "-";
            descuentoSpan.textContent = "%0";
            totalPagarSpan.textContent = "-";
            membresiaSeleccionada = null;

        } catch (err) {
            alert("Error al registrar miembro o membresía: " + err.message);
        }
    });
}
