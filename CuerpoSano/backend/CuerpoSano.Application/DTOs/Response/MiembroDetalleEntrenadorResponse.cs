using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.DTOs.Response
{ 
    public class MiembroDetalleEntrenadorResponse
    {
        // Datos del miembro
        public int Id { get; set; }
        public string Nombre { get; set; } = null!;
        public string DNI { get; set; } = null!;
        public int Telefono { get; set; }
        public string Correo { get; set; } = null!;

        // Datos del carnet 
        public string CodigoCarnet { get; set; }
        // Datos de la membresía 
        public string? TipoMembresia { get; set; }

    }
}
