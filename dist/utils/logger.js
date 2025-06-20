import winston from 'winston';
const isDevelopment = process.env.NODE_ENV !== 'production';
export const createLogger = (serviceName) => {
    return winston.createLogger({
        level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
        format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.json()),
        defaultMeta: { service: serviceName },
        transports: [
            // Write to stderr to avoid interfering with MCP protocol on stdout
            new winston.transports.Console({
                stderrLevels: ['error', 'warn', 'info', 'debug'],
                format: isDevelopment
                    ? winston.format.combine(winston.format.colorize(), winston.format.simple())
                    : undefined,
            }),
        ],
    });
};
//# sourceMappingURL=logger.js.map