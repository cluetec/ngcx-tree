/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgcxTreeComponent } from './ngcx-tree.component';

describe('NgcxTreeComponent', () => {
  let component: NgcxTreeComponent;
  let fixture: ComponentFixture<NgcxTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgcxTreeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgcxTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
