using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.DTOs.Response
{
    public class MiembroDetalleResponse
    {
        // Datos del miembro
        public int Id { get; set; }
        public string Nombre { get; set; } = null!;
        public string DNI { get; set; } = null!;
        public string Direccion { get; set; } = null!;
        public DateTime FechaNacimiento { get; set; }
        public int Telefono { get; set; }
        public string Correo { get; set; } = null!;

        // Datos del carnet (1:1)
        public string CodigoCarnet { get; set; }
        public DateTime FechaEmisionCarnet { get; set; }

        // Datos de la membresía (1:1)
        public int? MembresiaId { get; set; }
        public string? TipoMembresia { get; set; }
        public DateTime? FechaEmisionMembresia { get; set; }
        public DateTime? FechaVencimientoMembresia { get; set; }
        public decimal? CostoMembresia { get; set; }
        public bool? EstaPausada { get; set; }
    }

}
