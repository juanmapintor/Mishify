import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';
import { Song } from '../models/song';

const SONG_KEY = 'current-song'

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private obs = new Subject<Song>();
  public obs$ = this.obs.asObservable();

  constructor() {}

  setSong(song: Song){
    window.sessionStorage.setItem(SONG_KEY, JSON.stringify(song));
    this.obs.next(song);
  }

}
