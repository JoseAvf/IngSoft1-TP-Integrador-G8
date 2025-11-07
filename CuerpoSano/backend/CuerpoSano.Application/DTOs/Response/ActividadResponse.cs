namespace CuerpoSano.Application.DTOs.Response
{
    public class ActividadResponse
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = null!;
        public bool Activa { get; set; }
        public List<ClaseActividadResponse>? Clases { get; set; }

    }
}
