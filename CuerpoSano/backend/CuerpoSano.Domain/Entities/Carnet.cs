namespace CuerpoSano.Domain.Entities
{
    public class Carnet
    {
        public int Id { get; set; }
        public string CodigoBarra { get; set; } = null!;
        public DateTime Fecha_Emision { get; set; }

        public int Id_Miembro { get; set; }
        public Miembro Miembro { get; set; } = null;
    }
}