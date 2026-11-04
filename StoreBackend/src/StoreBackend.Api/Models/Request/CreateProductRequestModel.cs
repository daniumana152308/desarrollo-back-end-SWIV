using System.ComponentModel.DataAnnotations;

namespace StoreBackend.Api.Models.Requests;

public class CreateProductRequestModel : IValidatableObject
{
    // Optional for new clients; preserve compatibility with clients supplying an ID.
    public Guid? ProductResourceId { get; set; }

    private string? name;

    [Required(ErrorMessage = "El nombre es obligatorio.")]
    [StringLength(50, MinimumLength = 2,
        ErrorMessage = "El nombre debe tener entre 2 y 50 caracteres.")]
    public string? Name
    {
        get => name;
        set => name = value?.Trim();
    }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (ProductResourceId == Guid.Empty)
        {
            yield return new ValidationResult(
                "El identificador no puede ser un GUID vacío.", [nameof(ProductResourceId)]);
        }
    }
}