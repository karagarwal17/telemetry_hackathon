using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;

public class DataAccess
{
    private string _connectionString;
    private HttpClient _httpClient;

    public DataAccess(string connectionString, HttpClient httpClient)
    {
        _connectionString = connectionString;
        _httpClient = httpClient;
    }

    public async Task<DataTable> ExecuteQuery(string query)
    {
        using (SqlConnection connection = new SqlConnection(_connectionString))
        {
            await connection.OpenAsync();
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                using (SqlDataReader reader = await command.ExecuteReaderAsync())
                {
                    DataTable dataTable = new DataTable();
                    dataTable.Load(reader);
                    return dataTable;
                }
            }
        }
    }

    public async Task<string> MakeApiCall(string apiUrl)
    {
        HttpResponseMessage response = await _httpClient.GetAsync(apiUrl);
        if (response.IsSuccessStatusCode)
        {
            string responseContent = await response.Content.ReadAsStringAsync();
            return responseContent;
        }
        else
        {
            throw new Exception($"API call failed with status code: {response.StatusCode}");
        }
    }
}

class Program
{
    static async Task Main(string[] args)
    {
        string connectionString = "your_database_connection_string";
        HttpClient httpClient = new HttpClient();

        DataAccess dataAccess = new DataAccess(connectionString, httpClient);

        string query = "SELECT * FROM Products";
        DataTable result = await dataAccess.ExecuteQuery(query);
        Console.WriteLine("Database query result:");
        foreach (DataRow row in result.Rows)
        {
            Console.WriteLine($"{row["ProductName"]} - {row["UnitPrice"]}");
        }

        string apiUrl = "https://api.example.com/data/products";
        string apiResponse = await dataAccess.MakeApiCall(apiUrl);
        Console.WriteLine("API response:");
        Console.WriteLine(apiResponse);
    }
}
