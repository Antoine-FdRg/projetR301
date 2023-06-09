import { Component } from '@angular/core';
import { Product } from '../interfaces/product';
import { ProductService } from '../service/product.service';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent {
  user = this.loginService.getUser();
  constructor(private loginService:LoginService){

  }


}
