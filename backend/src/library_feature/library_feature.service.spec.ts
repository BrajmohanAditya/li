import { Test, TestingModule } from '@nestjs/testing';
import { LibraryFeatureService } from './library_feature.service';

describe('LibraryFeatureService', () => {
  let service: LibraryFeatureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LibraryFeatureService],
    }).compile();

    service = module.get<LibraryFeatureService>(LibraryFeatureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
