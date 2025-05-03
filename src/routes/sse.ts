import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware'
import { roleMiddleware } from '../middlewares/roleMiddleware'

const router = Router()

let clients: { id: string; res: any }[] = []

router.get(
  '/events/:providerId',
  authMiddleware,
  roleMiddleware(['provider']),
  (req, res) => {
    const providerId = req.params.providerId

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders()

    // Store client connection
    clients.push({ id: providerId, res })

    // Clean up when connection closes
    req.on('close', () => {
      clients = clients.filter((c) => c.res !== res)
    })
  }
)

export function notifyProvider(providerId: string, data: any) {
  clients
    .filter((c) => c.id === providerId)
    .forEach((c) => c.res.write(`data: ${JSON.stringify(data)}\n\n`))
}

export default router
