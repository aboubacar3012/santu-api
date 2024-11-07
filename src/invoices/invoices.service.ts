import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from '../database/schemas/invoice.schema';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
  ) {}

  async getDashboardData(accountId: string) {
    const invoices = await this.invoiceModel.find({ accountId }).exec();
    const total = invoices.reduce((acc, invoice) => acc + Number(invoice.amount), 0);
    const invoicesCount = invoices.length;
    const today = new Date().toISOString().split('T')[0];
    const todayInvoices = invoices.filter(invoice => invoice.date === today);
    const totalToday = todayInvoices.reduce((acc, invoice) => acc + Number(invoice.amount), 0);
    return { invoices, total, invoicesCount, totalToday };
  }

  async getInvoiceById(id: string) {
    const invoice = await this.invoiceModel.findById(id).exec();
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    return invoice;
  }

  async createInvoice(createInvoiceDto: CreateInvoiceDto) {
    const createdInvoice = new this.invoiceModel(createInvoiceDto);
    return createdInvoice.save();
  }
}
