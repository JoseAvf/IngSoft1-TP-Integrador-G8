namespace CuerpoSano.Application.DTOs.Response
{
    public class ClaseDetalleResponse
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = null!;
        public DateTime HoraInicio { get; set; }
        public DateTime HoraFin { get; set; }
        public int Cupo { get; set; }
        public DateTime FechaCreacion { get; set; }

        // Datos relacionados
        public int ActividadId { get; set; }
        public string ActividadNombre { get; set; } = null!;

        public int EntrenadorId { get; set; }
        public string EntrenadorNombre { get; set; } = null!;

        // Contadores / estado
        public int InscriptosCount { get; set; }
    }
}
