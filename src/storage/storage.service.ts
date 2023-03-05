
import { Injectable } from '@nestjs/common';
import { ParcelService } from './parcel/parcel.service';

@Injectable()
export class StorageService {
    constructor(private parcelService: ParcelService ) {

    }
    
    getDatabases() {
        return []
    }
}