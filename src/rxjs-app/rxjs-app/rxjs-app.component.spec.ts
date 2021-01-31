import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RxjsAppComponent } from './rxjs-app.component';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';

describe('RxjsAppComponent', () => {
  let fixture: ComponentFixture<RxjsAppComponent>;
  let app: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [ RxjsAppComponent ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(RxjsAppComponent);
    app = fixture.componentInstance;
  });

  it('should create', () => {
    expect(app).toBeTruthy();
  });

  it('hidden group works', () => {
    const hiddenIndex = 0;
    fixture.detectChanges();
    let titles = fixture.debugElement.queryAll(By.css('.title'));
    expect(titles.length).toBe(app.groups.map(x => x.array.length)
      .reduce((acc, item) => acc + item));

    const hiddenButtons = fixture.debugElement.queryAll(By.css('.hidden-list-icon'));
    hiddenButtons[hiddenIndex].nativeElement.click();
    fixture.detectChanges();
    titles = fixture.debugElement.queryAll(By.css('.title'));
    expect(titles.length).toBe(app.groups.map((x, index) =>
      index != hiddenIndex ? x.array.length : 0)
      .reduce((acc, item) => acc + item));
  });

  it('select marker', () => {
    fixture.detectChanges();
    const titles = fixture.debugElement.queryAll(By.css('.title'));
    titles[0].nativeElement.click();
    fixture.detectChanges();
    expect(titles[0].classes.active).toBe(true);
  });

  it('delete marker', () => {
    fixture.detectChanges();
    const oldTitles = fixture.debugElement.queryAll(By.css('.title'));
    const deleteIcons = fixture.debugElement.queryAll(By.css('.delete-icon-button'));
    deleteIcons[0].nativeElement.click();
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css(`.dialog-type-1-height`));
    const deleteButton = dialog.query(By.css('.submit-button'));
    deleteButton.nativeElement.click();
    fixture.detectChanges();
    const newTitles = fixture.debugElement.queryAll(By.css('.title'));
    expect(oldTitles.length - 1).toBe(newTitles.length);
  });

  it('add marker', () => {
    fixture.detectChanges();
    const oldTitles = fixture.debugElement.queryAll(By.css('.title'));
    const map = fixture.debugElement.query(By.css('#map'));
    map.nativeElement.click();
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css(`.dialog-type-0-height`));
    const nameInput = dialog.query(By.css('#name')).nativeElement;
    nameInput.value = 'test point';
    nameInput.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    app.selectGroup = app.groups[1];
    const groupSelect = dialog.query(By.css('#groups')).nativeElement;
    groupSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    const addButton = dialog.query(By.css('.submit-button'));
    addButton.nativeElement.click();
    fixture.detectChanges();
    const newTitles = fixture.debugElement.queryAll(By.css('.title'));
    expect(oldTitles.length + 1).toBe(newTitles.length);
  });
});
