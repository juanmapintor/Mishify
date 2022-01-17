import { Component, OnInit } from '@angular/core';
import { Artist } from 'src/app/models/artist';
import { ArtistService } from 'src/app/services/artist.service';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-artist-add',
  templateUrl: './artist-add.component.html',
  styleUrls: ['./artist-add.component.css'],
  host:{
    class: 'h-100 w-100'
  }
})
export class ArtistAddComponent implements OnInit {
  newArtist = new Artist();
  public imageSrc = '';
  public fileToUpload : any = null;
  public fakeFilePath = '';
  public updateError = '';

  constructor(private _artistService: ArtistService, private _fileUploadService: FileUploadService) { }

  ngOnInit(): void {
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
    try {
      let uplodadedArtist : any = await this._artistService.saveArtist(this.newArtist);
      if(uplodadedArtist){
        let uploadedImage = await this._fileUploadService.uploadFile(`upload-image-artist/${uplodadedArtist.artist._id}`, this.fileToUpload);
        if(uploadedImage){
          location.reload();
        } else {
          this.updateError = 'No se ha subido la imagen';
        }
      } else {
        this.updateError = 'No se ha subido el artista';
      }
    } catch (error: any){
      this.updateError = error.error.message ? error.error.message : 'Ocurrio un error, vuelva a intentarlo';
    }
  }

}
