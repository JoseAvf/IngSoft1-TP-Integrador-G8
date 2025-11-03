namespace CuerpoSano.Application.DTOs.Response
{
    public class EntrenadorDetalleResponse
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = null!;
        public string DNI { get; set; } = null!;
        public string Direccion { get; set; } = null!;
        public DateTime FechaNacimiento { get; set; }
        public int Telefono { get; set; }

        //certificado
        public int? CertificadoId { get; set; }
        public int CodigoCertificado { get; set; }
        public bool Vigencia { get; set; }
        public DateTime FechaEmision { get; set; }
        public DateTime FechaVencimiento { get; set; }

        //clases
        public List<ClasePersonaResponse>? Clases { get; set; }

    }
}
