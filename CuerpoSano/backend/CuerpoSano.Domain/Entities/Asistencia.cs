using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Domain.Entities
{
    public class Asistencia
    {
        public int Id { get; set; }
        public bool Asistio { get; set; }
        public int ClaseId { get; set; }
        public Clase Clase { get; set; } = null!;
        public int? MiembroId { get; set; }
        public Miembro? Miembro { get; set; }

        public int? EntrenadorId { get; set; }
        public Entrenador? Entrenador { get; set; }

        public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;
    }
}
