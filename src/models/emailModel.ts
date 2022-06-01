import { newGuid } from "../shared/functions";
import { IJob } from "./jobModel";

// Email schema
export interface IEmail {
    id: string,
    to: string[];
    cc: string[];
    ccn: string[];
    subject: string;
    body: string;
    job: IJob;
}


/**
 * Get a new email object.
 * 
 * @returns 
 */
function getNew(
    to: string[],
    cc: string[],
    ccn: string[],
    subject: string,
    body: string,
    job: any
): IEmail {
    return {
        id: newGuid(),
        to,
        cc,
        ccn,
        subject,
        body,
        job
    };
}


/**
 * Copy a email object.
 * 
 * @param email 
 * @returns 
 */
function copy(email: IEmail)
    : IEmail {
    return {
        id: email.id,
        to: email.to,
        cc: email.cc,
        ccn: email.ccn,
        subject: email.subject,
        body: email.body,
        job: email.job
    }
}


// Export default
export default {
    new: getNew,
    copy,
}