import { Component, HostBinding, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService, TokenService, FileUploadService]
})
export class UserEditComponent implements OnInit {
  @HostBinding('class') defaultClasses = 'd-flex h-100 w-100';

  public userModified: User = new User();
  public userOriginal: User = new User();
  public imageSrc = '';
  public fileToUpload : any = null;
  public dataChanged = false;

  public fakeFilePath = '';

  public updateError = '';


  constructor(private userService: UserService, private fileUploadService: FileUploadService, private tokenService: TokenService) {  }

  ngOnInit(): void {
    this.userModified = this.tokenService.getUser();
    this.userOriginal = this.tokenService.getUser();
  }

  public async onSubmit() {
    if(this.dataChanged){
      try {
        let response = await this.userService.update(this.userModified);
        if(response){
          this.tokenService.saveUser(this.userModified);
          location.reload();
        } else {
          this.updateError = 'Ocurrio un error y no se actualizo. Recargue la pagina.'
        }
      } catch (error: any) {
        this.updateError = error.error.message ? error.error.message : 'Ocurrio un error, vuelva a intentarlo';
      }
    } 
    if(this.fileToUpload){
      try {
        let response : any = await this.fileUploadService.uploadFile(`upload-image-user/${this.userOriginal._id}`, this.fileToUpload);
        if(response){
          this.userModified.image = response.image;
          this.tokenService.saveUser(this.userModified);
          location.reload();
        } else {
          this.updateError = 'Ocurrio un error y no se actualizo. Recargue la pagina.'
        }
      } catch(error: any){
        this.updateError = error.error.message ? error.error.message : 'Ocurrio un error, vuelva a intentarlo';
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

  checkChange(){
    this.dataChanged = (this.userModified.name !=  this.userOriginal.name) || (this.userModified.surname !=  this.userOriginal.surname) || (this.userModified.email !=  this.userOriginal.email);
  }


}
