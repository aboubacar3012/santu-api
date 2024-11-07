import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from '../database/schemas/client.schema';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name) private readonly clientModel: Model<Client>,
  ) {}

  async findAll(): Promise<Client[]> {
    return this.clientModel.find().exec();
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientModel.findById(id).exec();
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const newClient = new this.clientModel(createClientDto);
    return newClient.save();
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const existingClient = await this.clientModel
      .findByIdAndUpdate(id, updateClientDto, { new: true })
      .exec();

    if (!existingClient) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return existingClient;
  }

  async remove(id: string): Promise<void> {
    const result = await this.clientModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
  }
}
