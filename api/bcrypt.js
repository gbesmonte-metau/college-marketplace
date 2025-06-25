import  bcrypt from 'bcrypt'

async function hashPassword(plainPassword) {
  try {
    const hash = await bcrypt.hash(plainPassword, 10)
    return hash
  } catch (err) {
    console.error('Hashing failed (bcryptjs):', err)
    throw err
  }
}

async function verifyPassword(plainPassword, hash) {
  try {
    return await bcrypt.compare(plainPassword, hash)
  } catch (err) {
    console.error('Verification failed (bcryptjs):', err)
    return false
  }
}

export { hashPassword, verifyPassword }
