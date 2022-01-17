import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Artist } from 'src/app/models/artist';
import { User } from 'src/app/models/user';
import { ArtistService } from 'src/app/services/artist.service';
import { GLOBAL } from 'src/app/services/global';
import { TokenService } from 'src/app/services/token.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.css'],
  host: {
    class:'d-flex h-100 w-100'
  }
})
export class ArtistDetailComponent implements OnInit {
  artist: Artist = new Artist();
  errorText = '';
  currentUser : User = new User();
  isDeleting = false;

  constructor(private _activatedRoute: ActivatedRoute, private _location: Location, private _tokenService: TokenService,  private _artistService: ArtistService) { }

  async ngOnInit() {
    await this.loadArtist();
    this.currentUser = this._tokenService.getUser();
  }

  async loadArtist(){
    let params : any = await firstValueFrom(this._activatedRoute.params);
    if(params.id) {
      try {
        let getArtist : any = await this._artistService.getArtist(params.id);
        if(getArtist){
          this.artist = new Artist(getArtist.artist._id, getArtist.artist.name, getArtist.artist.description, getArtist.artist.image);
        } else {
          this.errorText = 'No se obtuvo un artista';
        }
      } catch(error: any){
        this.errorText = error.error.message ? error.error.message : 'Ocurrio un error, vuelva a intentarlo';
      }
    }
  }

  getImageURL(){
    return GLOBAL.API_URL + 'get-image-artist/' + this.artist.image;
  }

  async deleteArtist() {
    try {
      let deletedArtist = await this._artistService.deleteArtist(this.artist._id);
      if(deletedArtist){
        this._location.back();
      } else {
        this.errorText = 'No se elimino el artista.';
      }
    } catch(error: any){
      this.errorText = error.error.message ? error.error.message : 'Ocurrio un error, vuelva a intentarlo';
    }
  }

  delete(){
    this.isDeleting = true;
  }

  cancelDelete(){
    this.isDeleting = false;
  }

  isAdmin(){
    return this.currentUser.role == 'ROLE_ADMIN';
  }
}
