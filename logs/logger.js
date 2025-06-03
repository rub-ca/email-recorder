import fs from 'fs'
import path from 'path'
import cron from 'node-cron'

const logDir = path.resolve('logs')
const logPath = path.join(logDir, 'requests.log')
const oldLogsDir = path.join(logDir, 'oldLogs')

// Ensure the oldLogs directory exists
if (!fs.existsSync(oldLogsDir)) {
  fs.mkdirSync(oldLogsDir, { recursive: true })
}

// Log middleware
export function logger (req, res, next) {
  const now = new Date()
  let info = '--------------------------------- REQUEST INFO ---------------------------------\n'
  info += `${now.toString()}\n`
  info += `Method: ${req.method}\n`
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

// Schedule task at 3:00 AM daily
cron.schedule('0 3 * * *', () => {
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  const yyyy = yesterday.getFullYear()
  const mm = String(yesterday.getMonth() + 1).padStart(2, '0')
  const dd = String(yesterday.getDate()).padStart(2, '0')

  const newLogName = `log-${yyyy}-${mm}-${dd}.log`
  const newLogPath = path.join(oldLogsDir, newLogName)

  // Move and rename the file, then create an empty log file
  fs.copyFile(logPath, newLogPath, (err) => {
    if (err) {
      console.error('Error copying log file:', err)
      return
    }

    fs.truncate(logPath, 0, (err) => {
      if (err) {
        console.error('Error clearing log file:', err)
      } else {
        console.log(`Log file archived as ${newLogName}`)
      }
    })
  })
})
