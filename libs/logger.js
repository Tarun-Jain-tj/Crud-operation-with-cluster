var winston = require('winston');
/**
 * Sets up and returns global winston logger instance.
 * @return {winston.Logger}
 */
function setupLogger() {
    // setup winston logger
    var winstonLogger = new winston.Logger();
    // winstonLogger.add(winston.transports.DailyRotateFile);
    winstonLogger.add(winston.transports.DailyRotateFile, { filename: './error.log',maxsize: 1024 * 1024,datePattern: '.MM--dd-yyyy'});
    return winstonLogger;
}

/**
 * Global winston logger instance.
 * @type {winston.Logger}
 */
module.exports = setupLogger();
