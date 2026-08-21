using System.Globalization;
using System.Text;
using System.Diagnostics.CodeAnalysis;

using TrackBudget.Application.DTOs.Imports;
using TrackBudget.Application.Interfaces.Imports;

namespace TrackBudget.Infrastructure.Imports.Csv;

public sealed class CsvParser : ICsvParser
{
    private static readonly char[] SupportedDelimiters = new[] { ',', ';', '\t' };

    public async Task<CsvParserResultDto> ParseAsync(
        Stream stream,
        CancellationToken cancellationToken = default
    )
    {
        // Validate the input stream
        if (stream == null)
        {
            throw new ArgumentNullException(nameof(stream));
        }
        if (!stream.CanRead)
        {
            throw new ArgumentException("Stream must be readable.", nameof(stream));
        }
        if (stream.CanSeek)
        {
            stream.Position = 0;
        }
        using var reader = new StreamReader(stream, new UTF8Encoding(
            encoderShouldEmitUTF8Identifier: false, throwOnInvalidBytes: true
        ),
        detectEncodingFromByteOrderMarks: true, bufferSize: 1024, leaveOpen: true
        );
        // Read the header line
        var result = new CsvParserResultDto();

        var headerLine = await reader.ReadLineAsync(cancellationToken);

        if (string.IsNullOrWhiteSpace(headerLine))
        {
            result.Errors.Add("CSV file is empty or does not contain a header row.");
            return result;
        }
        // Detect the delimiter used in the CSV file
        var delimiter = DetectDelimiter(headerLine);

        var headers = ParseLine(headerLine, delimiter)
            .Select(h => h.Trim())
            .ToList();

        if (headers.Count == 0)
        {
            result.Errors.Add("CSV file does not contain a valid header row.");
            return result;
        }

        result.Headers.AddRange(headers);

        var rowNumber = 1;
        // Read the remaining lines and parse them into CsvRow objects
        string? line;

        while ((line = await reader.ReadLineAsync(cancellationToken)) is not null)
        {
            rowNumber++;

            if (string.IsNullOrWhiteSpace(line))
            {
                continue;
            }

            try
            {
                var values = ParseLine(line, delimiter);

                if (values.Count != headers.Count)
                {
                    result.Errors.Add(
                        $"Row {rowNumber}: expected {headers.Count} columns but found {values.Count}."
                    );

                    continue;
                }

                var row = new CsvRowDto
                {
                    RowNumber = rowNumber
                };

                for (var i = 0; i < headers.Count; i++)
                {
                    row.Values[headers[i]] = values[i].Trim();
                }

                result.Rows.Add(row);
            }
            catch (Exception ex)
            {
                result.Errors.Add(
                    $"Row {rowNumber}: {ex.Message}"
                );
            }
        }

        return result;
    }
    private static char DetectDelimiter(string headerLine)
    {
        var candidates = SupportedDelimiters
            .Select(delimiter => new
            {
                Delimiter = delimiter,
                Count = CountOutsideQuotes(headerLine, delimiter)
            })
            .OrderByDescending(x => x.Count)
            .ToList();

        var best = candidates.First();

        return best.Count > 0
            ? best.Delimiter
            : ';';
    }

    private static int CountOutsideQuotes(string line, char delimiter) // Count the number of delimiters outside of quoted sections
    {
        var count = 0;
        var insideQuotes = false;

        for (var i = 0; i < line.Length; i++)
        {
            var character = line[i];

            if (character == '"')
            {
                if (insideQuotes &&
                    i + 1 < line.Length &&
                    line[i + 1] == '"')
                {
                    i++;
                    continue;
                }

                insideQuotes = !insideQuotes;
                continue;
            }

            if (!insideQuotes && character == delimiter)
            {
                count++;
            }
        }

        return count;
    }

