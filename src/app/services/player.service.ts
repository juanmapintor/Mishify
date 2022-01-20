import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';
import { Album } from '../models/album';
import { Artist } from '../models/artist';
import { Song } from '../models/song';

const SONG_KEY = 'current-song'
const ALBUM_KEY = 'current-album'
const ARTIST_KEY = 'current-artist';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private song = new Subject<Song>();
  private song$ = this.song.asObservable();
  private album = new Subject<Album>();
  private album$ = this.album.asObservable();
  private artist = new Subject<Artist>();
  private artist$ = this.artist.asObservable();

  constructor() {}

  setSong(song: Song){
    window.sessionStorage.removeItem(SONG_KEY);
    window.sessionStorage.setItem(SONG_KEY, JSON.stringify(song));
    this.song.next(song);
  }

  getSong() : Song | null {
    let song = window.sessionStorage.getItem(SONG_KEY);
    if(song) return <Song>JSON.parse(song);
    return null;
  }

  songObeservable() : Observable <Song> {
    return this.song$;
  }

  setAlbum(album: Album){
    window.sessionStorage.removeItem(ALBUM_KEY);
    window.sessionStorage.setItem(ALBUM_KEY, JSON.stringify(album));
    this.album.next(album);
  }
  getAlbum() : Album | null {
    let album = window.sessionStorage.getItem(ALBUM_KEY);
    if(album) return <Album>JSON.parse(album);
    return null;
  }

  albumObeservable() : Observable <Album> {
    return this.album$;
  }

  setArtist(artist: Artist){
    window.sessionStorage.removeItem(ARTIST_KEY);
    window.sessionStorage.setItem(ARTIST_KEY, JSON.stringify(artist));
    this.artist.next(artist);
  }
  getArtist() : Artist | null {
    let artist = window.sessionStorage.getItem(ARTIST_KEY);
    if(artist) return <Artist>JSON.parse(artist);
    return null;
  }

  artistObeservable() : Observable <Artist> {
    return this.artist$;
  }

}
