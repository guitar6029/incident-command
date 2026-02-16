import { Test, TestingModule } from '@nestjs/testing';
import { IncidentAcknowledgeService } from './incident-acknowledge.service';

describe('IncidentAcknowledgeService', () => {
  let service: IncidentAcknowledgeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncidentAcknowledgeService],
    }).compile();

    service = module.get<IncidentAcknowledgeService>(IncidentAcknowledgeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
