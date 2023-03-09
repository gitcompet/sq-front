import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { RouterModule } from '@angular/router';
import {  JwtModule } from '@auth0/angular-jwt';
import { TableComponent } from './components/table/table.component';
import { ModalComponent } from './components/modal/modal.component';



@NgModule({
    declarations: [PageNotFoundComponent, NavMenuComponent, TableComponent, ModalComponent],
    exports: [PageNotFoundComponent, NavMenuComponent, TableComponent,ModalComponent],
    imports: [
        CommonModule,
        RouterModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: undefined
            },
        }),
    ]
})
export class SharedModule { }
