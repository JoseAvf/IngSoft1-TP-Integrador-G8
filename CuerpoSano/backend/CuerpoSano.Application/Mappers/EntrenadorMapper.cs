using CuerpoSano.Application.DTOs.Response;
using CuerpoSano.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.Mappers
{
    public static class EntrenadorMapper
    {
        public static EntrenadorResponse ToResponse(this Entrenador entrenador)
        {
            return new EntrenadorResponse
            {
                Id = entrenador.Id,
                Nombre = entrenador.Nombre,
                DNI = entrenador.DNI,
                Direccion = entrenador.Direccion,
                Telefono = entrenador.Telefono,
                FechaNacimiento = entrenador.FechaNacimiento,
                Clases = entrenador.Clases?.Select(c => c.ToResponseEntrenador()).ToList() ?? new List<ClaseEntrenadorResponse>(), 
                CertificadoId = entrenador.CertificadoId
            };
        }

        public static IEnumerable<EntrenadorResponse> ToResponseList(this IEnumerable<Entrenador> entrenadores)
        {
            return entrenadores.Select(e => e.ToResponse());
        }
    }

}
