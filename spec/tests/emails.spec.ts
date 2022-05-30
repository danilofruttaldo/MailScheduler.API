import supertest from 'supertest';
import StatusCodes from 'http-status-codes';
import { SuperTest, Test, Response } from 'supertest';

import app from '../../src/server';
import emailRepo from '../../src/repositories/emailRepository';
import Email, { CronStatus, IEmail } from '../../src/models/emailModel';
import { pErr } from '../../src/shared/functions';
import { p as emailPaths } from '../../src/routes/emailRouter';
import { ParamMissingError, EmailNotFoundError } from '../../src/shared/errors';

type TReqBody = string | object | undefined;


describe('emailRouter', () => {

    const emailsPath = '/api/emails';
    const getEmailsPath = `${emailsPath}${emailPaths.read}`;
    const addEmailsPath = `${emailsPath}${emailPaths.create}`;
    const updateEmailPath = `${emailsPath}${emailPaths.update}`;
    const deleteEmailPath = `${emailsPath}${emailPaths.delete}`;

    const { BAD_REQUEST, CREATED, OK } = StatusCodes;
    let agent: SuperTest<Test>;

    beforeAll((done) => {
        agent = supertest.agent(app);
        done();
    });


    /***********************************************************************************
     *                                    Test Get
     **********************************************************************************/

    describe(`"GET:${getEmailsPath}"`, () => {

        it(`should return a JSON object with all the emails and a status code of "${OK}" if the
            request was successful.`, (done) => {
            // Setup spy
            const emails = [
                Email.new([], ["cc1@email.com"], ["ccn1@email.com"], "Subject 1", "Body 1", { Cron: "* * * * * *", Status: "" }),
                Email.new(['to2@email.com'], [], ["ccn2@email.com"], "Subject 2", "Body 2", { Cron: "* * * * * *", Status: "" }),
                Email.new(['to3@email.com'], ["cc3@email.com"], [], "Subject 3", "Body 3", { Cron: "* * * * * *", Status: "" })
            ];
            spyOn(emailRepo, 'getAll').and.returnValue(Promise.resolve(emails));
            // Call API
            agent.get(getEmailsPath)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    // Caste instance-objects to 'Email' objects
                    const respEmails = res.body.emails;
                    const retEmails: IEmail[] = respEmails.map((email: IEmail) => {
                        return Email.copy(email);
                    });
                    expect(retEmails).toEqual(emails);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object containing an error message and a status code of
            "${BAD_REQUEST}" if the request was unsuccessful.`, (done) => {
            // Setup spy
            const errMsg = 'Could not fetch emails.';
            spyOn(emailRepo, 'getAll').and.throwError(errMsg);
            // Call API
            agent.get(getEmailsPath)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    console.log(res.body)
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(errMsg);
                    done();
                });
        });
    });


    /***********************************************************************************
     *                                    Test Post
     **********************************************************************************/

    describe(`"POST:${addEmailsPath}"`, () => {

        const callApi = (reqBody: TReqBody) => {
            return agent.post(addEmailsPath).type('form').send(reqBody);
        };
        const emailData = {
            email: Email.new(['to1@email.com'], ["cc1@email.com"], ["ccn1@email.com"], "Subject 1", "Body 1", { Cron: "* * * * * *", Status: CronStatus.Enabled }),
        };

        it(`should return a status code of "${CREATED}" if the request was successful.`, (done) => {
            // Setup Spy
            spyOn(emailRepo, 'add').and.returnValue(Promise.resolve());
            // Call API
            agent.post(addEmailsPath).type('form').send(emailData)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(CREATED);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object with an error message of "${ParamMissingError.Msg}" and a status
            code of "${BAD_REQUEST}" if the email param was missing.`, (done) => {
            // Call API
            callApi({})
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(ParamMissingError.Msg);
                    done();
                });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            // Setup spy
            const errMsg = 'Could not add email.';
            spyOn(emailRepo, 'add').and.throwError(errMsg);
            // Call API
            callApi(emailData)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(errMsg);
                    done();
                });
        });
    });


    /***********************************************************************************
     *                                    Test Put
     **********************************************************************************/

    describe(`"PUT:${updateEmailPath}"`, () => {

        const callApi = (reqBody: TReqBody) => {
            return agent.put(updateEmailPath).type('form').send(reqBody);
        };
        const emailData = {
            email: Email.new(['to1@email.com'], ["cc1@email.com"], ["ccn1@email.com"], "Subject 1", "Body 1", { Cron: "* * * * * *", Status: CronStatus.Processing }),
        };

        it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
            // Setup spy
            spyOn(emailRepo, 'persists').and.returnValue(Promise.resolve(true));
            spyOn(emailRepo, 'update').and.returnValue(Promise.resolve());
            // Call Api
            callApi(emailData)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object with an error message of "${ParamMissingError.Msg}" and a
            status code of "${BAD_REQUEST}" if the email param was missing.`, (done) => {
            // Call api
            callApi({})
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(ParamMissingError.Msg);
                    done();
                });
        });

        it(`should return a JSON object with the error message of ${EmailNotFoundError.Msg} 
            and a status code of "${StatusCodes.NOT_FOUND}" if the id was not found.`, (done) => {
            // Call api
            callApi(emailData)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(EmailNotFoundError.HttpStatus);
                    expect(res.body.error).toBe(EmailNotFoundError.Msg);
                    done();
                });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            spyOn(emailRepo, 'persists').and.returnValue(Promise.resolve(true));
            // Setup spy
            const updateErrMsg = 'Could not update email.';
            spyOn(emailRepo, 'update').and.throwError(updateErrMsg);
            // Call API
            callApi(emailData)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(updateErrMsg);
                    done();
                });
        });
    });


    /***********************************************************************************
     *                                    Test Delete
     **********************************************************************************/

    describe(`"DELETE:${deleteEmailPath}"`, () => {

        const callApi = (id: number) => {
            return agent.delete(deleteEmailPath.replace(':id', id.toString()));
        };

        it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
            // Setup spy
            spyOn(emailRepo, 'persists').and.returnValue(Promise.resolve(true));
            spyOn(emailRepo, 'delete').and.returnValue(Promise.resolve());
            // Call api
            callApi(5)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object with the error message of ${EmailNotFoundError.Msg} 
            and a status code of "${StatusCodes.NOT_FOUND}" if the id was not found.`, (done) => {
            // Call api
            callApi(-1)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(StatusCodes.NOT_FOUND);
                    expect(res.body.error).toBe(EmailNotFoundError.Msg);
                    done();
                });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            spyOn(emailRepo, 'persists').and.returnValue(Promise.resolve(true));
            // Setup spy
            const deleteErrMsg = 'Could not delete email.';
            spyOn(emailRepo, 'delete').and.throwError(deleteErrMsg);
            // Call Api
            callApi(1)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(deleteErrMsg);
                    done();
                });
        });
    });
});
