using Microsoft.AspNetCore.Mvc;
using StoreBackend.Api.Mappers;
using StoreBackend.Api.Models.Requests;
using StoreBackend.Facade;

namespace StoreBackend.Api.Controllers;

[Route("api/products")]
[ApiController]
public class ProductController(IProductFacade productFacade) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetProducts()
    {
        var products = await productFacade.GetAllAsync();
        return Ok(ProductMapper.ToModel(products));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductById(Guid id)
    {
        var product = await productFacade.GetByIdAsync(id);
        return Ok(ProductMapper.ToModel(product));
    }

    [HttpPost]
    public async Task<IActionResult> AddProduct([FromBody] CreateProductRequestModel product)
    {
        var addedProduct = await productFacade.AddAsync(ProductMapper.ToDto(product));
        var model = ProductMapper.ToModel(addedProduct);
        return CreatedAtAction(nameof(GetProductById), new { id = model.ProductResourceId }, model);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(Guid id)
    {
        await productFacade.DeleteAsync(id);
        return NoContent();
    }
}