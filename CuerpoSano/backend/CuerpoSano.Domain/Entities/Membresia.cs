namespace CuerpoSano.Domain.Entities
{
    public class Membresia
    {
        public int Id { get; set; }
        public string Tipo { get; set; } = null!; // Diaria, Semanal, Mensual, Anual
        public DateTime FechaEmision{ get; set; }
        public DateTime FechaVencimiento { get; set; }
        public decimal Costo { get; set; }

        // Pausa de hasta 30 días
        public DateTime? FechaPausaInicio { get; set; }
        public DateTime? FechaPausaFin { get; set; }

        // Relación con miembro
        public int MiembroId { get; set; }
        public Miembro Miembro { get; set; } = null!;// 1:1 inversa

        // 🔹 Nueva relación 1:1 con Pago
        public Pago? Pago { get; set; }
        public bool EstaPagada { get; set; } = false;
    }
}