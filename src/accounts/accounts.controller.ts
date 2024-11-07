import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto, UpdateAccountDto, AuthAccountDto, UpdatePasswordDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  async findAll() {
    return this.accountsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.accountsService.findOne(id);
  }

  @Post('auth')
  async auth(@Body() authAccountDto: AuthAccountDto) {
    return this.accountsService.auth(authAccountDto);
  }

  @Put('updatepassword/:id')
  async updatePassword(@Param('id') id: string, @Body() updatePasswordDto: UpdatePasswordDto) {
    return this.accountsService.updatePassword(id, updatePasswordDto);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountsService.update(id, updateAccountDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.accountsService.remove(id);
  }
}
