using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Domain.Entities
{
    public class MiembroClase
    {
        public int MiembroId { get; set; }
        public Miembro Miembro { get; set; } = null!;

        public int ClaseId { get; set; }
        public Clase Clase { get; set; } = null!;

        public DateTime FechaInscripcion { get; set; } = DateTime.UtcNow;
    }
}

