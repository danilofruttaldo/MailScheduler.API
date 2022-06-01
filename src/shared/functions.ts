import { IEmail } from '../models/emailModel';
import logger from 'jet-logger';
import nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import emailRepository from '../repositories/emailRepository';
import scheduleService from '../services/scheduleService';

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
export async function sendMail(email: IEmail) {
    logger.info("Mail sending...");
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
        body: email.body
    };

    logger.info(`Mail to: ${email.to}`);
    logger.info(`Mail cc: ${email.cc}`);
    logger.info(`Mail ccn: ${email.ccn}`);
    logger.info(`Mail subject: ${email.subject}`);
    logger.info(`Mail body: ${email.body}`);

    transport.sendMail(mailOptions);
    logger.info("Mail sent");
}