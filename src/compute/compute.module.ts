
import { Module } from '@nestjs/common';
import { ComputeController } from './compute.controller';
import { ComputeService } from './compute.service';
import { ParcelModule } from 'src/storage/parcel/parcel.module';

@Module({
    imports: [ParcelModule],
    controllers: [ComputeController],
    providers: [ComputeService],
})
export class ComputeModule {};