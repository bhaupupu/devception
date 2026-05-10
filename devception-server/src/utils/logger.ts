import winston from 'winston';

// In production (Render/Railway) log aggregators display raw text — ANSI colour
// codes appear as garbled escape sequences and make it harder to grep real errors.
// Only enable colour in a local TTY / development environment.
const isProduction = process.env.NODE_ENV === 'production';

const formats = [
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    const stackStr = stack ? `\n${stack}` : '';
    return `${timestamp} [${level.toUpperCase()}] ${message}${metaStr}${stackStr}`;
  }),
];

if (!isProduction) {
  // Insert colorize BEFORE the printf formatter so colour wraps the whole line
  formats.splice(1, 0, winston.format.colorize());
}

export const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  format: winston.format.combine(...formats),
  transports: [new winston.transports.Console()],
});
