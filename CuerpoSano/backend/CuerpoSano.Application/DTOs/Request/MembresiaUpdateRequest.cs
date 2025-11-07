using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.DTOs.Request
{
    public class MembresiaUpdateRequest
    {
        public string Tipo { get; set; } = null!;
        public bool EsEstudiante { get; set; }     // Para aplicar descuento
    }

}
