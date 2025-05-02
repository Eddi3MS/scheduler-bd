// routes/authRoutes.ts
import { Router } from 'express'
import UserController from '../controllers/UserController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { roleMiddleware } from '../middlewares/roleMiddleware'

const router = Router()

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/me', authMiddleware, UserController.me)
router.put('/me', authMiddleware, UserController.update)
router.delete('/me', authMiddleware, UserController.delete)
router.get(
  '/users',
  authMiddleware,
  roleMiddleware(['admin']),
  UserController.list
)
router.put(
  '/users/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  UserController.updateRole
)

export default router
