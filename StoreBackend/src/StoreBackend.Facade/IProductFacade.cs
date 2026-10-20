
using System;
using StoreBackend.Dto;

namespace StoreBackend.Facade;

public interface IProductFacade
{
    Task<List<ProductDto>> GetAllAsync();
    Task<ProductDto> GetByIdAsync(Guid productId);
    Task<ProductDto> AddAsync(ProductDto product);
    Task DeleteAsync(Guid productId);
}
