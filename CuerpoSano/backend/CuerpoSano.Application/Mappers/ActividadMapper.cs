using CuerpoSano.Application.DTOs.Response;
using CuerpoSano.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.Mappers
{
    public static class ActividadMapper
    {
        public static ActividadResponse ToResponse(this Actividad actividad)
        {
            return new ActividadResponse
            {
                Id = actividad.Id,
                Nombre = actividad.Nombre,
                Activa = actividad.Activa, 
                Clases = actividad.Clases.Select(c => c.ToResponseActividad()).ToList() ?? new List<ClaseActividadResponse>(),
            };
        }

        public static IEnumerable<ActividadResponse> ToResponseList(this IEnumerable<Actividad> actividades)
        {
            return actividades.Select(a => a.ToResponse());
        }
    }

}
