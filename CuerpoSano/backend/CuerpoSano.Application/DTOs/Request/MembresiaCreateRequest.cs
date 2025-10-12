using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.DTOs.Request
{
    public class MembresiaCreateRequest
    {
        public int MiembroId { get; set; }      // Para asociar la membresía a un miembro existente
        public string Tipo { get; set; } = null!;  // Diaria, Semanal, Mensual, Anual
        public decimal CostoBase { get; set; }     // Costo base según tipo de membresía
        public bool EsEstudiante { get; set; }     // Para aplicar descuento
    }

}
