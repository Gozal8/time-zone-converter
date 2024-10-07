import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dtos';
import { UpdateUserDto } from './dtos/update-user.dtos';
import { AuthDto } from './dtos/auth.dtos';
import { User } from './models/user.model';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Yangi foydalanuvchi yaratish
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  // Foydalanuvchini autentifikatsiya qilish
  @Post('login')
  async login(@Body() authDto: AuthDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.validateUser(authDto.username, authDto.password);
    return this.usersService.login(user);
  }

  // Barcha foydalanuvchilarni olish (auth bilan himoyalangan)
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // ID bo‘yicha foydalanuvchini olish (auth bilan himoyalangan)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  // Foydalanuvchini yangilash (auth bilan himoyalangan)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  // Foydalanuvchini o‘chirish (auth bilan himoyalangan)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}


