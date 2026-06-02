import { Test, TestingModule } from '@nestjs/testing';
import { LibraryFeatureController } from './library_feature.controller';
import { LibraryFeatureService } from './library_feature.service';

describe('LibraryFeatureController', () => {
  let controller: LibraryFeatureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibraryFeatureController],
      providers: [LibraryFeatureService],
    }).compile();

    controller = module.get<LibraryFeatureController>(LibraryFeatureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
