import { Router } from 'express'
import appointmentRoutes from './appointmentRoutes'
import providerRoutes from './providerRoutes'
import serviceRoutes from './serviceRoutes'
import userRoutes from './userRoutes'

const router = Router()

router.use('/services', serviceRoutes)
router.use('/providers', providerRoutes)
router.use('/appointments', appointmentRoutes)
router.use('/user', userRoutes)

export default router
