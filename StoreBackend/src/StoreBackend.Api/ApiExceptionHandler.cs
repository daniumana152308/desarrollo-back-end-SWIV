using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using StoreBackend.Exceptions;

namespace StoreBackend.Api;

public sealed class ApiExceptionHandler(IProblemDetailsService problemDetailsService)
    : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext context, Exception exception, CancellationToken cancellationToken)
    {
        var (status, title) = exception switch
        {
            ResourceNotFoundException => (404, "El producto no existe."),
            DbUpdateConcurrencyException => (404, "El producto ya no existe."),
            DbUpdateException { InnerException: SqlException { Number: 2601 or 2627 } }
                => (409, "Ya existe un producto con ese identificador."),
            SqlException => (503, "No se pudo acceder a la base de datos."),
            _ => (500, "No se pudo completar la solicitud.")
        };

        context.Response.StatusCode = status;
        return await problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = context,
            ProblemDetails = new ProblemDetails
            {
                Status = status,
                Title = title,
                Extensions = { ["traceId"] = context.TraceIdentifier }
            }
        });
    }
}