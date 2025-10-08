namespace CuerpoSano.Domain.Entities
{
    public class Membresia
    {
        public int Id { get; set; }
        public string Tipo { get; set; } = null!;
        public DateTime FechaEmision{ get; set; }
        public DateTime FechaVencimiento { get; set; }
        public decimal Costo { get; set; }

        public Miembro? Miembro { get; set; } // 1:1 inversa
    }
}