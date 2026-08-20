namespace TrackBudget.Infrastructure.Imports.Csv;

public sealed class CsvRow
{
    public int RowNumber { get; set; }
    public Dictionary<string, string> Values { get; set; } = new(StringComparer.OrdinalIgnoreCase);
}