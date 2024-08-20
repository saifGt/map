import { TestBed } from '@angular/core/testing';

import { MapBDService } from './map-bd.service';

describe('MapBDService', () => {
  let service: MapBDService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapBDService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
