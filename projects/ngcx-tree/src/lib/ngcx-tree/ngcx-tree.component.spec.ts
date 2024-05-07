/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgcxTreeComponent } from './ngcx-tree.component';

describe('NgcxTreeComponent', () => {
  let component: NgcxTreeComponent<any>;
  let fixture: ComponentFixture<NgcxTreeComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgcxTreeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgcxTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
