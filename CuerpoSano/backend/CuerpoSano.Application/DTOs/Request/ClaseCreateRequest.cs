namespace CuerpoSano.Application.DTOs.Request
{
    public class ClaseCreateRequest
    {
        public string Nombre { get; set; } = null!;
        public DateTime HoraInicio { get; set; }
        public DateTime HoraFin { get; set; }
        public int Cupo { get; set; } = 20;
        public int ActividadId { get; set; }
        public int EntrenadorId { get; set; }
    }
}
