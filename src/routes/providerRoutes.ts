import { Router } from 'express'
import ProviderController from '../controllers/ProviderController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { roleMiddleware } from '../middlewares/roleMiddleware'

const router = Router()

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['provider']),
  ProviderController.createOrUpdate
)

router.get('/', authMiddleware, ProviderController.list)

router.get('/user-id/:id', authMiddleware, ProviderController.getByUserId)

router.get('/:id', authMiddleware, ProviderController.getById)

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  ProviderController.delete
)

export default router
