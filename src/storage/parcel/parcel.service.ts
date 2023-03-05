import Parcel, { 
    Identity, 
    AppId, 
    JobSpec, 
    JobPhase,
    JobStatusReport
} from "@oasislabs/parcel";
import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
const fs = require('fs');

enum Vars {
    parcelClientId = 'PARCEL_CLIENT_ID',
    parcelClientSecret = 'PARCEL_CLIENT_SECRET',
    parcelAppId = 'PARCEL_APP_ID',
    primaryDb = 'fhir-fortress-db'
}

@Injectable()
export class ParcelService {
    private client: Parcel;
    private owner: Identity;
    private appId: AppId;
    private tempDoc: any;
    private primaryDb;

    constructor(private configService: ConfigService) {
        this.appId = this.configService.get<string>(Vars.parcelAppId) as AppId;
        const parcel = new Parcel({
            clientId: this.configService.get<string>(Vars.parcelClientId),
            privateKey: JSON.parse(this.configService.get<string>(Vars.parcelClientSecret)),
        });
        this.client = parcel;
        this.initOwner().then(() => {
            this.initPrimaryOwnerDb();
        });
    }

    private async initOwner() {
        this.owner = await this.client.getCurrentIdentity();
    }


    async initPrimaryOwnerDb() {
        const allDatabases = (
            await this.client.listDatabases({
              owner: this.owner.id,
            })
        ).results;
        for (const db of allDatabases) {
            if (db.name === Vars.primaryDb) {
                this.primaryDb = db;
            }
        }
    }

    async uploadDummyData() {
        const providerId = "123";
        const providerName = "Test Provider";
        let insert = {
            sql: `INSERT INTO providers VALUES ($providerId, $providerName)`,
            params: {
                $providerId: providerId,
                $providerName: providerName
            },
        };
        await this.client.queryDatabase(this.primaryDb.id, insert);
        console.log('ran successfully');
        console.log(insert);
    }

    async submitJob() {
        const jobSpec: JobSpec = {
            name: 'skin-prediction',
            image: 'oasislabs/acme-derma-demo',
            inputDocuments: [{ mountPath: 'doc.txt', id: this.tempDoc.id }],
            outputDocuments: [{ mountPath: 'prediction.txt', owner: this.appId }],
            cmd: ['python', 'predict.py', '/parcel/doc.text', '/parcel/prediction.txt'],
            memory: '2G',
        };
        // Submit the job.
        console.log('Running the job.');
        const jobId = (await this.client.submitJob(jobSpec)).id;

        // Wait for job to finish.
        let jobReport: JobStatusReport;
        do {
            await new Promise((resolve) => setTimeout(resolve, 5000)); // eslint-disable-line no-promise-executor-return
            jobReport = await this.client.getJobStatus(jobId);
            console.log(`Job status is ${JSON.stringify(jobReport.status)}`);
        } while (
            jobReport.status.phase === JobPhase.PENDING ||
            jobReport.status.phase === JobPhase.RUNNING
        );

        const job = await this.client.getJob(jobId);

        console.log(
            `Job ${jobId} completed with status ${job.status?.phase} and ${job.io.outputDocuments.length} output document(s).`,
        );
    }
}