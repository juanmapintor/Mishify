import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Artist } from 'src/app/models/artist';
import { ArtistService } from 'src/app/services/artist.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-artist-edit',
  templateUrl: './artist-edit.component.html',
  styleUrls: ['./artist-edit.component.css'],
  host: {
    class: 'h-100 w-100'
  }
})
export class ArtistEditComponent implements OnInit {
  public updateArtist = new Artist();
  public originalArtist = new Artist();
  public imageSrc = '';

  public fileToUpload : any = null;
  public fakeFilePath = '';

  public errorText = '';

  constructor(private _activatedRoute: ActivatedRoute, private _location: Location, private _artistService: ArtistService, private _fileUploadService: FileUploadService) { }

  async ngOnInit() {
    this.loadArtist();
  }

  async loadArtist(){
    let params : any = await firstValueFrom(this._activatedRoute.params);
    if(params.id) {
      try {
        let getArtist : any = await this._artistService.getArtist(params.id);
        if(getArtist){
          this.updateArtist = new Artist(getArtist.artist._id, getArtist.artist.name, getArtist.artist.description, getArtist.artist.image);
          this.originalArtist = new Artist(getArtist.artist._id, getArtist.artist.name, getArtist.artist.description, getArtist.artist.image);
        } else {
          this.errorText = 'No se obtuvo un artista';
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
        let response = await this._artistService.updateArtist(this.updateArtist);
        if(!response){
          this.errorText = 'Ocurrio un error y no se actualizo. Recargue la pagina.'
        }
      } catch (error: any) {
        this.errorText = error.error.message ? error.error.message : 'Ocurrio un error, vuelva a intentarlo';
      }
    } 
    if(this.fileToUpload){
      try {
        let response : any = await this._fileUploadService.uploadFile(`upload-image-artist/${this.originalArtist._id}`, this.fileToUpload);
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
    return (this.originalArtist.name != this.updateArtist.name) || (this.originalArtist.description != this.updateArtist.description) || (this.fileToUpload != null);
  }

}
