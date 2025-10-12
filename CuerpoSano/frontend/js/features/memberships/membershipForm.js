import { MembershipsAPI } from "../../api/memberships.js";
import { validateMembershipForm } from "../../utils/validations.js";

export async function setupMembershipForm() {
    const form = document.getElementById("membershipForm");
    const resultBox = document.getElementById("membershipFormResult");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            tipo: form.tipo.value.trim(),
            costoBase: parseFloat(form.costoBase.value),
            mesesDuracion: parseInt(form.mesesDuracion.value),
            miembroId: parseInt(form.miembroId.value),
        };
        const errors = validateMembershipForm(data);
        if (errors.length > 0) {
            resultBox.textContent = errors.join(" | ");
            resultBox.classList.add("error");
            return;
        }
        try {
            const nueva = await MembershipsAPI.create(data);
            resultBox.textContent = `✅ Membresía "${nueva.tipo}" creada correctamente para el miembro #${nueva.miembroId}`;
            resultBox.classList.remove("error");
            resultBox.classList.add("success");
            form.reset();

            // 🔔 Lanzar evento global
            const event = new CustomEvent("membershipCreated", { detail: nueva });
            window.dispatchEvent(event);

        } catch (err) {
            resultBox.textContent = `❌ ${err.message}`;
            resultBox.classList.add("error");
        }
    });
}
