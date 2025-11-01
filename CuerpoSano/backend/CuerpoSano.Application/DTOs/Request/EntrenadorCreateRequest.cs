namespace CuerpoSano.Application.DTOs.Request
{
    public class EntrenadorCreateRequest
    {
        public string Nombre { get; set; } = null!;
        public string DNI { get; set; } = null!;
        public string Direccion { get; set; } = null!;
        public DateTime FechaNacimiento { get; set; }
        public int Telefono { get; set; }
    }
}
