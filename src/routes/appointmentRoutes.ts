import { Router } from 'express'
import AppointmentController from '../controllers/AppointmentController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { roleMiddleware } from '../middlewares/roleMiddleware'

const router = Router()

router.post('/', authMiddleware, AppointmentController.create)

router.get(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  AppointmentController.list
)

router.get(
  '/future',
  authMiddleware,
  roleMiddleware(['admin']),
  AppointmentController.listFuture
)

router.get('/me', authMiddleware, AppointmentController.listOwn)

router.get(
  '/get-available',
  authMiddleware,
  AppointmentController.getAvailableTime
)

export default router
