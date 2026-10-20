
using System;
using StoreBackend.Domain.Entities;
using StoreBackend.Dto;
using StoreBackend.Exceptions;
using StoreBackend.Infrastructure.Repositories;

namespace StoreBackend.DomainService;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;

    public ProductService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public Task<List<Product>> GetAllAsync()
    {
        return _productRepository.GetAllAsync();
    }

    public Task<Product?> GetByIdAsync(Guid productId)
    {
        return _productRepository.GetByIdAsync(productId);
    }

    public Task<Product> AddAsync(ProductDto product)
    {
        var productEntity = new Product
        {
            ProductResourceId = product.ProductResourceId,
            Name = product.Name
        };

        return _productRepository.AddAsync(productEntity);
    }

    public async Task DeleteAsync(Guid productId)
    {
        var product = await _productRepository.GetByIdAsync(productId);

        if (product == null)
            throw new ResourceNotFoundException();

        await _productRepository.DeleteAsync(product);
    }
}
