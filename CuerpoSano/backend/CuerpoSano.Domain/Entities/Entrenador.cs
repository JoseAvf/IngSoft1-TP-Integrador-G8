using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Domain.Entities
{
    public class Entrenador : Persona
    {
        public int CertificadoId { get; set; }
        public Certificado Certificado { get; set; } = null!;

        // 🔹 Relación 1:N con Clase
        public ICollection<Clase> Clases { get; set; } = new List<Clase>();
        public ICollection<Asistencia> Asistencias { get; set; } = new List<Asistencia>();


    }
}
