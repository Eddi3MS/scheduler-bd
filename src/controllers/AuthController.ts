import { Request, Response } from 'express'
import authService from '../services/authService'
import { isValidObjectId } from '../utils/validators'
import { ROLES } from '../interfaces/IUser'

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body

      if (!name && !email && !password) {
        return res.status(400).json({
          message: 'Invalid parameters',
        })
      }

      const result = await authService.register({ name, email, password })

      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time (7 days)
      })

      res.status(201).json(result.user)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        return res.status(400).json({
          message: 'All fields are required: email, password',
        })
      }

      const result = await authService.login(email, password)

      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time (7 days)
      })

      res.json(result.user)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async me(req: Request, res: Response) {
    try {
      const id = req.user?.id
      if (!id) {
        return res.status(400).json({
          message: 'Not Authorized',
        })
      }
      const user = await authService.getUserById(req.user!.id)
      res.json(user)
    } catch (error: any) {
      res.status(404).json({ error: error.message })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body

      if (!name && !email && !password) {
        return res.status(400).json({
          message: 'Invalid parameters',
        })
      }
      const user = await authService.updateUser(req.user!.id, {
        name,
        email,
        password,
      })
      res.json(user)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async updateRole(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { role } = req.body

      if (!ROLES.includes(role) || !isValidObjectId(id)) {
        return res.status(400).json({
          message: 'Invalid parameters',
        })
      }
      const user = await authService.updateUserRole(id, {
        role,
      })
      res.json(user)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await authService.deleteUser(req.user!.id)
      res.status(204).send()
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async list(req: Request, res: Response) {
    try {
      const users = await authService.listUsers()
      res.json(users)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}

export default new AuthController()
