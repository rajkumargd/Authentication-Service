import User from '../models/userModels';

class UserRepository {
  public async findByUsername(username: string): Promise<User | null> {
    return User.findOne({ where: { username } });
  }

  public async createUser(username: string, password: string): Promise<User> {
    return User.create({ username, password });
  }
}

export default UserRepository;