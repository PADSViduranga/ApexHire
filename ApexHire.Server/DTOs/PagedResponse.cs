namespace ApexHire.Server.DTOs;

public class PagedResponse<T>
{
    public IReadOnlyList<T> Items { get; set; } =
        new List<T>();

    public int Page { get; set; }

    public int PageSize { get; set; }

    public int TotalItems { get; set; }

    public int TotalPages =>
        PageSize > 0
            ? (int)Math.Ceiling(
                TotalItems / (double)PageSize)
            : 0;
}