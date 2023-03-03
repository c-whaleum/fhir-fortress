import Parcel, { Identity } from "@oasislabs/parcel";
import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";

enum Vars {
    parcelClientId = 'PARCEL_CLIENT_ID',
    parcelClientSecret = 'PARCEL_CLIENT_SECRET'
}

@Injectable()
export class ParcelService {
    private client: Parcel;
    private owner: Identity;

    constructor(private configService: ConfigService) {
        const parcel = new Parcel({
            // e.g. "CPoxXkdvFsrqzDdU7h3QqSs"
            clientId: this.configService.get<string>(Vars.parcelClientId),
            // e.g. JSON.parse("{kty:'EC',alg:'ES256',use:'sig',crv:...}")
            privateKey: JSON.parse(this.configService.get<string>(Vars.parcelClientSecret)),
        });
        this.client = parcel;
        this.initOwner();
        this.initDatabase()
        console.log(this.client);
    }

    private async initOwner() {
        this.owner = await this.client.getCurrentIdentity();
    }

    private async initDatabase() {
        const dbName = 'FortressDB-1';
        let db;
        try {
            db = await this.client.createDatabase({ name: dbName });
            console.log(`Created database ${db.id} with name: ${db.name}`);
         } catch (error) {
            console.log(`DB ${dbName} already exists`);
         }

        const allDatabases = (
            await this.client.listDatabases({
              owner: this.owner.id,
            })
        ).results;
        for (const d of allDatabases) {
            console.log(`Found database ${d.id} with name: ${d.name}`);
        }

        const createPatientsTable = {
            sql: 'CREATE TABLE patients_test_1 (id TEXT, first_name TEXT)',
            params: {},
        };
        try {
            await this.client.queryDatabase(db.id, createPatientsTable);
            console.log(`Created patients_test_1 table`);
        } catch (error) {
            console.log(`error creating patients_test_1`);
        }
    }

    async getAllDatabases() {
        return await this.client.listDatabases({ owner: this.owner.id });
    }
}