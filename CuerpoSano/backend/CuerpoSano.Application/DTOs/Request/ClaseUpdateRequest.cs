using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.DTOs.Request
{
    public class ClaseUpdateRequest
    {
        public string Nombre { get; set; } = null!;
        public DateTime HoraInicio { get; set; }
        public DateTime HoraFin { get; set; }
        public int Cupo { get; set; }
    }

}
