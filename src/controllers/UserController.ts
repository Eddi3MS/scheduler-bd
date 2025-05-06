import { Request, Response } from 'express'
import UserService from '../services/UserService'
import { isValidObjectId } from '../utils/validators'
import { ROLES } from '../interfaces/IUser'

class UserController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body

      if (!name && !email && !password) {
        return res.status(400).json({
          message: 'Invalid parameters',
        })
      }

      const result = await UserService.register({ name, email, password })

      const expiresInSevenDay = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

      res.cookie('token', result.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        expires: expiresInSevenDay,
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

      const result = await UserService.login(email, password)

      const expiresInSevenDay = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

      res.cookie('token', result.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        expires: expiresInSevenDay,
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
      const user = await UserService.getUserById(req.user!.id)
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
      const user = await UserService.updateUser(req.user!.id, {
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
      const user = await UserService.updateUserRole(id, {
        role,
      })
      res.json(user)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await UserService.deleteUser(req.user!.id)
      res.status(204).send()
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async list(req: Request, res: Response) {
    try {
      const users = await UserService.listUsers()
      res.json(users)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}

export default new UserController()
