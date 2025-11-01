using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Domain.Entities
{
    public class Clase
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = null!;
        public DateTime HoraInicio { get; set; }
        public DateTime HoraFin { get; set; }
        public int Cupo { get; set; } = 20; //siempre el cupo máximo de la clase es 20;
        public DateTime FechaCreacion { get; set; }

        // 🔹 Relaciones
        public int ActividadId { get; set; }
        public Actividad Actividad { get; set; } = null!;

        public int EntrenadorId { get; set; }
        public Entrenador Entrenador { get; set; } = null!;

        // Relación N:M con miembros
        public ICollection<MiembroClase> Miembros { get; set; } = new List<MiembroClase>();

        // Relación 1:N con asistencias
        public ICollection<Asistencia> Asistencias { get; set; } = new List<Asistencia>();

    }
}
