import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import cors from "cors";

import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import 'express-async-errors';
import basicAuth from 'express-basic-auth';

import swaggerUI from 'swagger-ui-express';
import swaggerDocument from './views/swagger.json';

import apiRouter from './routes/api';
import logger from 'jet-logger';
import { CustomError } from './shared/errors';


// Constants
const app = express();
// const swaggerDocument = require('./view/swagger.json');


/***********************************************************************************
 *                                  Middlewares
 **********************************************************************************/

// Common middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));

// Security (helmet recommended in express docs)
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
    app.use(basicAuth({
        users: { admin: process.env.BASIC_AUTH_PASS ?? "password123" },
        challenge: true
    }));
}


/***********************************************************************************
 *                         API routes and error handling
 **********************************************************************************/

// Add api router
app.use('/api', apiRouter);

// Add swagger router
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Error handling
app.use((err: Error | CustomError, _: Request, res: Response, __: NextFunction) => {
    logger.err(err, true);
    const status = (err instanceof CustomError ? err.HttpStatus : StatusCodes.BAD_REQUEST);
    return res.status(status).json({
        error: err.message,
    });
});


/***********************************************************************************
 *                                  Front-end content
 **********************************************************************************/

// Set views dir
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

// Set static dir
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Serve index.html file
app.get('/', (_: Request, res: Response) => {
    res.sendFile('index.html', { root: viewsDir });
});

// Export here and start in a diff file (for testing).
export default app;
