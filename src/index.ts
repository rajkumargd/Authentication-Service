import * as dotenv from 'dotenv';
dotenv.config();

import logger from './config/logger';
import app from './app';

// Global unhandled promise rejection handler
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Global uncaught exception handler
process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception thrown:', error);
    process.exit(1);
});

const port = process.env.PORT || 3001; 

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});