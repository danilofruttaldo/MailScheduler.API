import { newGuid } from "../shared/functions";
import { CronStatus } from "./cronStatus";

// Job schema
export interface IJob {
    id: string,
    cron: string;
    status: CronStatus;
}

/**
 * Get a new job object.
 * 
 * @returns 
 */
function getNew(cron: string): IJob {
    return {
        id: newGuid(),
        cron,
        status: cron == "" ? CronStatus.Disabled : CronStatus.Enabled
    };
}


/**
 * Copy a job object.
 * 
 * @param job 
 * @returns 
 */
function copy(job: IJob): IJob {
    return {
        id: job.id,
        cron: job.cron,
        status: job.status
    }
}


// Export default
export default {
    new: getNew,
    copy,
}