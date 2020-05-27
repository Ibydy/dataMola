import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {
  @Input() public viewField = 'name';
  @Input() public marginRight;
  @Input() public width = '150px';
  @Input() public color = 'white';
  @Input() public border;
  @Input() public borderRadius = '0';
  @Input() public itemIdForPreselect: string | number | null = null;
  @Input() public useDeafult = false;
  @Input() public preview = '';

  @Input()
  public set selectedItem(item) {
    this._selectedItem = item;
  }

  public get selectedItem() {
    if (_.isEmpty(this._selectedItem) && ! this._selectedItem) {
      return '';
    }
    if (!this.viewField) {
      return this._selectedItem;
    }
    return this._selectedItem[this.viewField];
  }

  @Input()
  public set items(items) {
    this._items = items;
    if (_.isEmpty(this.selectedItem) && this.useDeafult) {
      this.select(
        Boolean(this.itemIdForPreselect) ?
          this._items.find((el) => (el.id === this.itemIdForPreselect)) :
          this._items[0]);
    }
  }

  public get items() {
    return this._items;
  }


  @Output() public selectItem = new EventEmitter();

  public dropdownVisible = false;

  private _items = [];
  private _selectedItem;

  constructor(private el: ElementRef) {
  }

  public getItemView(item): string {
    if (!this.viewField) {
      return item;
    }
    return item[this.viewField];
  }

  public ngOnInit(): void {
    document.addEventListener('click', this.onDocumentClick);
  }

  public ngOnDestroy(): void {
    document.removeEventListener('click', this.onDocumentClick);
  }

  public select(item): void {
    this.selectedItem = item;
    this.dropdownVisible = false;
    this.selectItem.emit(this._selectedItem);
  }

  private onDocumentClick = (event) => {
    if (!this.el.nativeElement.contains(event.target)) {
      this.dropdownVisible = false;
    }
  }

}
