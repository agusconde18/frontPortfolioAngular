import { Component, OnInit,ChangeDetectorRef, Input } from '@angular/core';
import { DataSharingService } from '../app.module';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from "@angular/router"

class TipoCard{
  id: number;
  descripcion: string;
}

class UserData{
  titulo : string ;
  descripcion: string ;
  imageSource : string ;
  tipoCard : TipoCard;
  id : number 
}





@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})

@Injectable()
export class InicioComponent implements OnInit {
  @Input()
  loaded=false;
  loggedIn  =false;
  public show = true;
  public arr : UserData[]= [];
  public arrTipos : TipoCard [] =[];
  selector : TipoCard;

  reload() {
    this.show = false;
    setTimeout(() => this.show = true);
  }

  constructor( private router: Router,private cd: ChangeDetectorRef ,private _snackBar: MatSnackBar ,private dataSharingService: DataSharingService,private httpClient: HttpClient) {
    this.dataSharingService.isUserLoggedIn.subscribe( value => {
        this.loggedIn = value;
    });
   }

  ngOnInit(): void {
    var observ = this.httpClient.get<UserData[]>("https://tranquil-plateau-64861.herokuapp.com/cards");
    observ.pipe( take(1) ).subscribe( valor => {
      valor.forEach(v => {
        this.arr.push(v);
        if(this.arrTipos.filter(a => a.descripcion===v.tipoCard.descripcion).length<1){
          this.arrTipos.push(v.tipoCard) ;
        }
      });
      this.loaded=true;
      this.reload()
    })
  

  }

  openSnackBar = (message: string, action: string) => {
    this._snackBar.open(message, action, {
      duration: 1000,
    })
  }
  cerrarSesion = () => {
    localStorage.removeItem("token");
    this.dataSharingService.isUserLoggedIn.next(false);
    this.cd.detectChanges();
  }
  eliminar = (id:number) => {

    let body = new FormData();
    body.append('cardId', ""+id);
    body.append('usrId', ""+ localStorage.getItem("id_user"));
    body.append('token', ""+ localStorage.getItem("token"));

    var observ = this.httpClient.delete("https://tranquil-plateau-64861.herokuapp.com/card",{body: body,responseType: 'text'}
    );
    
    observ.pipe( ).subscribe( valor => {
      if( valor=== "OK"){
        this.arr = []
        this.loaded=false;
        this.ngOnInit()
      }
      else{
        this.openSnackBar("Problema al eliminar Card","Ok");
        this.cerrarSesion();
      }
    })

  }

  editar = (data:UserData) => {
    this.router.navigate(["/agregar/true"],{queryParams:{
      tiulo : data.titulo,
       descripcion: data.descripcion,
       imageSource : data.imageSource,
        categName : data.tipoCard.descripcion,
        id : data.id
      }});

  }

  

}
