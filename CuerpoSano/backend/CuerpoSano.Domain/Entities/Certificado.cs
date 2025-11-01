using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Domain.Entities
{
    public class Certificado
    {
        public int Id {get; set;}
        public int CodCertificado { get; set; }
        public bool Vigencia { get; set; }
        public DateTime FechaEmision { get; set; }
        public DateTime FechaVencimiento { get; set; }
    }
}
