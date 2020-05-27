import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableComponent} from './table/table.component';
import {FiltersComponent} from './filters/filters.component';
import {DropdownComponent} from './dropdown/dropdown.component';
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [TableComponent, FiltersComponent, DropdownComponent],
  exports: [TableComponent, FiltersComponent],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class LegoModule {
}
