import { Test, TestingModule } from '@nestjs/testing';
import { IncidentAcknowledgeController } from './incident-acknowledge.controller';
import { IncidentAcknowledgeService } from './incident-acknowledge.service';

describe('IncidentAcknowledgeController', () => {
  let controller: IncidentAcknowledgeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncidentAcknowledgeController],
      providers: [IncidentAcknowledgeService],
    }).compile();

    controller = module.get<IncidentAcknowledgeController>(IncidentAcknowledgeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
