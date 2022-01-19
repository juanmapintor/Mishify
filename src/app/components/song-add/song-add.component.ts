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
import { FileUploadService } from 'src/app/services/file-upload.service';

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

  public file = '';
  public fileToUpload : any = null;
  public fakeFilePath = '';
  public durationString = '';

  errorText = '';
  constructor(private _activatedRoute: ActivatedRoute, private _location: Location, private _fileUploadService: FileUploadService, private _albumService: AlbumService, private _songService: SongService) { }

  ngOnInit(): void {
    this.loadAlbum();
  }

  async loadAlbum(){
    let params : any = await firstValueFrom(this._activatedRoute.params);
    if(params.albumId){
      let albumId = params.albumId;
      try {
        let getAlbum : any = await this._albumService.getAlbum(albumId);
        if(getAlbum){
          let album = getAlbum.album;
          this.album = new Album(album._id, album.title, album.description, album.year, album.image, album.artist._id);
          this.newSong.album = album._id;
          this.artist = new Artist(album.artist._id, album.artist.name, album.artist.description, album.artist.image);
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

  onFileChanged(event: any){
    if(event.target.files.length > 0){
      this.fileToUpload = event.target.files[0];
      this.file = this.fileToUpload.name;

      //Leemos la duracion directamente desde el archivo
      new Audio(URL.createObjectURL(this.fileToUpload)).onloadedmetadata = (event : any) =>{
        this.newSong.duration = Math.ceil(+event.currentTarget.duration);
        this.durationString = this.getDurationString(this.newSong.duration);
      }
    }
  }

  cancelFile(){
    this.file = '';
    this.fakeFilePath = '';
    this.fileToUpload = null;
  }

  back(){
    this._location.back();
  }

  async onSubmit() {
    try {
      let uploadedSong : any = await this._songService.saveSong(this.newSong);
      if(uploadedSong){
        let uplodadedFile : any = await this._fileUploadService.uploadFile(`upload-file-song/${uploadedSong.song._id}`, this.fileToUpload);
        if(uplodadedFile){
          this.newSong._id = uplodadedFile.song._id;
          this.newSong.number = uplodadedFile.song.number;
        } else {
          this.errorText = 'No se pudo subir el archivo de la canción.'
        }
      } else {
        this.errorText = 'No se pudo subir la canción.'
      }

    } catch(error: any) {
      this.errorText = error.error.message || 'Ocurrio un error'; 
    }
  }

  getDurationString(duration: number){
    return Math.floor(duration/60) + ':' + (duration - (Math.floor(duration/60)*60));
  }
}
