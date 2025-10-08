using CuerpoSano.Application.Interfaces.ServicesInterfaces;
using CuerpoSano.Application.Services;
using CuerpoSano.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CuerpoSano.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MembresiasController : ControllerBase
    {
        private readonly MembresiaService _membresiaService;
        public MembresiasController(MembresiaService service)
        {
            _membresiaService = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Membresia>>> GetAll()
        {
            return Ok(await _membresiaService.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Miembro>> GetById(int id)
        {
            var miembro = await _membresiaService.GetByIdAsync(id);
            if (miembro == null)
                return NotFound();

            return Ok(miembro);
        }

        [HttpPost]
        public async Task<ActionResult<Membresia>> Create(Membresia membresia)
        {
            var creada = await _membresiaService.CreateAsync(membresia);

            return CreatedAtAction(nameof(GetAll), 
                new { id = creada.Id }, 
                creada);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult> Update([FromBody] Membresia membresia)
        {
            await _membresiaService.UpdateAsync(membresia);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var eliminado = await _membresiaService.DeleteAsync(id);
            if (!eliminado) return NotFound();
            return NoContent();
        }
    }
}
