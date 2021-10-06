import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminclientComponent } from './adminclient.component';

describe('AdminclientComponent', () => {
  let component: AdminclientComponent;
  let fixture: ComponentFixture<AdminclientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminclientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
