import { TestBed } from '@angular/core/testing';

import { StatusTableHelperService } from './status-table-helper.service';

describe('StatusTableHelperService', () => {
  let service: StatusTableHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatusTableHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
