using TrackBudget.Application.DTOs.Imports;

namespace TrackBudget.Application.Interfaces.Imports;

public interface ICsvParser
{
    Task<CsvParserResultDto> ParseAsync(
        Stream stream,
        CancellationToken cancellationToken = default);
}