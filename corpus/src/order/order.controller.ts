import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { SearchOrdersDto } from './dto/search-orders.dto';
import { Order } from './entities/order.entity';
import { SearchOrdersAdvancedDto } from './dto/search-orders-advanced';
import { PaginatedOrders } from './order.repository';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova ordem médica' })
  @ApiResponse({ status: 201, type: Order })
  @ApiResponse({ status: 400, description: 'Episódio já encerrado' })
  @ApiResponse({ status: 404, description: 'Episódio não encontrado' })
  create(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.orderService.createOrder(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca ordem médica por ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: Order })
  @ApiResponse({ status: 404, description: 'Ordem não encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Order> {
    return this.orderService.getOrderById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Busca ordens com filtros básicos' })
  @ApiResponse({ status: 200, type: [Order] })
  search(@Query() dto: SearchOrdersDto): Promise<Order[]> {
    return this.orderService.searchOrders(dto);
  }

  @Get('advanced/search')
  @ApiOperation({
    summary: 'Busca avançada de ordens com paginação e ordenação dinâmica',
  })
  searchAdvanced(
    @Query() dto: SearchOrdersAdvancedDto,
  ): Promise<PaginatedOrders> {
    return this.orderService.searchOrdersAdvanced(dto);
  }
}
