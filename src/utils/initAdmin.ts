// scripts/initAdmin.ts
import User from '../models/User'
import bcrypt from 'bcryptjs'

export async function initAdmin() {
  const existingAdmin = await User.findOne({ role: 'admin' })
  if (existingAdmin) {
    console.log('Admin já existe.')
    return
  }

  const password = await bcrypt.hash(process.env.ADMIN_PASS!, 10)

  await User.create({
    name: 'Admin',
    email: process.env.ADMIN_EMAIL!,
    password,
    role: 'admin',
  })

  console.log('Admin criado com sucesso.')
}
