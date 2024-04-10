import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsClient.send({cmd: 'create_product'}, createProductDto).pipe(
      catchError( error => { throw new RpcException(error)})
    );
  }

  @Get()
  findAllProducts(@Query() paginationDto:PaginationDto ) {
    return this.productsClient.send({cmd: 'find_all_products'}, paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    // try{
    //   const product = await firstValueFrom(this.productsClient.send({cmd: 'find_one_by_id'}, {id}));
    //   return product;
    // }catch (error){
    //   throw new RpcException(error);
    // }
    return this.productsClient.send({cmd: 'find_one_by_id'}, {id})
    .pipe(
      catchError( error => { throw new RpcException(error)})
    );
  }

  @Patch(':id')
  patchProduct( @Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsClient.send({cmd: 'update_product'}, {id, ...updateProductDto})
    .pipe(
      catchError( error => { throw new RpcException(error)})
    );
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsClient.send({cmd:'remove_product'},{id})
    .pipe(
      catchError( error => { throw new RpcException(error)})
    );
  }
}
