import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get('dashboard/:accountId')
  async getDashboardData(@Param('accountId') accountId: string) {
    return this.invoicesService.getDashboardData(accountId);
  }

  @Get(':id')
  async getInvoiceById(@Param('id') id: string) {
    return this.invoicesService.getInvoiceById(id);
  }

  @Post('create')
  async createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.createInvoice(createInvoiceDto);
  }
}
