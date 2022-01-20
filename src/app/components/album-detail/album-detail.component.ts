import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Location } from '@angular/common';
import { AlbumService } from 'src/app/services/album.service';
import { Album } from 'src/app/models/album';
import { GLOBAL } from 'src/app/services/global';
import { TokenService } from 'src/app/services/token.service';
import { User } from 'src/app/models/user';
import { Song } from 'src/app/models/song';
import { SongService } from 'src/app/services/song.service';
import { Artist } from 'src/app/models/artist';
import { PlayerService } from 'src/app/services/player.service';


@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.css']
})
export class AlbumDetailComponent implements OnInit {
  @HostBinding('class') defaultClasses = 'd-flex h-100 w-100';
  album: Album = new Album();
  artist = new Artist();

  errorText = '';
  currentUser : User = new User();
  isDeleting = false;

  prevPage = 1;
  currentPage = 1;
  nextPage = 1;

  itemsPerPage = 5;

  songsToList : Array<Song> = [];
  isDeletingSong : Array<boolean> = [];

  constructor(private _activatedRoute: ActivatedRoute, 
    private _location: Location, 
    private _tokenService: TokenService,  
    private _songService: SongService, 
    private _albumService: AlbumService,
    private _playerService: PlayerService) { }

  ngOnInit(): void {
    this.loadAlbum();
    this.currentUser = this._tokenService.getUser();
  }

  async loadAlbum(){
    let params : any = await firstValueFrom(this._activatedRoute.params);
    if(params.id) {
      try {
        let getAlbum : any = await this._albumService.getAlbum(params.id);
        if(getAlbum.album){
          let album = getAlbum.album;
          this.album = new Album(album._id, album.title, album.description, album.year, album.image, album.artist._id);
          this.artist = new Artist(album.artist._id, album.artist.name, album.artist.description, album.artist.image);
          this.loadSongs(this.currentPage);
        } else {
          this.errorText = 'No se obtuvo un album';
        }
      } catch(error: any){
        this.errorText = error.error.message ? error.error.message : 'Ocurrio un error, vuelva a intentarlo';
      }
    }
  }

  delete(){
    this.isDeleting = true;
  }

  cancelDelete(){
    this.errorText = '';
    this.isDeleting = false;
  }
  
  async deleteAlbum(){
    try {
      let deletedAlbum = await this._albumService.deleteAlbum(this.album._id);
      if(deletedAlbum){
        this._location.back();
      } else {
        this.errorText = 'No se elimino el album.';
      }
    } catch(error: any){
      this.errorText = error.error.message ? error.error.message : 'Ocurrio un error, vuelva a intentarlo';
    }
  }

  getAlbumImageURL(){
    return GLOBAL.API_URL + 'get-image-album/' + this.album.image;
  }

  isAdmin(){
    return this.currentUser.role == 'ROLE_ADMIN';
  }

  back(){
    this._location.back();
  }

  getDurationString(duration: number){
    let minutes = Math.floor(duration/60);
    let seconds = (duration - (Math.floor(duration/60)*60));
    
    return (minutes < 10 ? '0'+ minutes : minutes) + ':' +  (seconds < 10 ? '0'+ seconds : seconds);
  }

  deleteSong(i: number){
    this.isDeletingSong[i] = true;
  }

  async loadSongs(page: number){
    this.currentPage = page;
    this.nextPage = page + 1;
    this.prevPage = page - 1;
    this.songsToList = [];
    this.isDeletingSong = [];
    if(this.prevPage == 0) this.prevPage = 1;
    try {
      let songs : any = await this._songService.listSongs(page, this.itemsPerPage, this.album._id);
      if(songs.songs){
        let totalPages = Math.ceil((songs.total_items / this.itemsPerPage));
        if(this.currentPage == totalPages) this.nextPage = this.currentPage;
        songs.songs.map((song: any) => {
          this.songsToList.push(new Song(song._id, song.number, song.name, song.duration, song.file, this.album._id));
          this.isDeletingSong.push(false);
        });
      } else {
        this.errorText = songs.message ? songs.message : 'Ocurrio un error, vuelva a intentarlo';
      }
    } catch(error: any){
      this.errorText = error.error.message ? error.error.message : 'Ocurrio un error, vuelva a intentarlo';
    }
  }

  async confirmDeleteSong(songId: string){
    try {
      let deletedSong = await this._songService.deleteSong(songId);
      if(deletedSong){
        if(this.songsToList.length == 1){
          this.loadSongs(this.prevPage);
        } else {
          this.loadSongs(this.currentPage);
        }
      } else {
        this.errorText = 'No se elimino el album.';
      }
    } catch(error: any){
      this.errorText = error.error.message ? error.error.message : 'Ocurrio un error, vuelva a intentarlo';
    }
  }

  cancelDeleteSong(i: number){
    this.isDeletingSong[i] = false;
  }

  playSong(song: Song){
    this._playerService.setSong(song);
    this._playerService.setAlbum(this.album);
    this._playerService.setArtist(this.artist);
  }
}
