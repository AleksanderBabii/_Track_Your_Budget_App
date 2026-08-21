namespace TrackBudget.Application.DTOs.Imports;

public class CsvRowDto
{
    public int RowNumber { get; set; }

    public Dictionary<string, string> Values { get; set; } =
        new(StringComparer.OrdinalIgnoreCase);
}