import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AppRoutingModule } from '../app-routing.module';
import {Router} from "@angular/router"
import { DataSharingService } from '../app.module';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';

class UserData{
  token : string | undefined;
  id : number | undefined;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})



@Injectable()
export class LoginComponent implements OnInit {
 
  loaded=true;
  form = {email:"" , password:""};

  userDataObser : Observable<UserData> | undefined;


  constructor(private _snackBar: MatSnackBar , private router: Router, private dataSharingService: DataSharingService,private httpClient: HttpClient) {};
  
  openSnackBar = (message: string, action: string) => {
    this._snackBar.open(message, action, {
      duration: 2000,
    })
  }

  iniciarSesion = () => {
    this.loaded=false;
    let body = new FormData();
    body.append('email', this.form.email);
    body.append('password', this.form.password);
    this.userDataObser = this.httpClient.post<UserData>("https://tranquil-plateau-64861.herokuapp.com/login",body);
    this.userDataObser.pipe( take(1) ).subscribe( valor => {
      if(valor!==undefined &&valor.token !== undefined  && valor.token.length > 5 ){
        this.dataSharingService.isUserLoggedIn.next(true);
        localStorage.setItem("token",valor.token);
        localStorage.setItem("id_user",""+valor.id);
        this.router.navigate(["/agregar/false"]);
      }
      else{
        this.openSnackBar("Mail o contraseña incorrecta","Ok");
      }
      this.loaded=true;
    })
  }


  ngOnInit(): void {
    

  }

}



