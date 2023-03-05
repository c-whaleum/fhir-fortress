
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ComputeJobDto } from './compute.dto';
import { ComputeService } from './compute.service';

@Controller('compute')
export class ComputeController {
    constructor(private computeService: ComputeService){}

    @Post('submitJob') 
    async submitJob(@Body() computeJob: ComputeJobDto) {
        return {};
    }

    @Get('getJobResults')
    async getJobResults() {
        this.computeService.runCompute("");
        return {};
    }

    @Get('getJobStatus')
    async getJobStatus(jobId: string) {
        
    }
}