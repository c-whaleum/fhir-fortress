
import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { ParcelModule } from './parcel/parcel.module';
import { StorageService } from './storage.service';

@Module({
    imports: [
        ParcelModule,
    ],
    controllers: [StorageController],
    providers: [StorageService],
})
export class StorageModule {};