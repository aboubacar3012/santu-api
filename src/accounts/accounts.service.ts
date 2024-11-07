import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from '../database/schemas/account.schema';
import { CreateAccountDto, UpdateAccountDto, AuthAccountDto, UpdatePasswordDto } from './dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { sendMail } from '../utils/sendMail';

@Injectable()
export class AccountsService {
  constructor(@InjectModel(Account.name) private accountModel: Model<Account>) {}

  async findAll(): Promise<Account[]> {
    return this.accountModel.find().populate('clients').sort({ createdAt: -1 }).lean().exec();
  }

  async findOne(id: string): Promise<Account> {
    const account = await this.accountModel.findById(id).populate('clients').exec();
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }

  async auth(authAccountDto: AuthAccountDto): Promise<any> {
    const { email, password } = authAccountDto;
    const account = await this.accountModel.findOne({ email }).populate('clients').exec();
    if (account && password.length > 0) {
      if (bcrypt.compareSync(password, account.password)) {
        const token = jwt.sign(
          { id: account._id, role: account.role, email: account.email },
          process.env.SECRET_KEY || 'santupro_key',
          { expiresIn: process.env.JWT_EXPIRE },
        );
        return { success: true, account, message: 'Connexion reussie avec success', token };
      }
    }

    if (account && password.length === 0) {
      return { exist: true, success: true, message: 'Ce utilisateur est déjà enregistré', account };
    }

    const generatedPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
    sendMail({
      to: email,
      subject: 'Votre mot de passe temporaire',
      html: `
        <p>Bonjour,</p>
        <p style="font-weight:bold">Voici votre mot de passe temporaire: ${generatedPassword}</p>
        <p>Vous pouvez vous connecter avec ce mot de passe et le changer dans votre profil</p>
      `,
    });
    const newAccount = new this.accountModel({ email, password: hashedPassword });
    await newAccount.save();
    return { created: true, success: true, account: { email, generatedPassword } };
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Promise<Account> {
    const { password } = updatePasswordDto;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const updatedAccount = await this.accountModel.findByIdAndUpdate(
      id,
      { password: hashedPassword, isFirstLogin: false },
      { new: true },
    ).exec();
    if (!updatedAccount) {
      throw new NotFoundException('Account not found');
    }
    return updatedAccount;
  }

  async update(id: string, updateAccountDto: UpdateAccountDto): Promise<Account> {
    const updatedAccount = await this.accountModel.findByIdAndUpdate(id, updateAccountDto, { new: true }).exec();
    if (!updatedAccount) {
      throw new NotFoundException('Account not found');
    }
    return updatedAccount;
  }

  async remove(id: string): Promise<void> {
    const deletedAccount = await this.accountModel.findByIdAndRemove(id).exec();
    if (!deletedAccount) {
      throw new NotFoundException('Account not found');
    }
  }
}
