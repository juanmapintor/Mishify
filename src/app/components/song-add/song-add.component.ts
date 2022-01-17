import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Album } from 'src/app/models/album';
import { Artist } from 'src/app/models/artist';
import { Song } from 'src/app/models/song';
import { AlbumService } from 'src/app/services/album.service';
import { GLOBAL } from 'src/app/services/global';
import { SongService } from 'src/app/services/song.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-song-add',
  templateUrl: './song-add.component.html',
  styleUrls: ['./song-add.component.css'],
  providers: [AlbumService, SongService]
})
export class SongAddComponent implements OnInit {
  @HostBinding('class') defaultClasses = 'd-flex h-100 w-100';

  album : Album = new Album();
  artist : Artist = new Artist();
  newSong: Song = new Song(); 

  errorText = '';
  constructor(private _activatedRoute: ActivatedRoute, private _location: Location, private _albumService: AlbumService, private _songservice: SongService) { }

  ngOnInit(): void {
    this.loadAlbum();
  }

  async loadAlbum(){
    let params : any = await firstValueFrom(this._activatedRoute.params);
    if(params.albumId){
      try {
        let getAlbum : any = await this._albumService.getAlbum(params.albumId);
        if(getAlbum){
          let album = getAlbum.album;
          this.album = new Album(album._id, album.title, album.description, album.year, album.image, album.artist._id);
          this.newSong.album = album._id;
          this.artist = new Artist(album.artist._id, album.artist.name, album.artist.description, album.artist.image);

          console.log('Artist: ', this.artist);
          console.log('Album: ', this.album);
          console.log('New Song:', this.newSong);
        } else {
          this.errorText = 'No se obtuvo el album para agregar la cancion';
        }
      } catch (error: any) {
        this.errorText = error.error.message || 'Ocurrio un error'; 
      }
    }
  }

  getAlbumImageURL(){
    return GLOBAL.API_URL + 'get-image-album/' + this.album.image;
  }

  getArtistImageURL(){
    return GLOBAL.API_URL + 'get-image-artist/' + this.artist.image;
  }

}
