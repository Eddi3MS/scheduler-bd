import { Router } from 'express'
import ProviderController from '../controllers/ProviderController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { roleMiddleware } from '../middlewares/roleMiddleware'
import upload from '../utils/multer'

const router = Router()

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['provider']),
  upload.single('image'),
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
