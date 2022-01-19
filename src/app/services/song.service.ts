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

  public listSongs(page: number, itemsPerPage?: number, albumId?: string){
    let url = `${GLOBAL.API_URL}songs?page=${page}&items_per_page=${itemsPerPage || 3}`;
    if(albumId) url = `${url}&album=${albumId}`;

    return firstValueFrom(
      this._http.get(url)
    );
  }

  public saveSong(song: Song){
    return firstValueFrom(
      this._http.post(GLOBAL.API_URL + 'song', JSON.stringify(song), GLOBAL.JSON_HEADERS)
    );
  }

  public deleteSong(songId: string){
    return firstValueFrom(
      this._http.delete(GLOBAL.API_URL + 'song/' + songId)
    );
  }
}
