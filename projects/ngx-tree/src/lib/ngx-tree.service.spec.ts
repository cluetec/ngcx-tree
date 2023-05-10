import { TestBed } from '@angular/core/testing';

import { NgxTreeService } from './ngx-tree.service';

describe('NgxTreeService', () => {
  let service: NgxTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxTreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
