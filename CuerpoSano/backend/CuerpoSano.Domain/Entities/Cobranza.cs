namespace CuerpoSano.Domain.Entities
{
    public class Cobranza
    {
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public int Monto { get; set; }
        public string Metodo_Pago { get; set; } = string.Empty;
        
        public int Id_Miembro { get; set; }
        public Miembro Miembro { get; set; } = null!;
    }
}