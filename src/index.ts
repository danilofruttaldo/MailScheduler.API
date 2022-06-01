import './pre-start'; // Must be the first import
import logger from 'jet-logger';
import server from './server';
import emailRepository from './repositories/emailRepository';
import scheduleService from './services/scheduleService';


// Constants
const serverStartMsg = 'Express server started on port: ',
    port = (process.env.PORT || 3000);

// Start server
server.listen(port, async () => {
    logger.info(serverStartMsg + port);

    logger.info("Scheduled jobs starting...");
    let emails = await emailRepository.getAll();
    emails.filter(e => e.job.cron != "").forEach(e => scheduleService.create(e));
    logger.info("Scheduled jobs started");
});
