import { CronStatus, IEmail } from '../models/emailModel';
import { newGuid } from '../shared/functions';
import orm from './mockOrm';



/**
 * Get one email.
 * 
 * @param id 
 * @returns 
 */
async function getOne(id: string): Promise<IEmail | null> {
    const db = await orm.openDb();
    for (const email of db.emails) {
        if (email.id === id)
            return email;
    }

    return null;
}


/**
 * See if a email with the given id exists.
 * 
 * @param id 
 */
async function persists(id: string): Promise<boolean> {
    const db = await orm.openDb();
    for (const email of db.emails) {
        if (email.id === id)
            return true;
    }

    return false;
}


/**
 * Get all emails.
 * 
 * @returns 
 */
async function getAll(): Promise<IEmail[]> {
    const db = await orm.openDb();

    return db.emails;
}


/**
 * Add one email.
 * 
 * @param email 
 * @returns 
 */
async function add(email: IEmail): Promise<void> {
    const db = await orm.openDb();
    email.id = newGuid();
    email.job.status = email.job.cron === "" ? CronStatus.Disabled : CronStatus.Enabled;
    db.emails.push(email);

    return orm.saveDb(db);
}


/**
 * Update a email.
 * 
 * @param email 
 * @returns 
 */
async function update(email: IEmail): Promise<void> {
    const db = await orm.openDb();
    for (let i = 0; i < db.emails.length; i++) {
        if (db.emails[i].id === email.id) {
            email.job.status = email.job.cron === "" ? CronStatus.Disabled : CronStatus.Enabled;
            db.emails[i] = email;

            return orm.saveDb(db);
        }
    }
}


/**
 * Delete one email.
 * 
 * @param id 
 * @returns 
 */
async function deleteOne(id: string): Promise<void> {
    const db = await orm.openDb();
    for (let i = 0; i < db.emails.length; i++) {
        if (db.emails[i].id === id) {
            db.emails.splice(i, 1);

            return orm.saveDb(db);
        }
    }
}


// Export default
export default {
    getOne,
    persists,
    getAll,
    add,
    update,
    delete: deleteOne,
} as const;
