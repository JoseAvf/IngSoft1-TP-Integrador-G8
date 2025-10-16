import { MembersAPI } from "../../api/members.js";
import { MembershipsAPI } from "../../api/memberships.js";
import { setupMembershipSelector } from "../memberRegistration/membershipSelector.js";
import { calcularDescuentos } from "../memberRegistration/costCalculator.js";

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

    // Configuramos el selector de membresía
    const membershipSelector = setupMembershipSelector(async (membresia) => {
        membresiaSeleccionada = membresia;

        const miembro = await MembersAPI.getByDni(form.dni.value);

        if (!miembro) throw new Error("Miembro no encontrado");

        // Calculamos descuentos basados en edad/estudiante
        const miembroTemp = {
            fechaNacimiento: miembro.fechaNacimiento,
            esEstudiante: form.querySelector('input[name="esEstudiante"]')?.checked || false,
        };
        const { descuento, total } = calcularDescuentos(miembroTemp, membresia);

        // Mostramos resumen
        inputTipo.value = membresia.tipo;
        inputId.value = membresia.id;
        costoBaseSpan.textContent = `$${membresia.costo}`;
        descuentoSpan.textContent = `${descuento}%`;
        totalPagarSpan.textContent = `$${total.toFixed(2)}`;
    });

    btnSelectMembership.addEventListener("click", async () => {
        const dni = form.dni.value.trim();

        if (!dni) {
            alert("⚠️ Primero ingrese el DNI del miembro a asignar la membresía.");
            return;
        }

        try {
            // Verificar si el miembro existe
            const miembro = await MembersAPI.getByDni(dni);

            if (!miembro) {
                alert("❌ No se encontró ningún miembro con ese DNI. Por favor registre al miembro primero.");
                return;
            }

            // Si el miembro existe, abrimos el modal normalmente
            membershipSelector.open();

        } catch (error) {
            console.error("Error al buscar el miembro:", error);
            alert("Ocurrió un error al verificar el miembro. Intente nuevamente.");
        }
    });


    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!membresiaSeleccionada) {
            alert("Debe seleccionar una membresía antes de registrar el miembro.");
            return;
        }

        const miembro = await MembersAPI.getByDni(form.dni.value);

        try {
            // Crear membresía asociada
            const nuevaMembresia = await MembershipsAPI.create({
                MiembroId: miembro.id,
                Tipo: membresiaSeleccionada.tipo,
                CostoBase: membresiaSeleccionada.costo,
                EsEstudiante: form.querySelector('input[name="esEstudiante"]').checked
            });

            // Mostrar mensaje de éxito
            alert(`✅ Miembro "${miembro.nombre}" registrado con membresía "${nuevaMembresia.tipo}", con costo de $${nuevaMembresia.costo}.`);

            // Reset formulario y resumen
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
