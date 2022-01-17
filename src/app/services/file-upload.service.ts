import { Injectable } from '@angular/core';
import { GLOBAL } from "./global";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private _http: HttpClient) { }

  public uploadFile(url: string, file: File){
    let formData = new FormData();
    formData.append('file', file, file.name);

    return firstValueFrom(this._http.post(GLOBAL.API_URL + url, formData));
  }
}
