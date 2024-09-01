import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/userRepository';
import Boom from '@hapi/boom';
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

class AuthService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async register(username: string, password: string) {
    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      throw Boom.conflict('Username already exists');
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await this.userRepository.createUser(username, hashedPassword);
    
    return  { 
      id:user.id,
      username:user.username
    };
  }
  public async login(username: string, password: string): Promise<{ message: string, user: { id: number, username: string }, token: string }> {
    const user = await this.userRepository.findByUsername(username);
    
    if (!user) {
      throw Boom.unauthorized('Invalid username or password');
    }
   
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      throw Boom.unauthorized('Invalid username or password');
    }

    // generate JWT token for 1 hour
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });
    
    return {
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
      },
      token:token,
    };
    }
}

export default AuthService;
