using System.ComponentModel.DataAnnotations;

namespace CuerpoSano.Domain.Entities
{
    public class Actividad
    {
        [Key]
        public int IdActividad { get; set; } 
        public string Nombre { get; set; }
        public bool Activa { get; set; }

        public List<Clase> Clases { get; set; } = new();
    }
}