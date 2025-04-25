import { Router } from 'express'
import BreakController from '../controllers/BreakController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { roleMiddleware } from '../middlewares/roleMiddleware'

const router = Router()

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  BreakController.create
)

router.get('/', authMiddleware, BreakController.list)

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  BreakController.delete
)

export default router
