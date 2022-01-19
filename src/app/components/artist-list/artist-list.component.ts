import { Component, HostBinding, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Artist } from 'src/app/models/artist';
import { User } from 'src/app/models/user';
import { ArtistService } from 'src/app/services/artist.service';
import { TokenService } from 'src/app/services/token.service';
import { GLOBAL } from 'src/app/services/global';
import { Location } from '@angular/common';


@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.css'],
  providers: [ArtistService, TokenService]
})
export class ArtistListComponent implements OnInit {
  @HostBinding('class') defaultClasses = 'd-flex h-100 w-100';

  currentPage = 1;
  nextPage = 1;
  prevPage = 1;
  itemsPerPage = 4;
  isDeleting : Array<boolean> = [];
  artistToList: Array<Artist> = [];
  currentUser : User = new User();
  errorText = '';


  constructor(private _router: Router, 
    private _activatedRoute: ActivatedRoute, 
    private _location: Location, 
    private _tokenService: TokenService, 
    private _artistService: ArtistService) { }

  ngOnInit() : void {
    this.loadPage(this.currentPage);
    this.currentUser = this._tokenService.getUser();
  }

  async loadPage(page: number){
    this.errorText = '';

    this.currentPage = page;
    this.nextPage = this.currentPage + 1;
    this.prevPage = this.currentPage - 1;

    this.artistToList = [];
    this.isDeleting = [];
    
    if(this.prevPage == 0) this.prevPage = 1;
    

    try{
      let artists : any = await this._artistService.listArtists(this.currentPage, this.itemsPerPage);
      let totalPages = Math.ceil(+(artists.total_items / artists.items_per_page));
      this.itemsPerPage = +artists.items_per_page;
      if(totalPages == 0) this.nextPage = 1;
      if(this.currentPage == totalPages){
        this.nextPage = totalPages;
      }
      if(artists.artists){
        this.artistToList = [];
        this.isDeleting = [];
        artists.artists.map(
          (artist: any) => {
            this.artistToList.push(new Artist(artist._id, artist.name, artist.description, artist.image));
            this.isDeleting.push(false);
          }
        );
      }
    } catch(error: any){
      this.errorText = error.error.message ? error.error.message : 'Ocurrio un error, vuelva a intentarlo';
    }
  }


  getImageURL(image: string){
    return GLOBAL.API_URL + 'get-image-artist/' + image;
  }

  async deleteArtist(artistId: string) {
    try {
      let deletedArtist = await this._artistService.deleteArtist(artistId);
      if(deletedArtist){
        if(this.artistToList.length == 1){
          this.loadPage(this.prevPage);
        } else {
          this.loadPage(this.currentPage);
        }
      } else {
        this.errorText = 'No se elimino el artista.';
      }
    } catch(error: any){
      this.errorText = error.error.message ? error.error.message : 'Ocurrio un error, vuelva a intentarlo';
    }
  }

  delete(i: number){
    this.isDeleting[i] = true;
  }

  cancelDelete(i: number){
    this.isDeleting[i] = false;
  }

  isAdmin(){
    return this.currentUser.role == 'ROLE_ADMIN';
  }

  back(){
    this._location.back();
  }

}
