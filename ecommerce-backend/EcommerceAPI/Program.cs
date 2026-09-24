using EcommerceAPIBusinessLayer;
using Microsoft.AspNetCore.Authentication.JwtBearer;  
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using EcommerceAPI.Services; 

var builder = WebApplication.CreateBuilder(args);


// Stripe configuration
Stripe.StripeConfiguration.ApiKey =
    builder.Configuration["Stripe:SecretKey"];


EcommerceBusiness.ConfigureFrontendBaseUrl(
    builder.Configuration["Frontend:BaseUrl"]
    ?? throw new Exception("Frontend:BaseUrl is missing in appsettings.json")
);


// 1. Add this CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins(
                    builder.Configuration["Frontend:BaseUrl"]
                    ?? throw new Exception("Frontend:BaseUrl is missing in appsettings.json")
            )
              .AllowAnyHeader()
              .AllowAnyMethod();
        });
});



// Configure JWT settings from appsettings.json
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];
var jwtExpireMinutes = int.Parse(builder.Configuration["Jwt:ExpireMinutes"]);


EcommerceBusiness.ConfigureJwt(jwtKey, jwtIssuer, jwtAudience, jwtExpireMinutes);


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true, 
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });



builder.Services.Configure<RouteOptions>(options => { });

builder.WebHost.ConfigureKestrel(options =>
{
    options.AllowSynchronousIO = true;
});



// Add services to the container.
builder.Services.AddControllers(); 
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your valid token.\n\nExample: Bearer eyJhbGciOiJIUzI1NiIs..."
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

builder.Services.AddTransient<EmailService>();

EcommerceBusiness.ConfigureConnectionString(
    builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new Exception("DefaultConnection is missing in configuration")
);

var app = builder.Build();


app.UseStaticFiles(); 
app.UseRouting();     

app.UseCors("AllowReactApp");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication(); 
app.UseAuthorization(); 



app.Use(async (context, next) =>
{
    if (context.Request.Path.StartsWithSegments("/api/webhook"))
    {
        context.Request.EnableBuffering();
    }
    await next();
});

app.MapControllers(); // API Controllers Routing

app.Run();

