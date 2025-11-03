using CuerpoSano.Application.DTOs.Request;
using CuerpoSano.Application.DTOs.Response;
using CuerpoSano.Application.Interfaces.ServicesInterfaces;
using CuerpoSano.Application.Services;
using CuerpoSano.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using CuerpoSano.Application.Mappers;

namespace CuerpoSano.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MembresiasController : ControllerBase
    {
        private readonly IMembresiaService _membresiaService;
        private readonly IMiembroService _miembroService;

        public MembresiasController(IMembresiaService membresiaService, IMiembroService miembroService)
        {
            _membresiaService = membresiaService;
            _miembroService = miembroService;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<MembresiaDetalleResponse>>> GetAll()
        {
            var membresias = await _membresiaService.GetAllAsync();
            return Ok(membresias.Select(m => m.ToDetalleResponse()));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MembresiaDetalleResponse>> GetById(int id)
        {
            var membresia = await _membresiaService.GetByIdAsync(id);
            if (membresia == null) return NotFound();
            return Ok(membresia.ToDetalleResponse());
        }

        [HttpPost]
        public async Task<ActionResult<MembresiaCreateResponse>> Create([FromBody] MembresiaCreateRequest request) //se crea correctamente
        {
            // Traer la fecha de nacimiento del miembro para calcular descuentos
            var miembro = await _miembroService.GetByIdAsync(request.MiembroId);
            if (miembro == null) return NotFound($"Miembro con ID {request.MiembroId} no encontrado.");

            var membresia = new Membresia
            {
                MiembroId = request.MiembroId,
                Tipo = request.Tipo,
                Costo = request.CostoBase
            };

            var nuevaMembresia = await _membresiaService.CreateAsync( 
                membresia,
                miembro.FechaNacimiento,
                request.EsEstudiante
            );

            return CreatedAtAction(nameof(GetById), new { id = nuevaMembresia.Id }, nuevaMembresia.ToCreateResponse()); 
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult> Update([FromBody] Membresia membresia) //corregir que no pide el obj membresia completo, solo los datos que se quieran actualizar;
        {
            await _membresiaService.UpdateAsync(membresia);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id) //borra bien
        {
            var eliminado = await _membresiaService.DeleteAsync(id);
            if (!eliminado) return NotFound();
            return NoContent();
        }

        [HttpPut("pausar/{id}")] //se añaden los datos de membresia pausada correctamente
        public async Task<ActionResult<MembresiaCreateResponse>> Pausar(int id, [FromQuery] DateTime inicioPausa)
        {
            try
            {
                var membresia = await _membresiaService.PausarMembresiaAsync(id, inicioPausa);
                return Ok(membresia.ToCreateResponse());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("despausar/{id}")] //se puede despausar la membresia
        public async Task<ActionResult<MembresiaCreateResponse>> Despausar(int id) 
        {
            try
            {
                var membresia = await _membresiaService.DespausarMembresiaAsync(id);  
                return Ok(membresia.ToCreateResponse());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
