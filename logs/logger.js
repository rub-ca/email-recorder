import fs from 'fs'
import path from 'path'

const logPath = path.resolve('logs/requests.log')
// logger.js
export function logger (req, res, next) {
  const now = new Date()
  let info = '--------------------------------- REQUEST INFO ---------------------------------\n'
  info += `${now.toString()}\n`
  info += `Método: ${req.method}\n`
  info += `URL: ${req.url}\n\n`
  info += `Headers: ${JSON.stringify(req.headers, null, 2)}\n\n`
  info += `Query: ${JSON.stringify(req.query, null, 2)}\n\n`
  info += `Params: ${JSON.stringify(req.params, null, 2)}\n\n`
  info += `Body: ${JSON.stringify(req.body, null, 2)}\n\n`
  info += `Cookies: ${JSON.stringify(req.cookies, null, 2)}\n\n`
  info += `IP: ${req.ip}\n`
  info += '--------------------------------------------------------------------------------\n\n\n\n'

  fs.appendFile(logPath, info, (err) => {
    if (err) {
      console.error('Error writing log:', err)
    }
  })

  next()
}
