import { Router } from 'express'
import WeeklyClosedDayController from '../controllers/WeeklyClosedDayController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { roleMiddleware } from '../middlewares/roleMiddleware'

const router = Router()

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  WeeklyClosedDayController.updateClosedDays
)

router.get('/', authMiddleware, WeeklyClosedDayController.list)

export default router
