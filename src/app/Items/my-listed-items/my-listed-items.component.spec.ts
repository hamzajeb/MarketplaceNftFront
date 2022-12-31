import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyListedItemsComponent } from './my-listed-items.component';

describe('MyListedItemsComponent', () => {
  let component: MyListedItemsComponent;
  let fixture: ComponentFixture<MyListedItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyListedItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyListedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
