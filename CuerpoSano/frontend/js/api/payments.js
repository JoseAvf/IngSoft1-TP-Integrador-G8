// frontend/js/api/activities.js
import { API_BASE_URL } from "./config.js";

export const PaymentAPI = {
    /** Obtener todos los pagos */
    async getAll() {
        const response = await fetch(`${API_BASE_URL}/Pagos`);
        if (!response.ok) throw new Error("Error al obtener los pagos");
        return await response.json();
    },

    /** Obtener un pago por ID */
    async getById(id) {
        const response = await fetch(`${API_BASE_URL}/Pagos/${id}`);
        if (response.status === 404) return null;
        if (!response.ok) throw new Error("Error al obtener el pago");
        return await response.json();
    },

    /** Crear una nuevo pago */
    async create(data) {
        const response = await fetch(`${API_BASE_URL}/Pagos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(err || "Error al crear el pago");
        }
        return await response.json();
    },

    /** Actualizar un pago */
    async update(id, data) {
        const res = await fetch(`${API_BASE_URL}/Pagos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Error al actualizar pago");
        return res.json();
    }

};