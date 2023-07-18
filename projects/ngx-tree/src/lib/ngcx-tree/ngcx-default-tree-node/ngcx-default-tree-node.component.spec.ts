/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NgcxDefaultTreeNodeComponent } from './ngcx-default-tree-node.component';

describe('NgcxDefaultTreeNodeComponent', () => {
  let component: NgcxDefaultTreeNodeComponent;
  let fixture: ComponentFixture<NgcxDefaultTreeNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgcxDefaultTreeNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgcxDefaultTreeNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
