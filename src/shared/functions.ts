import { IEmail } from '../models/emailModel';
import logger from 'jet-logger';
import nodemailer from 'nodemailer';

/**
 * Print an error object if it's truthy. Useful for testing.
 * 
 * @param err 
 */
export function pErr(err?: Error): void {
    if (!!err)
        logger.err(err);
};


/**
 * Get a random number between 1 and 1,000,000,000,000
 * 
 * @returns 
 */
export function getRandomInt(): number {
    return Math.floor(Math.random() * 1_000_000_000_000);
};


/**
 * Get a new guid
 * 
 * @returns 
 */
export function newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Send an email
 * 
 * @param email 
 */
export function sendMail(email: IEmail) {
    let transport = nodemailer.createTransport({
        host: process.env.NODE_MAILER_HOST,
        port: Number(process.env.NODE_MAILER_PORT),
        auth: {
            user: process.env.NODE_MAILER_USER,
            pass: process.env.NODE_MAILER_PASS
        }
    });

    let mailOptions = {
        from: 'system@mail.com',
        to: email.to,
        cc: email.cc,
        ccn: email.ccn,
        subject: email.subject,
        text: email.body
    };

    transport.sendMail(mailOptions, function (error: any, info: any) {
        if (error)
            logger.err(error, true);
        else
            logger.info(info);
    });
}