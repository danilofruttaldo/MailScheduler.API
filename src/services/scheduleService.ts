import emailRepository from '../repositories/emailRepository';
import { IEmail } from '../models/emailModel';
import { ScheduleNotFoundError } from '../shared/errors';
import { sendMail } from '@shared/functions';
import scheduler from 'node-schedule';
import logger from 'jet-logger';



/**
 * Schedule one schedule.
 * 
 * @param email 
 * @returns 
 */
async function addOne(email: IEmail): Promise<void> {
    logger.info(`Job scheduling "${email.job.cron}" (id: ${email.job.id})`);
    scheduler.scheduleJob(email.job.id, email.job.cron, () => sendMail(email));
    logger.info('Job scheduled');
}


/**
 * Update one schedule.
 * 
 * @param email 
 * @returns 
 */
async function updateOne(email: IEmail): Promise<void> {
    const persists = await emailRepository.persists(email.id);
    if (!persists) throw new ScheduleNotFoundError();

    logger.info(`Job rescheduling "${email.job.cron}" (id: ${email.job.id})`);
    scheduler.scheduleJob(email.job.id, email.job.cron, () => sendMail(email));
    logger.info('Job rescheduled');
}


/**
 * Delete a schedule by id.
 * 
 * @param id 
 * @returns 
 */
async function deleteOne(id: string): Promise<void> {
    const email = await emailRepository.getOne(id);
    if (!email) throw new ScheduleNotFoundError();

    logger.info(`Job cancelling (id: ${email.job.id})`);
    scheduler.cancelJob(email.job.id);
    logger.info('Job cancelled');
}


// Export default
export default {
    create: addOne,
    update: updateOne,
    delete: deleteOne,
} as const;
