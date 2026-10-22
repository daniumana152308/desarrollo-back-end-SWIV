using System;
using System.ComponentModel.DataAnnotations;

namespace StoreBackend.Api.Models.Requests;

public class CreateProductRequestModel
{
    [Required]
    public Guid? ProductResorceId { get; set; }

    [Required]
    [MaxLength(50)]
    public string? Name { get; set;}

}