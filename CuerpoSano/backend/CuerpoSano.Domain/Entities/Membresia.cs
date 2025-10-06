namespace CuerpoSano.Domain.Entities
{
    public class Membresia
    {
        public int Id { get; set; }
        public string Tipo { get; set; }
        public DateTime Fecha_Emision { get; set; }
        public DateTime Fecha_Venc { get; set; }
        public decimal Costo { get; set; }

        public Miembro? Miembro { get; set; } // 1:1 inversa
    }
}