import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HeaderComponent} from './header/header.component'
import { LoginComponent } from './login/login.component';
import { AgregarComponent } from './agregar/agregar.component';
import { InicioComponent } from './inicio/inicio.component';

const routes: Routes = [ 
  {path: 'login', component: LoginComponent},
  {path: 'agregar/:update', component: AgregarComponent},
  {path: '', component: InicioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 


}


