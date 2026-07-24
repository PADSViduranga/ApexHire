using System.Security.Claims;
using ApexHire.Server.DTOs;
using ApexHire.Server.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApexHire.Server.Controllers;

[ApiController]
[Authorize(Roles = "Candidate")]
[Route("api/candidate-experience")]
public class CandidateExperienceController : ControllerBase
{
    private readonly ICandidateExperienceService _service;

    public CandidateExperienceController(
        ICandidateExperienceService service)
    {
        _service = service;
    }

    private int UserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAllAsync(UserId));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var experience =
            await _service.GetByIdAsync(id, UserId);

        if (experience == null)
            return NotFound();

        return Ok(experience);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CandidateExperienceRequest request)
    {
        var experience =
            await _service.CreateAsync(UserId, request);

        return CreatedAtAction(
            nameof(Get),
            new { id = experience.Id },
            experience);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        CandidateExperienceRequest request)
    {
        var experience =
            await _service.UpdateAsync(
                id,
                UserId,
                request);

        if (experience == null)
            return NotFound();

        return Ok(experience);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted =
            await _service.DeleteAsync(id, UserId);

        if (!deleted)
            return NotFound();

        return NoContent();
    }
}