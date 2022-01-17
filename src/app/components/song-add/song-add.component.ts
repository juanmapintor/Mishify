import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Album } from 'src/app/models/album';
import { Song } from 'src/app/models/song';
import { AlbumService } from 'src/app/services/album.service';
import { SongService } from 'src/app/services/song.service';

@Component({
  selector: 'app-song-add',
  templateUrl: './song-add.component.html',
  styleUrls: ['./song-add.component.css']
})
export class SongAddComponent implements OnInit {

  album : Album = new Album();
  newSong: Song = new Song(); 

  errorText = '';
  constructor(private _activatedRoute: ActivatedRoute, private _location: Location, private _albumService: AlbumService, private _songservice: SongService) { }

  ngOnInit(): void {
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
        } else {
          this.errorText = 'No se obtuvo el album para agregar la cancion';
        }
      } catch (error: any) {
        this.errorText = error.error.message || 'Ocurrio un error'; 
      }
    }
  }

}
