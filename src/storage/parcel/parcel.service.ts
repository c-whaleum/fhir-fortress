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
        console.log(this.client);
    }

    private async initOwner() {
        this.owner = await this.client.getCurrentIdentity();
    }


    async getAllDatabases() {
        return await this.client.listDatabases({ owner: this.owner.id });
    }
}