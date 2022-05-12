import { Component, OnInit,ChangeDetectorRef, Input } from '@angular/core';
import { DataSharingService } from '../app.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export  class HeaderComponent implements OnInit {
  @Input()
  loggedIn  =false;
 
  
  constructor(private cd: ChangeDetectorRef , private dataSharingService: DataSharingService,private router: Router) {
    this.dataSharingService.isUserLoggedIn.subscribe( value => {
        this.loggedIn = value;
    });
   }

  cerrarSesion = () => {
    localStorage.removeItem("token");
    this.dataSharingService.isUserLoggedIn.next(false);
    this.cd.detectChanges();
  }

  ngOnInit(): void {
    this.loggedIn=!!localStorage.getItem("token");
    this.dataSharingService.isUserLoggedIn.next(this.loggedIn);
    this.cd.detectChanges();
  }

  ruta=this.router;

}


