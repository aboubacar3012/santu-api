import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { ClientsModule } from './clients/clients.module';
import { InvoicesModule } from './invoices/invoices.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [AccountsModule, ClientsModule, InvoicesModule, DatabaseModule],
})
export class AppModule {}
