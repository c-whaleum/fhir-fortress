
import { Controller, Get } from '@nestjs/common';
import { ParcelService } from './parcel.service';

@Controller()
export class ParcelController {
    constructor(private parcelService: ParcelService){}

}