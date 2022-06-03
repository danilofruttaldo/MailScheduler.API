import emailRepository from '../repositories/emailRepository';
import { IEmail } from '../models/emailModel';
import { EmailNotFoundError } from '../shared/errors';
import logger from 'jet-logger';


/**
 * Get all emails.
 * 
 * @returns 
 */
function getAll(): Promise<IEmail[]> {
    return emailRepository.getAll();
}

/**
 * Get an email.
 * 
 * @param id 
 * @returns 
 */
 async function getOne(id: string): Promise<IEmail> {
    const exists = await emailRepository.exists(id);
    if (!exists) throw new EmailNotFoundError();

    return emailRepository.getOne(id);
}

/**
 * Create an email.
 * 
 * @param email 
 * @returns 
 */
function addOne(email: IEmail): Promise<void> {
    return emailRepository.add(email);
}


/**
 * Update an email.
 * 
 * @param email 
 * @returns 
 */
async function updateOne(email: IEmail): Promise<void> {
    const exists = await emailRepository.exists(email.id);
    if (!exists) throw new EmailNotFoundError();

    return emailRepository.update(email);
}


/**
 * Delete an email by id.
 * 
 * @param id 
 * @returns 
 */
async function deleteOne(id: string): Promise<void> {
    const exists = await emailRepository.exists(id);
    if (!exists) throw new EmailNotFoundError();

    return emailRepository.delete(id);
}


// Export default
export default {
    readAll: getAll,
    read: getOne,
    create: addOne,
    update: updateOne,
    delete: deleteOne,
} as const;
