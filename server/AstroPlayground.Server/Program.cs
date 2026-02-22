using AstroPlayground.Api.Calculators;
using AstroPlayground.Api.HouseSystems;
using AstroPlayground.Api.Services;
using AstroPlayground.Models.Calculators;
using AstroPlayground.Models.HouseSystems;
using AstroPlayground.Models.Services;

var builder = WebApplication.CreateBuilder(args);

// ── Services ──────────────────────────────────────────────────────────────
builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter()));

// CORS - allow React dev server
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()));

// Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "AstroPlayground API", Version = "v1" });
});

// Astrology services
builder.Services.AddSingleton<IHouseSystemResolver, HouseSystemResolver>();
builder.Services.AddSingleton<SwissEphemerisCalculator>();
builder.Services.AddSingleton<IPlanetCalculator>(sp => sp.GetRequiredService<SwissEphemerisCalculator>());
builder.Services.AddSingleton<IHouseCalculator>(sp => sp.GetRequiredService<SwissEphemerisCalculator>());
builder.Services.AddScoped<IAstrologyService, AstrologyService>();

// ── Pipeline ──────────────────────────────────────────────────────────────
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "AstroPlayground API v1"));
}

app.UseHttpsRedirection();
app.UseCors();
app.MapControllers();

app.Run();
