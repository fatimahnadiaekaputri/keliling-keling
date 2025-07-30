const jwt = require('jsonwebtoken')

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization
  const tokenFromHeader = authHeader && authHeader.startsWith('Bearer') ? authHeader.split(' ')[1] : null
  const tokenFromCookie = req.cookies?.token

  const token = tokenFromHeader || tokenFromCookie

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: token not found' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' })
  }
}

module.exports = { authenticate }
