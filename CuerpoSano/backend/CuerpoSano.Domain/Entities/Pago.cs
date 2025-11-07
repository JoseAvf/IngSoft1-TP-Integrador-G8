using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Domain.Entities
{
    public class Pago
    {
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Monto { get; set; }
        public string MetodoPago{ get; set; } = string.Empty;   // Efectivo, Tarjeta, Transferencia, MercadoPago
        public int? MembresiaId { get; set; }
        public Membresia? Membresia { get; set; }
    }
}
