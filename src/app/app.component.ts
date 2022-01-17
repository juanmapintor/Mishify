import { Component } from '@angular/core';
import { User } from "./models/user";
import { UserService  } from "./services/user.service";
import jwtDecode from "jwt-decode";
import {TokenService} from "./services/token.service";
import { GLOBAL } from './services/global';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  public title = 'Mishify';
  public user_login: User;
  public user_register: User;

  public isLoggedIn = false;
  public loginError = '';

  public registerError = '';
  public registerSuccess = '';

  public imageSrc = '';

  constructor(private _userService: UserService, private _tokenService: TokenService, private _router: Router) {
    this.user_login = new User();
    this.user_register =  new User();
    this.isLoggedIn = _tokenService.getToken() != null;
    if(this.isLoggedIn){
      this.user_login = _tokenService.getUser();
      if(this.user_login.image) this.imageSrc = GLOBAL.API_URL+'get-image-user/'+this.user_login.image;
      _router.navigate(['/home']);
    }
  }

  public async onLogin(){
    this.loginError = '';
    try {
      let response: any = await this._userService.login(this.user_login, true);
      if(!response) {
        this.loginError = 'La respuesta está vacia. Reintentelo.';
      } else {
        this._tokenService.saveToken(response.token);
        let responseUser = (<any>jwtDecode(response.token)).user;
        let user = new User(responseUser._id, responseUser.name, responseUser.surname, responseUser.email, responseUser.password, responseUser.role, responseUser.image)
        this._tokenService.saveUser(user);
        this.user_login = user;
        this.isLoggedIn = true;
        if(this.user_login.image) this.imageSrc = GLOBAL.API_URL+'get-image-user/'+this.user_login.image;
        this._router.navigate(['/home']);
      }
    } catch(error: any){
      this.loginError = error.error.message ? error.error.message : 'Ocurrio un error, vuelva a intentarlo';
    }
  }

  public async onRegister() {
    this.registerError = '';
    try {
      let response : any = await this._userService.signup(this.user_register);
      if(!response){
        this.registerError = 'La respuesta está vacia. Reintentelo.'
      } else {
        this.registerSuccess = 'Registrado correctamente como ' + response.user.email;
      }
    } catch (error: any){
      this.registerError = error.error.message ? error.error.message : 'Ocurrio un error, vuelva a intentarlo';
    }
  }

  logout(){
    this._tokenService.signOut();
    this.isLoggedIn = false;
    this.loginError = '';
    this.registerError = '';
    this.registerSuccess = '';
    this.user_login = new User();
    this.user_register =  new User();
    this.imageSrc = '';
    this._router.navigate(['/']);
  }

  
}
