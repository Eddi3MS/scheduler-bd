import { Router } from 'express'
import WeeklyClosedDayController from '../controllers/WeeklyClosedDayController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { roleMiddleware } from '../middlewares/roleMiddleware'

const router = Router()

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  WeeklyClosedDayController.create
)

router.get('/', authMiddleware, WeeklyClosedDayController.list)

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  WeeklyClosedDayController.delete
)

export default router
