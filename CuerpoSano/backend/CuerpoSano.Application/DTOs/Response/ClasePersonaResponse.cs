using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.DTOs.Response
{
    public class ClasePersonaResponse
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = null!;
        public DateTime HoraInicio { get; set; }
        public DateTime HoraFin { get; set; }
        public int Cupo { get; set; }
        public DateTime FechaCreacion { get; set; }

        // Datos relacionados
        public int ActividadId { get; set; }
        public string ActividadNombre { get; set; } = null!;

        // Contadores / estado
        public int InscriptosCount { get; set; }
    }
}
