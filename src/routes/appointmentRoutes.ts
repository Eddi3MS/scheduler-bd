import { Router } from 'express'
import AppointmentController from '../controllers/AppointmentController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { roleMiddleware } from '../middlewares/roleMiddleware'

const router = Router()

router.post('/', authMiddleware, AppointmentController.create)

router.get(
  '/',
  authMiddleware,
  roleMiddleware(['admin', 'provider']),
  AppointmentController.list
)

router.get(
  '/future',
  authMiddleware,
  roleMiddleware(['admin', 'provider']),
  AppointmentController.listFuture
)

router.get(
  '/list-by-provider',
  authMiddleware,
  roleMiddleware(['provider']),
  AppointmentController.listProviderAppointments
)

router.get('/me', authMiddleware, AppointmentController.listOwn)

router.get(
  '/get-available',
  authMiddleware,
  AppointmentController.getAvailableTime
)

router.get('/cancel/:id', authMiddleware, AppointmentController.cancel)

export default router
