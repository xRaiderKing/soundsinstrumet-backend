// helpers/logger.js
import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";

// Obtener la ruta del proyecto
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carpeta de logs
const logsDir = path.join(__dirname, "../logs");

// Configurar Winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} | ${level.toUpperCase()} | ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: `${logsDir}/error.log`, level: 'error' }),
    new winston.transports.File({ filename: `${logsDir}/app.log` }),
  ],
});

// Mostrar también en consola si no es producción
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
