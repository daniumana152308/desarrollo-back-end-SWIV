using System;

namespace StoreBackend.Api.Models.Responses;

public class ProductResponseModel{
    
    public Guid ProductResourceId { get; set; }

    public string? Name { get; set;}

}