import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { UserWithoutPassword } from '../types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserWithoutPassword | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserWithoutPassword) {
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role 
    };
    
    const secret = this.configService.get<string>('security.jwt.secret');
    const expiresIn = this.configService.get<string>('security.jwt.expiresIn');
    
    return {
      access_token: this.jwtService.sign(payload, { secret, expiresIn }),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(email: string, password: string, name: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    if (password.length < 8) {
      throw new UnauthorizedException('Senha deve ter pelo menos 8 caracteres');
    }

    const rounds = this.configService.get<number>('security.bcrypt.rounds');
    const hashedPassword = await bcrypt.hash(password, rounds);
    
    return this.usersService.create({
      email,
      password: hashedPassword,
      name,
      role: 'CLIENT',
    });
  }
}
