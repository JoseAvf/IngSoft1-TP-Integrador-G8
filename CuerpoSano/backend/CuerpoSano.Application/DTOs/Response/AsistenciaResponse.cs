using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.DTOs.Response
{
    public class AsistenciaResponse
    {
        public int Id { get; set; }
        public bool Asistio { get; set; }
        public DateTime FechaRegistro { get; set; }
        public string ClaseNombre { get; set; } = string.Empty;
        public string? AsistenteNombre { get; set; }
        
    }

}
