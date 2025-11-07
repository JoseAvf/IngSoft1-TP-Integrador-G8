import { ClassAPI } from "../../api/classes.js";

document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector("tbody");
    const monthSelect = document.getElementById("monthSelect");

    let asistenciasTotales = [];

    try {
        // 🔹 1. Obtener todas las clases
        const clases = await ClassAPI.getAll();

        // 🔹 2. Obtener asistencias de cada clase
        for (const clase of clases) {
            try {
                const datos = await ClassAPI.getAsistencias(clase.id);

                // ---- Entrenador ----
                if (datos.entrenador) {
                    asistenciasTotales.push({
                        tipo: "Entrenador",
                        nombre: datos.entrenador.nombre,
                        clase: datos.claseNombre,
                        fecha: datos.fecha,
                        asistio: datos.entrenador.asistio
                    });
                }

                // ---- Miembros ----
                for (const m of datos.miembros) {
                    asistenciasTotales.push({
                        tipo: "Miembro",
                        nombre: m.nombre,
                        clase: datos.claseNombre,
                        fecha: datos.fecha,
                        asistio: m.asistio
                    });
                }

            } catch (error) {
                console.warn(`Error obteniendo asistencias de clase ${clase.id}:`, error);
            }
        }

        // 🔹 3. Renderizar tabla
        renderTable(asistenciasTotales);

    } catch (error) {
        console.error("Error al cargar las clases o asistencias:", error);
        tableBody.innerHTML = `<tr><td colspan="5">⚠️ Error al cargar los datos.</td></tr>`;
    }

    // ============================
    // 🔹 Función para renderizar
    // ============================
    function renderTable(data) {
        tableBody.innerHTML = "";
        if (!data.length) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No hay registros disponibles</td></tr>`;
            return;
        }

        data.forEach((a, i) => {
            const fecha = new Date(a.fecha).toLocaleDateString();
            const row = `
                <tr>
                    <td>${i + 1}</td>
                    <td>${a.tipo}</td>
                    <td>${a.nombre}</td>
                    <td>${a.clase}</td>
                    <td>${fecha}</td>
                    <td>${a.asistio ? "✅ Asistió" : "❌ No asistió"}</td>
                </tr>`;
            tableBody.insertAdjacentHTML("beforeend", row);
        });
    }

    // ============================
    // 🔹 Filtro por mes
    // ============================
    if (monthSelect) {
        monthSelect.addEventListener("change", () => {
            const month = monthSelect.value;
            const filtradas =
                month === "all"
                    ? asistenciasTotales
                    : asistenciasTotales.filter(a => new Date(a.fecha).getMonth() + 1 == month);

            renderTable(filtradas);
        });
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

    // Inicializar al cargar
    updatePrintMonth();

    // Actualizar cuando cambie el select
    monthSelect.addEventListener("change", updatePrintMonth);
});
