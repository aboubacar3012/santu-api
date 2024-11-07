import { Schema, Document } from 'mongoose';

export interface Client extends Document {
  type: 'PARTICULAR' | 'COMPANY';
  company: string;
  firstName: string;
  lastName: string;
  logo: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  invoices: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const ClientSchema = new Schema<Client>({
  type: { type: String, enum: ['PARTICULAR', 'COMPANY'], required: true },
  company: { type: String, default: '' },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  logo: { type: String, default: '' },
  address: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  website: { type: String, default: '' },
  invoices: [{ type: Schema.Types.ObjectId, ref: 'invoices' }],
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});
