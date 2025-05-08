import { ICreateUser, IUser } from '../interfaces/IUser'
import User from '../models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

interface LoginResult {
  user: Omit<IUser, 'password'>
  token: string
}

class UserService {
  async register(data: ICreateUser): Promise<LoginResult> {
    const { name, email, password } = data

    const existingUser = await User.findOne({ email })
    if (existingUser) throw new Error('Email já cadastrado')

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ name, email, password: hashedPassword })
    await user.save()

    const token = this.generateToken(user)
    const { password: _, ...userData } = user.toObject()

    return { user: userData as any, token }
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await User.findOne({ email })
    if (!user) throw new Error('Usuário não encontrado')

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw new Error('Senha inválida')

    const token = this.generateToken(user)

    const { password: _, ...userData } = user.toObject()

    return { user: userData as any, token }
  }

  async getUserById(id: string): Promise<Omit<IUser, 'password'>> {
    const user = await User.findById(id).select('-password')
    if (!user) throw new Error('Usuário não encontrado')
    return user
  }

  async updateUser(
    id: string,
    updates: Partial<IUser>
  ): Promise<Omit<IUser, 'password'>> {
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10)
    }

    const updated = await User.findByIdAndUpdate(id, updates, {
      new: true,
    }).select('-password')
    if (!updated) throw new Error('Usuário não encontrado')

    return updated
  }

  async updateUserRole(
    id: string,
    updates: Partial<IUser>
  ): Promise<Omit<IUser, 'password'>> {
    const updated = await User.findByIdAndUpdate(id, updates, {
      new: true,
    }).select('-password')
    if (!updated) throw new Error('Usuário não encontrado')

    return updated
  }

  async deleteUser(id: string): Promise<void> {
    const deleted = await User.findByIdAndDelete(id)
    if (!deleted) throw new Error('Usuário não encontrado')
  }

  async listUsers(): Promise<Omit<IUser, 'password'>[]> {
    return await User.find().select('-password')
  }

  private generateToken(user: IUser): string {
    return jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
  }
}

export default new UserService()
