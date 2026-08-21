namespace TrackBudget.Application.DTOs.Imports;

public class CsvParserResultDto
{
    public List<string> Headers { get; set; } = [];

    public List<CsvRowDto> Rows { get; set; } = [];

    public List<string> Errors { get; set; } = [];
}