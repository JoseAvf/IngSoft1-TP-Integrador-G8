using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.DTOs.Response
{
    public class MiembroCreateResponse
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = null!;
        public string DNI { get; set; } = null!;
        public string Direccion { get; set; } = null!;
        public DateTime FechaNacimiento { get; set; } //sin horas
        public int Telefono { get; set; }
        public string Correo { get; set; } = null!;
        public string CodigoCarnet { get; set; } = null!;
        public string tipoMembresia { get; set; } = null!;
        public DateTime FechaEmision { get; set; }  //del carnet, sin horas
    }

}
