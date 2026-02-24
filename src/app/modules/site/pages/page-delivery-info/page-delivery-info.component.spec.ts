import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDeliveryInfoComponent } from './page-delivery-info.component';

describe('PageDeliveryInfoComponent', () => {
  let component: PageDeliveryInfoComponent;
  let fixture: ComponentFixture<PageDeliveryInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageDeliveryInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageDeliveryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
