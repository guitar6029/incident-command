import { Controller, Get } from '@nestjs/common';

@Controller('incidents')
export class IncidentsController {
  @Get()
  getIncidentsHealth(): { ok: string } {
    return { ok: 'incidents module online' };
  }
}
