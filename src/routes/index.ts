import { Router } from 'express'
import serviceRoutes from './serviceRoutes'
import providerRoutes from './providerRoutes'
import appointmentRoutes from './appointmentRoutes'
import closedDatesRoutes from './closedDatesRoutes'
import weeklyClosedDayRoutes from './weeklyClosedDayRoutes'
import breakRoutes from './breakRoutes'
import authRoutes from './authRoutes'

const router = Router()

router.use('/services', serviceRoutes)
router.use('/providers', providerRoutes)
router.use('/appointments', appointmentRoutes)
router.use('/closed-dates', closedDatesRoutes)
router.use('/weekly-closed-days', weeklyClosedDayRoutes)
router.use('/breaks', breakRoutes)
router.use('/auth', authRoutes)

export default router
