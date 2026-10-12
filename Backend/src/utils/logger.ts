import moment from "moment-timezone"
const datePattern = 'YYYY-MM-DD'
const timezone = process.env.APP_TIMEZONE || "EAT"
const getTimestamp = () => moment().tz(timezone).format(`${datePattern} HH:mm:ss`);

const logger = {
  info: (message: string) => console.log(`[${getTimestamp()}] INFO: ${message}`),
  warn: (message: string) => console.warn(`[${getTimestamp()}] WARN: ${message}`),
  error: (message: string) => console.error(`[${getTimestamp()}] ERROR: ${message}`),
  debug: (message: string) => console.debug(`[${getTimestamp()}] DEBUG: ${message}`),
};

export default logger;