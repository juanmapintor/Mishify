import { Injectable } from '@angular/core';
import { GLOBAL } from "./global";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient) {
  }

  login(user: User, gethash: boolean = false) {
    let loginUser: any = {
      email: user.email,
      password: user.password
    };


    if(gethash) loginUser.gethash = gethash;

    let params = JSON.stringify(loginUser);

    return firstValueFrom(this._http.post(GLOBAL.API_URL + 'login', params, GLOBAL.JSON_HEADERS));
  }

  signup(user: User){
    let params = JSON.stringify(user);
    return firstValueFrom(this._http.post(GLOBAL.API_URL + 'register', params, GLOBAL.JSON_HEADERS));
  }

  update(user: User){
    return firstValueFrom(this._http.put(`${GLOBAL.API_URL}update-user/${user._id}`,JSON.stringify(user), GLOBAL.JSON_HEADERS));
  }


}
