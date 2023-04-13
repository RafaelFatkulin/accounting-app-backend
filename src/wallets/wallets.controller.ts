import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { Wallet } from './wallets.model';
import { WalletsGuard } from './wallets.guard';
import { ValidationPipe } from '../pipes/validation.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Controller('wallets')
@UseGuards(JwtAuthGuard)
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createWalletDto: CreateWalletDto): Promise<Wallet> {
    return await this.walletsService.create(createWalletDto);
  }

  @Get()
  async findAll(@Query('userId') userId: number): Promise<Wallet[]> {
    return await this.walletsService.findAll(userId);
  }

  @Get(':id')
  @UseGuards(WalletsGuard)
  async findOne(@Param('id') id: number): Promise<Wallet> {
    return await this.walletsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(WalletsGuard)
  async update(
    @Param('id') id: number,
    @Body() updateWalletDto: UpdateWalletDto,
  ): Promise<Wallet> {
    return await this.walletsService.update(id, updateWalletDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @UseGuards(WalletsGuard)
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    return await this.walletsService.remove(id);
  }
}
