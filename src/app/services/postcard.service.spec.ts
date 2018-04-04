import { TestBed, inject } from '@angular/core/testing';

import { PostcardService } from './postcard.service';

describe('PostcardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostcardService]
    });
  });

  it('should be created', inject([PostcardService], (service: PostcardService) => {
    expect(service).toBeTruthy();
  }));
});
