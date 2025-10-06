using System;

namespace CuerpoSano.Domain.Entities
{
    public class Miembro : Persona
    {
        public int Id_Inscripcion { get; set; }
        public string Correo { get; set; } = string.Empty;

        public int? EntrenadorId { get; set; } //un miembro puede tener un entrenador o ninguno
        public Entrenador? Entrenador { get; set; }

        public int? Id_Membresia { get; set; }
        public Membresia? Membresia { get; set; } //1:1

        public Carnet? Carnet { get; set; } //1:1

        public List<Cobranza> Cobranzas { get; set; } = new(); //1:N
        public List<Clase> Clases { get; set; } = new(); //n:M
    }
}