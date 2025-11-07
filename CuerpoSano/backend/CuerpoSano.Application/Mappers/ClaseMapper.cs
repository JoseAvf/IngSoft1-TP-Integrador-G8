using CuerpoSano.Application.DTOs.Response;
using CuerpoSano.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace CuerpoSano.Application.Mappers
{
    public static class ClaseMapper
    {
        public static ClaseDetalleResponse ToResponse(this Clase clase)
        {
            return new ClaseDetalleResponse
            {
                Id = clase.Id,
                Nombre = clase.Nombre,
                HoraInicio = clase.HoraInicio,
                HoraFin = clase.HoraFin,
                Cupo = clase.Cupo,
                FechaCreacion = clase.FechaCreacion,
                ActividadId = clase.ActividadId,
                ActividadNombre = clase.Actividad?.Nombre ?? "No asignada",
                EntrenadorId = clase.EntrenadorId,
                EntrenadorNombre = clase.Entrenador.Nombre ?? "No asignado",
                InscriptosCount = clase.Miembros.Count
            };
        }

        public static ClaseActividadResponse ToResponseActividad(this Clase clase) 
        {
            return new ClaseActividadResponse
            {
                Id = clase.Id,
                Nombre = clase.Nombre,
                HoraInicio = clase.HoraInicio,
                HoraFin = clase.HoraFin,
                Cupo = clase.Cupo,
                FechaCreacion = clase.FechaCreacion,
                EntrenadorId = clase.EntrenadorId,
                EntrenadorNombre = clase.Entrenador.Nombre ?? "No asignado",
                InscriptosCount = clase.Miembros.Count
            };
        }

        public static ClasePersonaResponse ToResponsePersona(this Clase clase)
        {
            return new ClasePersonaResponse
            {
                Id = clase.Id,
                Nombre = clase.Nombre,
                HoraInicio = clase.HoraInicio,
                HoraFin = clase.HoraFin,
                Cupo = clase.Cupo,
                FechaCreacion = clase.FechaCreacion,
                ActividadId = clase.ActividadId,
                ActividadNombre = clase.Actividad?.Nombre ?? "No asignada",
                InscriptosCount = clase.Miembros.Count
            };
        }

        public static IEnumerable<ClaseDetalleResponse> ToResponseList(this IEnumerable<Clase> clases)
        {
            return clases.Select(c => c.ToResponse());
        }
        public static IEnumerable<ClaseActividadResponse> ToResponseActividadList(this IEnumerable<Clase> clases)
        {
            return clases.Select(c => c.ToResponseActividad());
        }
        public static IEnumerable<ClasePersonaResponse> ToResponsePersonaList(this IEnumerable<Clase> clases)
        {
            return clases.Select(c => c.ToResponsePersona());
        }
    }

}
