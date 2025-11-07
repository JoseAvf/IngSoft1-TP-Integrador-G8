using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Domain.Entities
{
    public class Actividad
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = null!;
        public bool Activa { get; set; }
        // 1:N con Clase
        public ICollection<Clase> Clases { get; set; } = new List<Clase>();
    }
}
