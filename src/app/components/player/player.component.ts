import { Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { interval } from 'rxjs';
import { Album } from 'src/app/models/album';
import { Artist } from 'src/app/models/artist';
import { Song } from 'src/app/models/song';
import { GLOBAL } from 'src/app/services/global';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  @HostBinding('class') defaultClasses = 'd-flex h-100 w-100';
  playing = false;
  currentProgress = 0;
  progressPerc = 0;

  currentSong : Song | null = null;
  currentAlbum : Album | null = null;
  currentArtist : Artist | null = null;

  player: HTMLAudioElement | null = null;

  playerUpdater = interval(1000);

  @ViewChild('stream') set playerRef(ref: ElementRef<HTMLAudioElement>) {
    this.player = ref.nativeElement;
  }

  constructor(private _playerService: PlayerService) { }

  ngOnInit(): void {
    this.load();
  }

  load(){
    this.currentSong = <Song | null>this._playerService.getSong();
    if(this.currentSong) {
      this.playing = true;
      this.playerUpdater.subscribe({
        next: () => {
          this.currentProgress = this.player?.currentTime || 0;
          this.progressPerc = ((this.player?.currentTime || 0)*100)/(this.player?.duration || 0);
        }
      })
    } 
    this.currentAlbum = <Album | null>this._playerService.getAlbum();
    this.currentArtist = <Artist | null>this._playerService.getArtist();

    this._playerService.songObeservable().subscribe({
      next: (nextSong: Song) => {
        this.currentSong = <Song | null>nextSong;
        this.playing = true;
        this.playerUpdater.subscribe({
          next: () => {
            this.currentProgress = this.player?.currentTime || 0;
            this.progressPerc = ((this.player?.currentTime || 0)*100)/(this.player?.duration || 0);
          }
        })
      }
    });

    this._playerService.albumObeservable().subscribe({
      next: (nextAlbum: Album) => {
        this.currentAlbum = <Album | null>nextAlbum;
      }
    });

    this._playerService.artistObeservable().subscribe({
      next: (nextArtist: Artist) => {
        this.currentArtist = <Artist | null>nextArtist;
      }
    });

  }

  getAudioURL() : string {
    return GLOBAL.API_URL + 'get-file-song/' + this.currentSong?.file;
  }

  getAlbumImageURL() :string {
    return GLOBAL.API_URL + 'get-image-album/' + this.currentAlbum?.image;
  }

  getDurationString(duration: number){
    let minutes = Math.floor(duration/60);
    let seconds = Math.ceil((duration - (Math.floor(duration/60)*60)));
    
    return (minutes < 10 ? '0'+ minutes : minutes) + ':' +  (seconds < 10 ? '0'+ seconds : seconds);
  }

  play() {
    if(this.currentSong){
      this.playing = true;
      this.player?.play();
    }
  }

  pause(){
    this.playing = false;
    this.player?.pause();
  }

}
