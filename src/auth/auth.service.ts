import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from '../dto';
import { User } from '../entities/user.entity';
import { RabbitMQService } from '../rabbitmq.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);

    const user = this.userRepository.create({ ...registerDto, password: hashedPassword });
    await this.userRepository.save(user);

    await this.rabbitMQService.sendMessage('user-queue', user);

    return user;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any, client: 'web' | 'mobile') {
    const payload = { email: user.email, sub: user.id };
    const expiresIn = client === 'web' ? '1d' : '7d';
    return {
      access_token: this.jwtService.sign(payload, { expiresIn }),
    };
  }
}
