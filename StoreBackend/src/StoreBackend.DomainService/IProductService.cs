
using System;
using StoreBackend.Domain.Entities;
using StoreBackend.Dto;

namespace StoreBackend.DomainService;

public interface IProductService
{
    Task<List<Product>> GetAllAsync();
    Task<Product?> GetByIdAsync(Guid productId);
    Task<Product> AddAsync(ProductDto product);
    Task DeleteAsync(Guid productId);
}
