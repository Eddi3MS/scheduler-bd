import { Router } from 'express'
import ServiceController from '../controllers/ServiceController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { roleMiddleware } from '../middlewares/roleMiddleware'

const router = Router()

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  ServiceController.create
)

router.get('/', authMiddleware, ServiceController.list)

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  ServiceController.update
)

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  ServiceController.delete
)

export default router
