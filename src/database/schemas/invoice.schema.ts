import { Schema, Document } from 'mongoose';

export interface Invoice extends Document {
  invoiceNumber: string;
  name: string;
  link: string;
  date: string;
  amount: string;
  paymentMode: 'CASH' | 'OM' | 'CB' | 'VIREMENT';
  status: 'DRAFT' | 'SENT' | 'PAID' | 'CANCELLED';
  paymentCondition: 'NOW' | '15' | '30' | '45' | '60' | 'UPONRECEIPT';
  tva: string;
  remark: string;
  articles: {
    name: string;
    description: string;
    quantity: string;
    price: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  client: string;
  createdAt: Date;
  updatedAt: Date;
}

export const InvoiceSchema = new Schema<Invoice>({
  invoiceNumber: { type: String, required: true },
  name: { type: String, required: true },
  link: { type: String, default: '' },
  date: { type: String, required: true },
  amount: { type: String, required: true },
  paymentMode: { type: String, enum: ['CASH', 'OM', 'CB', 'VIREMENT'], required: true },
  status: { type: String, enum: ['DRAFT', 'SENT', 'PAID', 'CANCELLED'], default: 'DRAFT', required: true },
  paymentCondition: { type: String, enum: ['NOW', '15', '30', '45', '60', 'UPONRECEIPT'], required: true },
  tva: { type: String },
  remark: { type: String },
  articles: [
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      quantity: { type: String, default: '1', required: true },
      price: { type: String, required: true },
      createdAt: { type: Date, default: Date.now, required: true },
      updatedAt: { type: Date, default: Date.now, required: true },
    },
  ],
  client: { type: Schema.Types.ObjectId, ref: 'clients', required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});
