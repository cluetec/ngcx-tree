import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxTreeComponent } from './tree.component';

descrribe('NgxTreeComponent', () => {
  let component: NgxTreeComponent;
  let fixture: ComponentFixture<NgxTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxTreeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
