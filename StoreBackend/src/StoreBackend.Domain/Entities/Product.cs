
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StoreBackend.Domain.Entities;

[Table("Product")]
public class Product
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ProductId { get; private set; }

    [Required]
    public Guid ProductResourceId { get; set; }

    [Column("Name")]
    [StringLength(50)]
    public string? Name { get; set; }
}
