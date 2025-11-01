using System;

namespace CuerpoSano.Domain.Entities
{
    public class Miembro : Persona
    {
        public string Correo { get; set; } = string.Empty;

        public int? MembresiaId { get; set; }
        public Membresia? Membresia { get; set; } = null!;//1:1

        public Carnet? Carnet { get; set; } = null!;//1:1

        public ICollection<MiembroClase> Clases { get; set; } = new List<MiembroClase>();
        public ICollection<Asistencia> Asistencias { get; set; } = new List<Asistencia>();

    }
}