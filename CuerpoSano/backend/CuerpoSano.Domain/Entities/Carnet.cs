namespace CuerpoSano.Domain.Entities
{
    public class Carnet
    {
        public int Id { get; set; }
        public string CodigoBarra { get; set; } = null!;
        public DateTime FechaEmision { get; set; }

        public int MiembroId { get; set; }
        public Miembro Miembro { get; set; } = null!;
    }
}