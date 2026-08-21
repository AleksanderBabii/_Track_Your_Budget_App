namespace TrackBudget.Application.DTOs.Imports;

public sealed class CsvParserResult
{
    public List<string> Headers { get; init; } = new();
    public List<CsvRowDto> Rows { get; init; } = new();
    public List<string> Errors { get; init; } = new();
}