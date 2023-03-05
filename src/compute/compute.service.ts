
import { Injectable } from '@nestjs/common';
import { ParcelService } from 'src/storage/parcel/parcel.service';

@Injectable()
export class ComputeService {
    constructor(private readonly parcelService: ParcelService) {

    }

    async runCompute(sourceCode: string) {
        console.log(sourceCode);
        console.log("running compute");

        await this.parcelService.uploadDummyData();
        //await this.parcelService.submitJob();

        return sourceCode;
    }
}