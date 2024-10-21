import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  NotFoundException,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDTO, UpdateProductDTO } from './products.dto';
import { UserRolesE } from 'src/core/users-management/common/constants';
import {
  AllowedTo,
  AuthGuard,
} from 'src/core/users-management/features/auth/auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @AllowedTo(UserRolesE.ADMIN)
  async createProduct(@Body() body: CreateProductDTO) {
    return await this.productsService.createProduct(body);
  }

  @Get(':id')
  async getProductDetails(
    @Param('id') id: number, // Accept product ID from route
    @Query('country_code') countryCode: string,
    @Query('currency_code') currencyCode: string,
    @Query('variant_options') variantOptions: string, // Comma-separated options like "1,4" for Size: Small, Color: Red
  ) {
    if (!countryCode || !currencyCode || !variantOptions) {
      throw new NotFoundException(
        'Country, currency, and variant options are required.',
      );
    }

    return await this.productsService.getProductDetails(
      id,
      countryCode,
      currencyCode,
      variantOptions,
    );
  }

  @Get(':id/available-variants')
  async getAvailableVariants(
    @Param('id') id: number,
    @Query('selected_options') selectedOptions: string, // Comma-separated selected options, e.g., "5"
  ) {
    const options = selectedOptions.split(',').map(Number);
    return await this.productsService.getAvailableVariants(id, options);
  }

  @Put(':id')
  async updateProduct(@Param('id') id: number, @Body() body: UpdateProductDTO) {
    return await this.productsService.updateProduct(id, body);
  }
  @Delete()
  @UseGuards(AuthGuard)
  @AllowedTo(UserRolesE.ADMIN)
  async deleteProducts(@Body('ids') ids: number[]) {
    return await this.productsService.deleteProducts(ids);
  }
}
