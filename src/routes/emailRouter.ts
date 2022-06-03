import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';

import emailService from '../services/emailService';
import { ParamMissingError } from '../shared/errors';
import { CronStatus } from "../models/cronStatus";
import scheduleService from '@services/scheduleService';


// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    readAll: '/',
    readOne: '/:id',
    create: '/',
    update: '/',
    delete: '/:id',
} as const;



/**
 * Get all emails.
 */
router.get(p.readAll, async (_: Request, res: Response) => {
    const emails = await emailService.readAll();

    return res.status(OK).json({ emails });
});

/**
 * Get an email.
 */
 router.get(p.readOne, async (req: Request, res: Response) => {
    const { id } = req.params;
    // Check param
    if (!id) throw new ParamMissingError();

    const emails = await emailService.read(id);

    return res.status(OK).json({ emails });
});


/**
 * Add an email.
 */
router.post(p.create, async (req: Request, res: Response) => {
    const { email } = req.body;
    // Check param
    if (!email) throw new ParamMissingError();

    email.job.status = email.job.cron === "" ? CronStatus.Disabled : CronStatus.Enabled;

    // Fetch data
    await emailService.create(email);
    await scheduleService.create(email);

    return res.status(CREATED).end();
});


/**
 * Update an email.
 */
router.put(p.update, async (req: Request, res: Response) => {
    const { email } = req.body;
    
    // Check param
    if (!email) throw new ParamMissingError();

    // Fetch data

    await emailService.update(email);
    if (email.job.cron == "")
        await scheduleService.delete(email.id);
    else
        await scheduleService.update(email);

    return res.status(OK).end();
});


/**
 * Delete an email.
 */
router.delete(p.delete, async (req: Request, res: Response) => {
    const { id } = req.params;
    // Check param
    if (!id) throw new ParamMissingError();

    // Fetch data
    await scheduleService.delete(id);
    await emailService.delete(id);

    return res.status(OK).end();
});


// Export default
export default router;
