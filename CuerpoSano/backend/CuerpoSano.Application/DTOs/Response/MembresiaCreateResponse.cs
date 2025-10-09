using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.DTOs.Response
{
    public class MembresiaCreateResponse
    {
        public int Id { get; set; }
        public int MiembroId { get; set; }
        public string Tipo { get; set; } = null!;
        public DateTime FechaEmision { get; set; }
        public DateTime FechaVencimiento { get; set; }
        public decimal Costo { get; set; }
        public DateTime? FechaPausaInicio { get; set; }
        public DateTime? FechaPausaFin { get; set; }
    }

}
