namespace CuerpoSano.Domain.Entities
{
    public class Clase
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public DateTime Hora_Inicio { get; set; }
        public DateTime Hora_Fin { get; set; }
        public int Cupo { get; set; }
        public DateTime Fecha { get; set; }
        
        public int Id_Entrenador { get; set; }
        public Entrenador Entrenador { get; set; } = null!; //1:N (una clase tiene 1 entrenador)

        public int Id_Actividad { get; set; }
        public Actividad Actividad { get; set; } = null!; //1:1

        public List<Miembro> Participantes { get; set; } = new ();
    }
}