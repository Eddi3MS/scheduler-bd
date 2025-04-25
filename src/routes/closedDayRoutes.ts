import { Router } from 'express'
import ClosedDayController from '../controllers/ClosedDayController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { roleMiddleware } from '../middlewares/roleMiddleware'

const router = Router()

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  ClosedDayController.create
)

router.get('/', authMiddleware, ClosedDayController.list)

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  ClosedDayController.delete
)

export default router