    private static List<string> ParseLine(string line, char delimiter) // Parse a line of CSV into a list of values, handling quoted sections and escaped quotes
    {
        var values = new List<string>();
        var currentValue = new StringBuilder();
        var insideQuotes = false;

        for (var i = 0; i < line.Length; i++)
        {
            var character = line[i];

            if (character == '"')
            {
                if (insideQuotes &&
                    i + 1 < line.Length &&
                    line[i + 1] == '"')
                {
                    currentValue.Append('"');
                    i++;
                    continue;
                }

                insideQuotes = !insideQuotes;
                continue;
            }

            if (!insideQuotes && character == delimiter)
            {
                values.Add(currentValue.ToString());
                currentValue.Clear();
                continue;
            }

            currentValue.Append(character);
        }

        values.Add(currentValue.ToString());

        return values;
    }

    private static string NormalizedHeader(string header) // Normalize a header by trimming whitespace and converting to lowercase
    {
        return header.Trim().Trim('"').Trim().ToLowerInvariant();
    }

    public static bool TryGetValue(CsvRowDto row, IEnumerable<string> possibleHeaders, [NotNullWhen(true)]out string? value) // Try to get a value from a CsvRow using a list of possible headers
    {
        foreach (var header in possibleHeaders)
        {
            var normalizedHeader = NormalizedHeader(header);

            if (row.Values.TryGetValue(normalizedHeader, out var foundValue))
            {
                value = foundValue;
                return true;
            }
        }

        value = null;
        return false;
    }

    public static bool TryParseDate(string value, out DateTime date) // Try to parse a date from a string using multiple formats
    {
        var formats = new[]
        {
            "yyyy-MM-dd",
            "yyyy-MM-dd HH:mm:ss",
            "yyyy-MM-dd HH:mm",
            "dd.MM.yyyy",
            "dd.MM.yyyy HH:mm:ss",
            "dd.MM.yyyy HH:mm",
            "dd/MM/yyyy",
            "dd/MM/yyyy HH:mm:ss",
            "dd/MM/yyyy HH:mm",
            "MM/dd/yyyy",
            "MM/dd/yyyy HH:mm:ss",
            "MM/dd/yyyy HH:mm"
        };

        return DateTime.TryParseExact(
                  value.Trim(),
                  formats,
                  CultureInfo.InvariantCulture,
                  DateTimeStyles.AllowWhiteSpaces,
                  out date)
              ||
              DateTime.TryParse(
                  value.Trim(),
                  CultureInfo.GetCultureInfo("pl-PL"),
                  DateTimeStyles.AllowWhiteSpaces,
                  out date);
    }

    public static bool TryParseAmount( // Try to parse a decimal amount from a string, handling different formats and separators
        string value,
        out decimal amount)
    {
        var normalized = value
            .Trim()
            .Replace("\u00A0", string.Empty)
            .Replace(" ", string.Empty);

        if (decimal.TryParse(
                normalized,
                NumberStyles.AllowLeadingSign |
                NumberStyles.AllowDecimalPoint |
                NumberStyles.AllowThousands,
                CultureInfo.InvariantCulture,
                out amount))
        {
            return true;
        }

        if (decimal.TryParse(
                normalized,
                NumberStyles.AllowLeadingSign |
                NumberStyles.AllowDecimalPoint |
                NumberStyles.AllowThousands,
                CultureInfo.GetCultureInfo("pl-PL"),
                out amount))
        {
            return true;
        }

        if (normalized.Contains(',') &&
            normalized.Contains('.'))
        {
            var lastComma = normalized.LastIndexOf(',');
            var lastDot = normalized.LastIndexOf('.');

            if (lastComma > lastDot)
            {
                normalized = normalized
                    .Replace(".", string.Empty)
                    .Replace(',', '.');
            }
            else
            {
                normalized = normalized
                    .Replace(",", string.Empty);
            }

            return decimal.TryParse(
                normalized,
                NumberStyles.AllowLeadingSign |
                NumberStyles.AllowDecimalPoint,
                CultureInfo.InvariantCulture,
                out amount);
        }

        return false;
    }

}