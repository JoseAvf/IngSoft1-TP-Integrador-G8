namespace CuerpoSano.Application.DTOs.Response
{
    public class EntrenadorResponse
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = null!;
        public string DNI { get; set; } = null!;
        public string Direccion { get; set; } = null!;
        public DateTime FechaNacimiento { get; set; }
        public int Telefono { get; set; }
        public int? CertificadoId { get; set; }
        public List<ClasePersonaResponse>? Clases { get; set; }

    }
}
