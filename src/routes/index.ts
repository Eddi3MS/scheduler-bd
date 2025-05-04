import { Router, json } from 'express'
import appointmentRoutes from './appointmentRoutes'
import providerRoutes from './providerRoutes'
import serviceRoutes from './serviceRoutes'
import userRoutes from './userRoutes'
import sseRoute from './sse'

const router = Router()

router.use('/services', serviceRoutes)
router.use('/providers', providerRoutes)
router.use('/appointments', json(), appointmentRoutes)
router.use('/user', json(), userRoutes)
router.use('/events', sseRoute)

export default router
