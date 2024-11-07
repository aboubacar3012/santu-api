import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSchema } from './schemas/account.schema';
import { ClientSchema } from './schemas/client.schema';
import { InvoiceSchema } from './schemas/invoice.schema';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([
      { name: 'Account', schema: AccountSchema },
      { name: 'Client', schema: ClientSchema },
      { name: 'Invoice', schema: InvoiceSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
