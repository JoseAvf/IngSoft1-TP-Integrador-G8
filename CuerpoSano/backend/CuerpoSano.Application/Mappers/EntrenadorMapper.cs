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
                Clases = entrenador.Clases?.Select(c => c.ToResponsePersona()).ToList() ?? new List<ClasePersonaResponse>(), 
                CertificadoId = entrenador.CertificadoId
            };
        }

        public static EntrenadorDetalleResponse ToDetalleResponse(this Entrenador entrenador)
        {
            return new EntrenadorDetalleResponse
            {
                Id = entrenador.Id,
                Nombre = entrenador.Nombre,
                DNI = entrenador.DNI,
                Direccion = entrenador.Direccion,
                Telefono = entrenador.Telefono,
                FechaNacimiento = entrenador.FechaNacimiento,
                Clases = entrenador.Clases?.Select(c => c.ToResponsePersona()).ToList() ?? new List<ClasePersonaResponse>(),
                CertificadoId = entrenador.CertificadoId,
                CodigoCertificado = entrenador.Certificado.CodCertificado,
                Vigencia = entrenador.Certificado.Vigencia,
                FechaEmision = entrenador.Certificado.FechaEmision,
                FechaVencimiento = entrenador.Certificado.FechaVencimiento
            };
        }

        public static IEnumerable<EntrenadorResponse> ToResponseList(this IEnumerable<Entrenador> entrenadores)
        {
            return entrenadores.Select(e => e.ToResponse());
        }
    }

}
