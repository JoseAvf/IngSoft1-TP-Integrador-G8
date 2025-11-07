namespace CuerpoSano.Application.DTOs.Response
{
    public class PagoResponse
    {
        public int Id { get; set; }
        public DateTime FechaPago { get; set; }
        public decimal Monto { get; set; }
        public string MetodoPago { get; set; } = string.Empty;
        public int? MembresiaId { get; set; }
    }
}
