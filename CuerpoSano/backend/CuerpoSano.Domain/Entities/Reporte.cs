using System.ComponentModel.DataAnnotations;

namespace CuerpoSano.Domain.Entities
{
    public class Reporte
    {
        [Key]
        public int IdReporte { get; set; }
        public string Formato { get; set; }
        public DateTime FechaGeneracion { get; set; }
    }
}