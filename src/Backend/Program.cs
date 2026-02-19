using Microsoft.EntityFrameworkCore;
using InventorySystem.Data;
using InventorySystem.Services;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<InventoryDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddOpenApi();

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("SpecificOrigins", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
builder.Services.AddScoped<IItemService, ItemService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<InventoryDbContext>();

    var retries = 10;
    for (int i = 0; i < retries; i++)
    {
        try
        {
            await context.Database.MigrateAsync();
            Console.WriteLine("--> Database migration applied successfully.");
            break;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"--> Database not ready yet (attempt {i+1}/{retries}): {ex.Message}");
            await Task.Delay(5000);
        }
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("SpecificOrigins");
app.MapControllers();

app.Run();
