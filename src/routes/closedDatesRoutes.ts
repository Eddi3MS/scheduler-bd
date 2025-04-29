import { Router } from 'express'
import ClosedDatesController from '../controllers/ClosedDatesController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { roleMiddleware } from '../middlewares/roleMiddleware'

const router = Router()

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  ClosedDatesController.updateClosedDates
)

router.get('/', authMiddleware, ClosedDatesController.list)

export default router
