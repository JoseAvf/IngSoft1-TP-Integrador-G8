using CuerpoSano.Application.Interfaces.ServicesInterfaces;
using CuerpoSano.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CuerpoSano.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MiembrosController : ControllerBase
    {
        private readonly IMiembroService _miembroService;

        public MiembrosController(IMiembroService miembroService)
        {
            _miembroService = miembroService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Miembro>>> GetAll()
        {
            var miembros = await _miembroService.GetAllAsync();
            return Ok(miembros);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Miembro>> GetById(int id)
        {
            var miembro = await _miembroService.GetByIdAsync(id);
            if (miembro == null)
                return NotFound();

            return Ok(miembro);
        }

        [HttpPost]
        public async Task<ActionResult<Miembro>> Create([FromBody] Miembro miembro, [FromQuery] bool esEstudiante)
        {
            var nuevo = await _miembroService.CreateMiembroAsync(miembro, esEstudiante);
            return CreatedAtAction(nameof(GetById), new { id = nuevo.Id }, nuevo);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Miembro miembro)
        {
            if (id != miembro.Id) return BadRequest("El ID no coincide");

            var existente = await _miembroService.GetByIdAsync(id);
            if (existente == null) return NotFound();

            var updateMiembro = await _miembroService.UpdateAsync(miembro);

            return Ok(updateMiembro);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var eliminado = await _miembroService.DeleteAsync(id); 
            if (!eliminado) return NotFound();
            return NoContent();
        }
    }
}
