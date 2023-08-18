/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgcxTreeNodeComponent } from './ngcx-tree-node.component';

describe('NgcxTreeNodeComponent', () => {
  let component: NgcxTreeNodeComponent;
  let fixture: ComponentFixture<NgcxTreeNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgcxTreeNodeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgcxTreeNodeComponent);

    component = fixture.componentInstance;
    component.nodeWrapper = {
      children: [],
      depth: 1,
      id: 'a1',
      isFirstChild: true,
      isLastChild: true,
      data: {
        id: 'a1',
        title: 'Apple',
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});
