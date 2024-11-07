import { Schema, Document } from 'mongoose';

export interface Account extends Document {
  company: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'PARTNER' | 'ACCOUNT';
  logo: string;
  phone: string;
  email: string;
  address: string;
  isFirstLogin: boolean;
  password: string;
  isActive: boolean;
  clients: string[];
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export const AccountSchema = new Schema<Account>({
  company: { type: String, default: '' },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  role: { type: String, enum: ['ADMIN', 'PARTNER', 'ACCOUNT'], default: 'ACCOUNT', required: true },
  logo: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, unique: true, required: true },
  address: { type: String, default: '' },
  isFirstLogin: { type: Boolean, default: true, required: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true, required: true },
  clients: [{ type: Schema.Types.ObjectId, ref: 'clients' }],
  currency: { type: String, default: 'GNF' },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});
