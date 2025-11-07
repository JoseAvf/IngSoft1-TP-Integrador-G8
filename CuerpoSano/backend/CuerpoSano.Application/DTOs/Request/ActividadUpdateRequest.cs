using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.DTOs.Request
{
    public class ActividadUpdateRequest
    {
        public string Nombre { get; set; } = null!;
        public bool Activa { get; set; }
    }
}
