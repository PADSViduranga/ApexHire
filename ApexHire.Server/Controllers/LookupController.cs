using ApexHire.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApexHire.Server.Controllers;

[ApiController]
[Route("api/lookups")]
public class LookupController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public LookupController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("organizations")]
    public async Task<IActionResult> GetOrganizations()
    {
        var organizations =
            await _context.Organizations
                .OrderBy(x => x.Name)
                .Select(x => new
                {
                    x.Id,
                    x.Name
                })
                .ToListAsync();

        return Ok(organizations);
    }

    [HttpGet("departments/{organizationId}")]
    public async Task<IActionResult>
        GetDepartments(int organizationId)
    {
        var departments =
            await _context.Departments
                .Where(x =>
                    x.OrganizationId == organizationId)
                .OrderBy(x => x.Name)
                .Select(x => new
                {
                    x.Id,
                    x.Name
                })
                .ToListAsync();

        return Ok(departments);
    }
}