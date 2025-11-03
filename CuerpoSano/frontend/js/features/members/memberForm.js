import { MembersAPI } from "../../api/members.js";
import { MembershipsAPI } from "../../api/memberships.js";
import { setupMembershipSelector } from "./membershipSelector.js";
import { calcularDescuentos } from "./costCalculator.js";

export function setupMemberForm() {
    const form = document.getElementById("memberForm");
    const btnSelectMembership = document.getElementById("btnSelectMembership");

    const inputTipo = document.getElementById("membresiaTipo");
    const inputId = document.getElementById("membresiaId");
    const costoBaseSpan = document.getElementById("costoBase");
    const descuentoSpan = document.getElementById("descuento");
    const totalPagarSpan = document.getElementById("totalPagar");

    let membresiaSeleccionada = null;

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
    });

    btnSelectMembership.addEventListener("click", () => {
        if (!form.fechaNacimiento.value) {
            alert("Primero ingrese la fecha de nacimiento para calcular descuentos.");
            return;
        }
        membershipSelector.open();
    });

    // Evento submit: crear miembro y membresía
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!membresiaSeleccionada) {
            alert("Debe seleccionar una membresía antes de registrar el miembro.");
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
                EsEstudiante: form.querySelector('input[name="esEstudiante"]').checked
            });

            // Mostrar mensaje de éxito
            alert(`✅ Miembro "${miembroCreado.nombre}" registrado con membresía "${nuevaMembresia.tipo}", con costo de $${nuevaMembresia.costo}.`);

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
