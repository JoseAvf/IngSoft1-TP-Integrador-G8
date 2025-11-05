import { PaymentAPI } from "../../api/payments.js";
import { MembershipsAPI } from "../../api/memberships.js";

document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector("#incomeTable tbody");
    const totalEl = document.getElementById("totalIncome");
    const monthSelect = document.getElementById("monthSelect");

    let pagos = [];

    try {
        pagos = await PaymentAPI.getAll();

        for (const pago of pagos) {
            if (!pago.membresiaId) {
                pago.membresiaNombre = "—";
                pago.miembroNombre = "—";
                continue;
            }

            try {
                const membresia = await MembershipsAPI.getById(pago.membresiaId);
                pago.membresiaNombre = membresia?.tipo || "—";
                pago.miembroNombre = membresia?.nombre || "—";
            } catch (error) {
                console.warn(`No se pudo obtener la membresía ${pago.membresiaId}:`, error);
                pago.membresiaNombre = "Eliminada";
                pago.miembroNombre = "Desconocido";
            }
        }

        renderTable(pagos);
        calcularTotal(pagos);
        updatePrintTotal(pagos);
    } catch (error) {
        console.error("Error al obtener los pagos:", error);
        tableBody.innerHTML = `<tr><td colspan="6">⚠️ Error al cargar los datos.</td></tr>`;
    }

    // ===========================
    // 🔹 Funciones auxiliares
    // ===========================
    function renderTable(data) {
        tableBody.innerHTML = "";
        if (!data.length) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No hay registros disponibles</td></tr>`;
            return;
        }

        data.forEach((p, i) => {
            const row = `
                <tr>
                    <td>${i + 1}</td>
                    <td>${p.miembroNombre}</td>
                    <td>${p.membresiaNombre}</td>
                    <td>${p.metodoPago}</td>
                    <td>$${p.monto.toFixed(2)}</td>
                    <td>${new Date(p.fechaPago).toLocaleDateString()}</td>
                </tr>`;
            tableBody.insertAdjacentHTML("beforeend", row);
        });
    }

    function calcularTotal(data) {
        const total = data.reduce((sum, p) => sum + (p.monto || 0), 0);
        totalEl.textContent = `$ ${total.toFixed(2)}`;
        updatePrintTotal(data);
    }

    // ===== Mostrar mes seleccionado al imprimir =====
    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    function updatePrintMonth() {
        const month = monthSelect.value;
        const printMonthDiv = document.getElementById("printMonth");

        if (month === "all") {
            printMonthDiv.textContent = "Mes: Todos los meses";
        } else {
            printMonthDiv.textContent = `Mes: ${monthNames[month - 1]}`;
        }
    }

    function updatePrintTotal(data) {
        const printTotalDiv = document.getElementById("printTotal");
        const total = data.reduce((sum, p) => sum + (p.monto || 0), 0);
        printTotalDiv.textContent = `Total Recaudado: $ ${total.toFixed(2)}`;
    }

    // 🔹 Filtro por mes
    if (monthSelect) {
        monthSelect.addEventListener("change", () => {
            const month = monthSelect.value;
            const filtered =
                month === "all"
                    ? pagos
                    : pagos.filter((p) => new Date(p.fechaPago).getMonth() + 1 == month);
            renderTable(filtered);
            calcularTotal(filtered);
            updatePrintMonth();
        });
    }

    // Inicializar al cargar
    updatePrintMonth();
});
