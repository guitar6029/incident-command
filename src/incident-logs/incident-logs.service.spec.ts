import { Test, TestingModule } from '@nestjs/testing';
import { IncidentLogsService } from './incident-logs.service';

describe('IncidentLogsService', () => {
  let service: IncidentLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncidentLogsService],
    }).compile();

    service = module.get<IncidentLogsService>(IncidentLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
