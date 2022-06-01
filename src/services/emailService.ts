import emailRepository from '../repositories/emailRepository';
import { IEmail } from '../models/emailModel';
import { EmailNotFoundError } from '../shared/errors';



/**
 * Get all emails.
 * 
 * @returns 
 */
function getAll(): Promise<IEmail[]> {
    return emailRepository.getAll();
}


/**
 * Add one email.
 * 
 * @param email 
 * @returns 
 */
function addOne(email: IEmail): Promise<void> {
    return emailRepository.add(email);
}


/**
 * Update one email.
 * 
 * @param email 
 * @returns 
 */
async function updateOne(email: IEmail): Promise<void> {
    const persists = await emailRepository.persists(email.id);
    if (!persists) throw new EmailNotFoundError();

    return emailRepository.update(email);
}


/**
 * Delete a email by their id.
 * 
 * @param id 
 * @returns 
 */
async function deleteOne(id: string): Promise<void> {
    const persists = await emailRepository.persists(id);
    if (!persists) throw new EmailNotFoundError();

    return emailRepository.delete(id);
}


// Export default
export default {
    read: getAll,
    create: addOne,
    update: updateOne,
    delete: deleteOne,
} as const;
