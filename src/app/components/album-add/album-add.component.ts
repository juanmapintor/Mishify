import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Album } from 'src/app/models/album';
import { Artist } from 'src/app/models/artist';
import { AlbumService } from 'src/app/services/album.service';
import { ArtistService } from 'src/app/services/artist.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { GLOBAL } from 'src/app/services/global';
import { Location } from '@angular/common';

@Component({
  selector: 'app-album-add',
  templateUrl: './album-add.component.html',
  styleUrls: ['./album-add.component.css'],
  host: {
    class: "d-flex h-100 w-100"
  }
})
export class AlbumAddComponent implements OnInit {
  artist: Artist = new Artist();
  errorText = '';
  newAlbum : Album = new Album();
  maxYear: number = (new Date()).getFullYear() + 5;

  public imageSrc = '';
  public fileToUpload : any = null;
  public fakeFilePath = '';

  constructor(private _activatedRoute: ActivatedRoute, private _location: Location, private _artistService: ArtistService, private _albumService: AlbumService, private _fileUploadService: FileUploadService) { }

  ngOnInit(): void {
    this.loadArtist();
  }

  async loadArtist(){
    let params : any = await firstValueFrom(this._activatedRoute.params);
    if(params.artistId) {
      try {
        let getArtist : any = await this._artistService.getArtist(params.artistId);
        if(getArtist){
          this.artist = new Artist(getArtist.artist._id, getArtist.artist.name, getArtist.artist.description, getArtist.artist.image);
          this.newAlbum.artist = this.artist._id;
        } else {
          this.errorText = 'No se obtuvo un artista';
        }
      } catch(error: any){
        this.errorText = error.error.message ? error.error.message : 'Ocurrio un error, vuelva a intentarlo';
      }
    }
  }

  async onSubmit(){
    try {
      let uplodadedAlbum : any = await this._albumService.saveAlbum(this.newAlbum);
      if(uplodadedAlbum){
        let uploadedImage = await this._fileUploadService.uploadFile(`upload-image-album/${uplodadedAlbum.album._id}`, this.fileToUpload);
        if(uploadedImage){
          this._location.back();
        } else {
          this.errorText = 'No se ha subido la imagen';
        }
      } else {
        this.errorText = 'No se ha subido el album';
      }
    } catch (error: any){
      this.errorText = error.error.message ? error.error.message : 'Ocurrio un error, vuelva a intentarlo';
    }
  }
  getImageURL(){
    return GLOBAL.API_URL + 'get-image-artist/' + this.artist.image;
  }

  onFileChanged(event: any){
    let fileReader = new FileReader();

    fileReader.onload = (result) => {
      this.imageSrc = result.target?.result?.toString() || this.imageSrc; 
    }

    if(event.target.files.length > 0){
      this.fileToUpload = event.target.files[0];
      fileReader.readAsDataURL(this.fileToUpload);
    }
  }

  cancelImage(){
    this.imageSrc = '';
    this.fakeFilePath = '';
    this.fileToUpload = null;
  }
  back(){
    this._location.back();
  }
}
