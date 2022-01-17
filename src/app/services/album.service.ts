import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, UrlSerializer } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Album } from '../models/album';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  constructor(private _http: HttpClient) { }

  public listAlbums(page: number, itemsPerPage?: number, artistId?: string){
    let url = `${GLOBAL.API_URL}albums?page=${page}&items_per_page=${itemsPerPage || 3}`;
    if(artistId) url = `${url}&artist=${artistId}`;

    return firstValueFrom(
      this._http.get(url)
    );
  }

  public getAlbum(albumId: string) {
    return firstValueFrom(
      this._http.get(GLOBAL.API_URL + 'album/' + albumId)
    );
  }

  public saveAlbum(album: Album) {
    return firstValueFrom(
      this._http.post(GLOBAL.API_URL + 'album', JSON.stringify(album), GLOBAL.JSON_HEADERS)
    );
  }


  public updateAlbum(album: Album){
    return firstValueFrom(
      this._http.put(GLOBAL.API_URL + 'album/' + album._id, JSON.stringify(album), GLOBAL.JSON_HEADERS)
    );
  }

  public deleteAlbum(albumId: string){
    return firstValueFrom(
      this._http.delete(GLOBAL.API_URL + 'album/' + albumId)
    );
  }

}
