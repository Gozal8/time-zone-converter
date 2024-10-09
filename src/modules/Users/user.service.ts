import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './models/user.model';
import { CreateUserDto } from './dtos/create-user.dtos';
import { UpdateUserDto } from './dtos/update-user.dtos';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // Yangi foydalanuvchi yaratish
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;

    // Foydalanuvchini tekshirish
    // const existingUser = await this.usersRepository.findOne({
    //   where: [{ username }, { email }],
    // });

    // if (existingUser) {
    //   throw new ConflictException('Username yoki Email allaqachon mavjud');
    // }

    // Parolni hash qilish
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash( salt);

    const user = this.usersRepository.create({
 
      email,
      passwordHash,
    });

    return this.usersRepository.save(user);
  }

  // Barcha foydalanuvchilarni olish
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // ID bo‘yicha foydalanuvchini olish
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} topilmadi`);
    }
    return user;
  }

  // Username bo‘yicha foydalanuvchini topish
  async findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username } });
  }

  // Foydalanuvchini autentifikatsiya qilish
  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.findByUsername(username);
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  // JWT token yaratish
  async login(user: User): Promise<{ accessToken: string }> {
    const payload: JwtPayload = { username: user.username };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  // Foydalanuvchini yangilash
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      user.passwordHash = await bcrypt.hash(updateUserDto.password, salt);
    }

    if (updateUserDto.username) {
      user.username = updateUserDto.username;
    }

    if (updateUserDto.email) {
      user.email = updateUserDto.email;
    }

    return this.usersRepository.save(user);
  }

  // Foydalanuvchini o‘chirish
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}



  


