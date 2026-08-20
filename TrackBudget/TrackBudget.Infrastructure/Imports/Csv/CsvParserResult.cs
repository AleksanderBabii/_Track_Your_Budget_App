namespace TrackBudget.Infrastructure.Imports.Csv;

public sealed class CsvParserResult
{
    public List<string> Headers { get; init; } = [];
    public List<CsvRow> Rows { get; init; } = [];
    public List<string> Errors { get; init; } = [];
}