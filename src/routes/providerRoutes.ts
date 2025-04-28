import { Router } from 'express'
import ProviderController from '../controllers/ProviderController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { roleMiddleware } from '../middlewares/roleMiddleware'

const router = Router()

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  ProviderController.create
)

router.get('/', authMiddleware, ProviderController.list)

router.get('/:id', authMiddleware, ProviderController.getById)
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  ProviderController.update
)

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  ProviderController.delete
)

export default router
