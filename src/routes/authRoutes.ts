// routes/authRoutes.ts
import { Router } from 'express'
import AuthController from '../controllers/AuthController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { roleMiddleware } from '../middlewares/roleMiddleware'

const router = Router()

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.get('/me', authMiddleware, AuthController.me)
router.put('/me', authMiddleware, AuthController.update)
router.delete('/me', authMiddleware, AuthController.delete)
router.get(
  '/users',
  authMiddleware,
  roleMiddleware(['admin']),
  AuthController.list
)
router.put(
  '/users/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  AuthController.updateRole
)

export default router
