using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StoreBackend.Api.Mappers;
using StoreBackend.Api.Models.Requests;
using StoreBackend.Exceptions;
using StoreBackend.Facade;

namespace StoreBackend.Api.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        
        private readonly IProductFacade productFacade;
        
        public ProductController(IProductFacade productFacade)
        {
            this.productFacade = productFacade;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            
            var product = await productFacade.GetAllAsync();
            var models = ProductMapper.ToModel(product);
            return Ok(models);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(Guid id)
        {
            try
            {
                var product = await productFacade.GetByIdAsync(id);
                var model = ProductMapper.ToModel(product);
                return Ok(model);
            }
            catch (ResourceNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddProduct([FromBody] CreateProductRequestModel product)
        {
            var dto = ProductMapper.ToDto(product);
            var addedProduct = await productFacade.AddAsync(dto);
            var model = ProductMapper.ToModel(addedProduct);
            return CreatedAtAction(nameof(GetProductById), new { id = model.ProductResourceId }, model);
        }

        [HttpDelete("{id}")]
public async Task<IActionResult> DeleteProduct(Guid id)
{
    try
    {
        await productFacade.DeleteAsync(id);
        return Ok();
    }
    catch (ResourceNotFoundException)
    {
        return NotFound();
    }
}


    }
}
