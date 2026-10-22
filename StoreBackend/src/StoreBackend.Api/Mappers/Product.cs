using System;
using StoreBackend.Api.Models.Requests;
using StoreBackend.Api.Models.Responses;
using StoreBackend.Dto;

namespace StoreBackend.Api.Mappers
{
    public class ProductMapper
    {
        public static ProductDto ToDto(CreateProductRequestModel model)
        {
            return new ProductDto
            {
                ProductResourceId = model.ProductResourceId!.Value,
                Name = model.Name
            };
        }

        public static List<ProductResponseModel> ToModel(List<ProductDto> products)
        {
            return products.Select(p => ToModel(p)).ToList();
        }

        public static ProductResponseModel ToModel(ProductDto product)
        {
            return new ProductResponseModel
            {
                ProductResourceId = product.ProductResourceId,
                Name = product.Name
            };
        }
    }
}