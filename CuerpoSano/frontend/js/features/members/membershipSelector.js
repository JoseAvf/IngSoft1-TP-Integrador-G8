import { openModal, closeModal, setupModalCloseHandlers } from "../../utils/modal.js";

export function setupMembershipSelector(onSelect) {
    const modalId = "membershipModal";
    const tbody = document.querySelector(`#${modalId} tbody`);

    setupModalCloseHandlers(modalId);

    // Opciones fijas de membresía
    const MEMBERSHIP_OPTIONS = [
        { tipo: "Diaria", costo: 500 },
        { tipo: "Semanal", costo: 1500 },
        { tipo: "Mensual", costo: 5000 },
        { tipo: "Anual", costo: 50000 },
    ];

    function loadMemberships() {
        tbody.innerHTML = "";

        MEMBERSHIP_OPTIONS.forEach((m) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${m.tipo}</td>
                <td>${m.tipo === "Diaria" ? 1 : m.tipo === "Semanal" ? 7 : m.tipo === "Mensual" ? 30 : 365} días</td>
                <td>$${m.costo}</td>
                <td><button class="btnSelect">Seleccionar</button></td>
            `;
            tbody.appendChild(tr);

            tr.querySelector(".btnSelect").addEventListener("click", () => {
                onSelect(m);
                closeModal(modalId);
            });
        });
    }

    return {
        open: () => {
            openModal(modalId);
            loadMemberships();
        },
    };
}
