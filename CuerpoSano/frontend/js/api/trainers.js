// frontend/js/api/trainers.js
import { API_BASE_URL } from "./config.js";

export const TrainerAPI = {
    /** Obtener todos los entrenadores */
    async getAll() {
        const response = await fetch(`${API_BASE_URL}/Entrenadores`);
        if (!response.ok) throw new Error("Error al obtener entrenadores");
        return await response.json();
    },

    /** Obtener entrenador por ID */
    async getById(id) {
        const response = await fetch(`${API_BASE_URL}/Entrenadores/${id}`);
        if (response.status === 404) return null;
        if (!response.ok) throw new Error("Error al obtener entrenador por ID");
        return await response.json();
    },

    /** Obtener entrenador por DNI */
    async getByDni(dni) {
        const response = await fetch(`${API_BASE_URL}/Entrenadores/dni/${dni}`);
        if (response.status === 404) return null;
        if (!response.ok) throw new Error("Error al obtener entrenador por DNI");
        return await response.json();
    },

    /** Crear un nuevo entrenador */
    async create(data) {
        const response = await fetch(`${API_BASE_URL}/Entrenadores`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(err || "Error al crear entrenador");
        }

        return await response.json();
    },

    /** Actualizar datos de un entrenador */
    async update(id, data) {
        const response = await fetch(`${API_BASE_URL}/Entrenadores/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(err || "Error al actualizar entrenador");
        }

        // El endpoint devuelve NoContent, así que devolvemos true
        return true;
    },

    /** Eliminar un entrenador */
    async delete(id) {
        const response = await fetch(`${API_BASE_URL}/Entrenadores/${id}`, {
            method: "DELETE",
        });
        if (response.status === 404) throw new Error("Entrenador no encontrado");
        if (!response.ok) throw new Error("Error al eliminar entrenador");
        return true;
    },

    /** Obtener los miembros asignados a un entrenador */
    async getMiembrosAsignados(id) {
        const response = await fetch(`${API_BASE_URL}/Entrenadores/${id}/miembros`);
        if (response.status === 404) throw new Error("Entrenador no encontrado");
        if (!response.ok) throw new Error("Error al obtener miembros asignados");

        // En caso de que devuelva un mensaje de texto ("no tiene miembros")
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            const message = await response.text();
            return { message }; // respuesta textual del backend
        }
    },
};
