using CuerpoSano.Application.DTOs.Response;
using CuerpoSano.Application.Interfaces.ServicesInterfaces;
using Microsoft.AspNetCore.Mvc;

namespace CuerpoSano.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AsistenciasController : ControllerBase
    {
        private readonly IAsistenciaService _service;

        public AsistenciasController(IAsistenciaService service)
        {
            _service = service;
        }

        [HttpPost("miembro")]
        public async Task<IActionResult> RegistrarAsistenciaMiembro(int claseId, int miembroId, bool asistio)
        {
            try
            {
                var asistencia = await _service.RegistrarAsistenciaMiembroAsync(claseId, miembroId, asistio);
                var response = new AsistenciaResponse
                {
                    Id = asistencia.Id,
                    Asistio = asistencia.Asistio,
                    FechaRegistro = asistencia.FechaRegistro,
                    ClaseNombre = asistencia.Clase.Nombre,
                    AsistenteNombre = asistencia.Miembro?.Nombre
                };
                return Ok(response);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("entrenador")]
        public async Task<IActionResult> RegistrarAsistenciaEntrenador(int claseId, int entrenadorId, bool asistio)
        {
            try
            {
                var asistencia = await _service.RegistrarAsistenciaEntrenadorAsync(claseId, entrenadorId, asistio);
                var response = new AsistenciaResponse
                {
                    Id = asistencia.Id,
                    Asistio = asistencia.Asistio,
                    FechaRegistro = asistencia.FechaRegistro,
                    ClaseNombre = asistencia.Clase.Nombre,
                    AsistenteNombre = asistencia.Entrenador?.Nombre
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("registrar-inasistencias/{claseId}")]
        public async Task<IActionResult> RegistrarInasistenciasPendientes(int claseId)
        {
            await _service.RegistrarInasistenciasPendientesAsync(claseId);
            return Ok("Inasistencias registradas correctamente.");
        }
    }
}
