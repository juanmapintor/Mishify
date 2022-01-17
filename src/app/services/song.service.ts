import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Song } from '../models/song';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  constructor(private _http: HttpClient) { }

  public saveSong(song: Song){
    return firstValueFrom(
      this._http.post(GLOBAL.API_URL + 'song', JSON.stringify(song), GLOBAL.JSON_HEADERS)
    );
  }
}
