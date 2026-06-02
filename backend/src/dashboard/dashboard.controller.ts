import { Controller, Get, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getDashboard(@Req() req: any) {
    const adminId = req.admins?.id; // assuming JWT auth
    return this.dashboardService.getDashboardData(adminId);
  }
}