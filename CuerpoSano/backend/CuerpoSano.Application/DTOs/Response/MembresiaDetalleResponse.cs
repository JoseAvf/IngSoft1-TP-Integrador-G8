using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.DTOs.Response
{
    public class MembresiaDetalleResponse
    {
        public int Id { get; set; }
        public string Tipo { get; set; } = null!;
        public DateTime FechaEmision { get; set; }
        public DateTime FechaVencimiento { get; set; }
        public decimal Costo { get; set; }
        public DateTime? FechaPausaInicio { get; set; }
        public DateTime? FechaPausaFin { get; set; }

        // Datos del miembro
        public int IdMiembro { get; set; }
        public string Nombre { get; set; } = null!;
        public string DNI { get; set; } = null!;
        public string Direccion { get; set; } = null!;
        public DateTime FechaNacimiento { get; set; }
        public int Telefono { get; set; }
        public string Correo { get; set; } = null!;
    }

}
