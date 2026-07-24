using System.Security.Claims;
using ApexHire.Server.DTOs;
using ApexHire.Server.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApexHire.Server.Controllers;

[ApiController]
[Authorize(Roles = "Candidate")]
[Route("api/candidate-education")]
public class CandidateEducationController : ControllerBase
{
    private readonly ICandidateEducationService _service;

    public CandidateEducationController(
        ICandidateEducationService service)
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
        var education = await _service.GetByIdAsync(id, UserId);

        if (education == null)
            return NotFound();

        return Ok(education);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CandidateEducationRequest request)
    {
        var education =
            await _service.CreateAsync(UserId, request);

        return CreatedAtAction(
            nameof(Get),
            new { id = education.Id },
            education);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        CandidateEducationRequest request)
    {
        var education =
            await _service.UpdateAsync(
                id,
                UserId,
                request);

        if (education == null)
            return NotFound();

        return Ok(education);
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