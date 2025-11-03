using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.DTOs.Request
{
    public class EntrenadorUpdateRequest
    {
        public string Nombre { get; set; }
        public string Direccion { get; set; }
        public int Telefono { get; set; }
    }
}
