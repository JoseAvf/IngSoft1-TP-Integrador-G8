namespace CuerpoSano.Domain.Entities
{
    public class Entrenador : Persona
    {
        public bool Vigencia_Certificacion { get; set; }
        public string Entidad { get; set; } = string.Empty;
        public int Cod_Certificado { get; set; }
        public DateTime fecha_Emision { get; set; }
        public DateTime fecha_Venc { get; set; }

        public int Id_Clase { get; set; }

        public List<Miembro> Miembros { get; set; } = new(); //1:N
        public List<Clase> Clases { get; set; } = new(); //1:N
    }
}