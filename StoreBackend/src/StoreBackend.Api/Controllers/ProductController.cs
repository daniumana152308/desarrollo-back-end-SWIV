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
            var models = ProductMapper.ToModel(products);
            return Ok(models);
        }



    }
}
