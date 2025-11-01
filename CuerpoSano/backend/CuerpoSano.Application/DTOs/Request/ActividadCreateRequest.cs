namespace CuerpoSano.Application.DTOs.Request
{
    public class ActividadCreateRequest
    {
        public string Nombre { get; set; } = null!;
        public bool Activa { get; set; } = true;
    }
}
