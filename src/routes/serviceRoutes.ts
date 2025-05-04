import { Router } from 'express'
import ServiceController from '../controllers/ServiceController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { roleMiddleware } from '../middlewares/roleMiddleware'
import upload from '../utils/multer'

const router = Router()

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin', 'provider']),
  upload.single('image'),
  ServiceController.create
)

router.get('/', authMiddleware, ServiceController.list)
router.get(
  '/own',
  authMiddleware,
  roleMiddleware(['provider']),
  ServiceController.listOwn
)
router.get('/:id', authMiddleware, ServiceController.getById)

router.get(
  '/by-provider/:id',
  authMiddleware,
  ServiceController.listByProviderId
)

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin', 'provider']),
  upload.single('image'),
  ServiceController.update
)

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin', 'provider']),
  ServiceController.delete
)

export default router
