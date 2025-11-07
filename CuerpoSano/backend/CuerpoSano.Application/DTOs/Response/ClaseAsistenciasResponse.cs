using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.DTOs.Response
{
    public class ClaseAsistenciasResponse
    {
        public int ClaseId { get; set; }
        public string ClaseNombre { get; set; } = string.Empty;
        public DateTime Fecha { get; set; }

        public EntrenadorAsistenciaDTO Entrenador { get; set; } = new();
        public List<MiembroAsistenciaDTO> Miembros { get; set; } = new();
    }

    public class MiembroAsistenciaDTO
    {
        public int MiembroId { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public bool Asistio { get; set; }
    }

    public class EntrenadorAsistenciaDTO
    {
        public int EntrenadorId { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public bool Asistio { get; set; }
    }

}
