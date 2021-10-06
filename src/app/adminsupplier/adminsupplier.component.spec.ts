import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminsupplierComponent } from './adminsupplier.component';

describe('AdminsupplierComponent', () => {
  let component: AdminsupplierComponent;
  let fixture: ComponentFixture<AdminsupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminsupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminsupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
