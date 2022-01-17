import { Injectable } from '@angular/core';
import { GLOBAL } from "./global";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { Artist } from '../models/artist';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {


  constructor(private _http: HttpClient) { }

  public listArtists(page: number){
    return firstValueFrom(
      this._http.get(GLOBAL.API_URL + 'artists/' + page)
    );
  }

  public getArtist(artistId: string) {
    return firstValueFrom(
      this._http.get(GLOBAL.API_URL + 'artist/' + artistId)
    );
  }

  public saveArtist(artist: Artist) {
    return firstValueFrom(
      this._http.post(GLOBAL.API_URL + 'artist', JSON.stringify(artist), GLOBAL.JSON_HEADERS)
    );
  }

  public updateArtist(artist: Artist){
    return firstValueFrom(
      this._http.put(GLOBAL.API_URL + 'artist/' + artist._id, JSON.stringify(artist), GLOBAL.JSON_HEADERS)
    );
  }

  public deleteArtist(artistId: string){
    return firstValueFrom(
      this._http.delete(GLOBAL.API_URL + 'artist/' + artistId)
    );
  }
}
