import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Album } from 'src/app/models/album';
import { AlbumService } from 'src/app/services/album.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { Location } from '@angular/common';
import { GLOBAL } from 'src/app/services/global';
import { Artist } from 'src/app/models/artist';

@Component({
  selector: 'app-album-edit',
  templateUrl: './album-edit.component.html',
  styleUrls: ['./album-edit.component.css'],
  providers: [AlbumService, FileUploadService]
})
export class AlbumEditComponent implements OnInit {
  @HostBinding('class') defaultClasses = 'd-flex h-100 w-100';

  public updateAlbum = new Album();
  public originalAlbum = new Album();
  public artist = new Artist();
  public imageSrc = '';

  public fileToUpload : any = null;
  public fakeFilePath = '';

  public errorText = '';

  maxYear: number = (new Date()).getFullYear() + 5;

  constructor(private _activatedRoute: ActivatedRoute, private _location: Location, private _albumService: AlbumService, private _fileUploadService: FileUploadService) { }

  ngOnInit(): void {
    this.loadAlbum();
  }
  async loadAlbum(){
    let params : any = await firstValueFrom(this._activatedRoute.params);
    if(params.id) {
      try {
        let getAlbum : any = await this._albumService.getAlbum(params.id);
        if(getAlbum){
          this.updateAlbum = new Album(getAlbum.album._id, getAlbum.album.title, getAlbum.album.description, getAlbum.album.year, getAlbum.album.image, getAlbum.album.artist._id);
          this.originalAlbum = new Album(getAlbum.album._id, getAlbum.album.title, getAlbum.album.description, getAlbum.album.year, getAlbum.album.image, getAlbum.album.artist._id);
          this.artist = new Artist(getAlbum.album.artist._id, getAlbum.album.artist.name, getAlbum.album.artist.description, getAlbum.album.artist.image);
        } else {
          this.errorText = 'No se obtuvo un album';
        }
      } catch(error: any){
        this.errorText = error.error.message ? error.error.message : 'Ocurrio un error, vuelva a intentarlo';
      }
    }
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

  async onSubmit() {
    if(this.dataChanged()){
      try {
        let response = await this._albumService.updateAlbum(this.updateAlbum);
        if(!response){
          this.errorText = 'Ocurrio un error y no se actualizo. Recargue la pagina.'
        }
      } catch (error: any) {
        this.errorText = error.error.message ? error.error.message : 'Ocurrio un error, vuelva a intentarlo';
      }
    } 
    if(this.fileToUpload){
      try {
        let response : any = await this._fileUploadService.uploadFile(`upload-image-album/${this.originalAlbum._id}`, this.fileToUpload);
        if(!response){
          this.errorText = 'Ocurrio un error y no se actualizo. Recargue la pagina.'
        }
      } catch(error: any){
        this.errorText = error.error.message ? error.error.message : 'Ocurrio un error, vuelva a intentarlo';
      }
    }
    if(!this.errorText) this._location.back();
  }

  dataChanged(){
    return (this.originalAlbum.title != this.updateAlbum.title) || 
           (this.originalAlbum.description != this.updateAlbum.description) ||
           (this.originalAlbum.year != this.updateAlbum.year) || 
           (this.fileToUpload != null);
  }

  getAlbumImageURL(){
    return GLOBAL.API_URL + 'get-image-album/' + this.originalAlbum.image;
  }

  back(){
    this._location.back();
  }
}
