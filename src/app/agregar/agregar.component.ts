import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataSharingService } from '../app.module';
import { Router } from "@angular/router"
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BoundAttribute } from '@angular/compiler/src/render3/r3_ast';

class TipoCard {
  id: number;
  descripcion: string;
}

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.css']
})

@Injectable()
export class AgregarComponent implements OnInit {

  constructor(private route: ActivatedRoute,private dataSharingService: DataSharingService, private cd: ChangeDetectorRef, private _snackBar: MatSnackBar, private router: Router, private httpClient: HttpClient) {
    this.dataSharingService.isUserLoggedIn.subscribe(value => {
      this.loggedIn = value;
    });
  };

  dataUpdateP=this.route.snapshot.paramMap.get('update');
 tituloP:string;
 descripcionP:string;
 srcP:string;
 idP:string;

  arrTipos: TipoCard[] = []
  otroSelector: string = "das";
  radioSelector: string;
  viewRadio=false;

  textoBoton=(this.dataUpdateP==="false")?"Agregar Card":"Actualizar Card";


  loaded = false;
  loggedIn = false;
  form = {
    titulo: "",
    descripcion: "",
    src: "",
    id:"",
    categName:"",
  }

/*  if(this.dataUpdate==="true"){
    this.form.titulo=this.tituloP;
    this.form.descripcion=this.descripcionP;
    this.form.src=this.srcP;
  }
*/
 

  cerrarSesion = () => {
    localStorage.removeItem("token");
    this.dataSharingService.isUserLoggedIn.next(false);
    this.cd.detectChanges();
  }

  ngOnInit(): void {
      this.route
      .queryParams
      .subscribe(params => {
        
        this.form.titulo = params['tiulo'] || "";
        this.form.descripcion= params['descripcion'] || "";
        this.form.src= params['imageSource'] || "";
        this.form.id= params['id'] || "";
        this.form.categName= params['categName'] || "";
        this.radioSelector=this.form.categName

      });


    if (!localStorage.getItem("token"))
      this.router.navigate(["/login"]);


    var observ = this.httpClient.get<TipoCard[]>("https://tranquil-plateau-64861.herokuapp.com/tipos");

    observ.pipe(take(1)).subscribe(valor => {
      this.arrTipos = [];
      valor.forEach(v => this.arrTipos.push(v))
      this.loaded=true;
      this.viewRadio=true;

    })
  }

  openSnackBar = (message: string, action: string) => {
    this._snackBar.open(message, action, {
      duration: 2000,
    })
  }

  enviarInfo = () => {



    this.loaded = false;
    const valCat = (this.radioSelector === "nuevaCategoria554") ? this.otroSelector : this.radioSelector;

    let body = new FormData();
    body.append('titulo', this.form.titulo);
    body.append('descripcion', this.form.descripcion);
    body.append('imgSrc', this.form.src);

    body.append('catNueva', valCat);
    body.append('id',this.form.id)
    body.append('usrId', "" + localStorage.getItem("id_user"));
    body.append('token', "" + localStorage.getItem("token"));
    body.append('responseType', "text");

    var observ : Observable<string>;

    if(this.dataUpdateP==="true"){
      observ = this.httpClient.put("https://tranquil-plateau-64861.herokuapp.com/card",
         body, { responseType: 'text' });
    }
    else{
      observ = this.httpClient.post("https://tranquil-plateau-64861.herokuapp.com/card",
        body, { responseType: 'text' });
    }

      observ.pipe(take(1)).subscribe(valor => {
        if (valor === "OK") {
          this.loaded = true;
          this.router.navigate(["/"]);
        }
        else {
          this.loaded = true;
          this.cerrarSesion();
          this.router.navigate(["/login"]);
          this.openSnackBar("Problema en la carga de datos, vuelva a iniciar sesion.", "Ok");
        }
      })
    
  }
}
