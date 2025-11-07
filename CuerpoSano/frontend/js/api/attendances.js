// frontend/js/api/attendance.js
import { API_BASE_URL } from "./config.js";

export const AttendanceAPI = {
    /** Registrar asistencia de un miembro */
    async registrarAsistenciaMiembro(claseId, miembroId, asistio) {
        const params = new URLSearchParams({ claseId, miembroId, asistio });
        const response = await fetch(`${API_BASE_URL}/Asistencias/miembro?${params.toString()}`, {
            method: "POST",
        });
        const text = await response.text();
        if (!response.ok) throw new Error(text || "Error al registrar asistencia del miembro");
        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    },

    /** Registrar asistencia de un entrenador */
    async registrarAsistenciaEntrenador(claseId, entrenadorId, asistio) {
        const params = new URLSearchParams({ claseId, entrenadorId, asistio });
        const response = await fetch(`${API_BASE_URL}/Asistencias/entrenador?${params.toString()}`, {
            method: "POST",
        });
        const text = await response.text();
        if (!response.ok) throw new Error(text || "Error al registrar asistencia del entrenador");
        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    },

    /** Registrar inasistencias pendientes de una clase */
    async registrarInasistenciasPendientes(claseId) {
        const response = await fetch(`${API_BASE_URL}/Asistencias/registrar-inasistencias/${claseId}`, {
            method: "POST",
        });
        const text = await response.text();
        if (!response.ok) throw new Error(text || "Error al registrar inasistencias pendientes");
        return text;
    },
};
