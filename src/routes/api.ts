import { Router } from 'express';
import emailRouter from './emailRouter';


// Export the base-router
const baseRouter = Router();

// Setup routers
baseRouter.use('/emails', emailRouter);

// Export default.
export default baseRouter;