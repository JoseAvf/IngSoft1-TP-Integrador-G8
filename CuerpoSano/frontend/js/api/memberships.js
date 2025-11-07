import { API_BASE_URL } from "./config.js";

export const MembershipsAPI = {
    async getAll() {
        const response = await fetch(`${API_BASE_URL}/Membresias`);
        if (!response.ok) throw new Error("Error al obtener membresías");
        return await response.json();
    },

    async getById(id) {
        const response = await fetch(`${API_BASE_URL}/Membresias/${id}`);
        if (!response.ok) throw new Error("Error al obtener membresía");
        return await response.json();
    },

    async create(data) {
        const response = await fetch(`${API_BASE_URL}/Membresias`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || "Error al crear membresía");
        }
        return await response.json();
    },

    async delete(id) {
        const response = await fetch(`${API_BASE_URL}/Membresias/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Error al eliminar membresía");
    },

    async update(id, membershipDate) {
        const response = await fetch(`${API_BASE_URL}/Membresias/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(membershipDate),
        });
        if (!response.ok) throw new Error("Error al actualizar miembro");
        return await response.json();
    },

    /** Pausar membresía */
    async pause(id, inicioPausa) {
        const response = await fetch(
            `${API_BASE_URL}/Membresias/pausar/${id}?inicioPausa=${encodeURIComponent(inicioPausa)}`,
            { method: "PUT" }
        );

        if (!response.ok) {
            const err = await response.text();
            throw new Error(err || "Error al pausar membresía");
        }

        return await response.json();
    },

    /** Despausar membresía */
    async unpause(id) {
        const response = await fetch(`${API_BASE_URL}/Membresias/despausar/${id}`, {
            method: "PUT",
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(err || "Error al despausar membresía");
        }

        return await response.json();
    },

    /** actualizo cambos cuando recibo los datos de la membresia, estado de pago de membresía */
  // actualiza estado de pago (en backend y en pantalla)
async updatePaymentStatus(id, pagada) {
    try {
        // 1️⃣ Enviar cambio al backend
        const response = await fetch(`${API_BASE_URL}/Membresias/estadoPago/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pagada }),
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(err || "Error al actualizar estado de pago");
        }

        const updatedData = await response.json();

        // 2️⃣ Actualizar visualmente la sección de pago
        const contenedor = document.getElementById('paymentStatus');
        contenedor.classList.remove('hidden');
        document.getElementById('lastPaymentDate').textContent = updatedData.fechaUltimoPago || '—';
        document.getElementById('paymentState').textContent = updatedData.pagada ? 'Pagada' : 'Pendiente';
        
        // Cambiar color según el estado
        if (updatedData.pagada) contenedor.classList.add('paid');
        else contenedor.classList.remove('paid');

        return updatedData;

    } catch (error) {
        console.error("Error al actualizar pago:", error);
        alert("Hubo un error al actualizar el estado del pago.");
    }
}
};
