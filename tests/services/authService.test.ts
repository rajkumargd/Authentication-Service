import AuthService from '../../src/services/authService';
import UserRepository from '../../src/repositories/userRepository';
import Boom from '@hapi/boom';
import User from '../../src/models/userModels';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../../src/repositories/userRepository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken'); 

const userRepositoryMock = new UserRepository() as jest.Mocked<UserRepository>;
const authService = new AuthService(userRepositoryMock);

const mockUser = {
  id: 1,
  username: 'testuser1',
  password: 'password123',
  
} as unknown as User;
describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('register a new user if username does not exist', async () => {
    
    const RegUsername = 'testuser1';
    const RegPassword = 'password123';
    const RegHashedPassword = await bcrypt.hash(RegPassword, 10);
    const mergedhasedUser = Object.assign({}, mockUser, { password: RegHashedPassword });
    userRepositoryMock.findByUsername.mockResolvedValue(null);
    userRepositoryMock.createUser.mockResolvedValue(mergedhasedUser);

    const bcryptHashSpy = jest.spyOn(bcrypt, 'hash').mockImplementation((password, saltRounds) => Promise.resolve(RegHashedPassword));

    const user = await authService.register(RegUsername, RegPassword);

    expect(user).toEqual(mergedhasedUser);
    expect(userRepositoryMock.findByUsername).toHaveBeenCalledWith(RegUsername);
    expect(userRepositoryMock.createUser).toHaveBeenCalledWith(RegUsername, RegHashedPassword);
    expect(bcryptHashSpy).toHaveBeenCalledWith(RegPassword, 10);

  });

  it('throw error if username already exist', async () => {
    
    const username = 'testuser1';
    const password = 'password123';
    userRepositoryMock.findByUsername.mockResolvedValue(mockUser);
   
    await expect(authService.register(username, password)).rejects.toThrow(Boom.conflict('Username already exists'));
    expect(userRepositoryMock.findByUsername).toHaveBeenCalledWith(username);
    expect(userRepositoryMock.createUser).not.toHaveBeenCalled();
  });
  it('validate password during login', async () => {
    const username = 'testuser1';
    const password = 'password123';
    const token = 'mocktoken'; 

    const hashedPassword = await bcrypt.hash(password, 10);
    const mergedhasedUser = Object.assign({}, mockUser, { password: hashedPassword });
    userRepositoryMock.findByUsername.mockResolvedValue(mergedhasedUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue(token);  


    const result = await authService.login(username, password);
    expect(result).toEqual({
      message: 'Login successful',
      user: {
        id: mockUser.id,
        username: mockUser.username,
      },
      token:token,
    });
    
    expect(userRepositoryMock.findByUsername).toHaveBeenCalledWith(username);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
  });

  it('throw an error if password is incorrect', async () => {
    const username = 'testuser1';
    const incorrectPassword = 'password1234';

    userRepositoryMock.findByUsername.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false); 


    await expect(authService.login(username, incorrectPassword)).rejects.toThrow(Boom.unauthorized('Invalid username or password'));
    expect(userRepositoryMock.findByUsername).toHaveBeenCalledWith(username);
    expect(bcrypt.compare).toHaveBeenCalledWith(incorrectPassword, mockUser.password);
  });
});
