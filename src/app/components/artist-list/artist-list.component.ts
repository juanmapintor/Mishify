import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Artist } from 'src/app/models/artist';
import { User } from 'src/app/models/user';
import { ArtistService } from 'src/app/services/artist.service';
import { TokenService } from 'src/app/services/token.service';
import { GLOBAL } from 'src/app/services/global';


@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.css'],
  host:{
    class: 'h-100 w-100'
  }
})
export class ArtistListComponent implements OnInit {
  currentPage = 1;
  nextPage = 1;
  prevPage = 1;
  itemsPerPage = 4;
  isDeleting : Array<boolean> = [];
  artistToList: Array<Artist> = [];
  currentUser : User = new User();
  errorText = '';


  constructor(private _router: Router, private _activatedRoute: ActivatedRoute, private _tokenService: TokenService, private _artistService: ArtistService) { }

  ngOnInit() : void {
    this.loadPage();
    this.currentUser = this._tokenService.getUser();
  }

  async loadPage(){
    this.errorText = '';
    let params :any = await firstValueFrom(this._activatedRoute.params);
    if(params.page) {
      this.currentPage = +params.page;
      this.nextPage = this.currentPage + 1;
      this.prevPage = this.currentPage - 1;
      if(this.prevPage == 0) this.prevPage = 1;
    }

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

  async goToPage(page: number){
    //Impide que sigamos deplazandonos si estamos en la primera o en la ultima pagina
    if(page != this.currentPage){
      await this._router.navigate(['/artistas', page]);
      this.loadPage();
    }
  }

  getImageURL(image: string){
    return GLOBAL.API_URL + 'get-image-artist/' + image;
  }

  async deleteArtist(artistId: string) {
    try {
      let deletedArtist = await this._artistService.deleteArtist(artistId);
      if(deletedArtist){
        this.loadPage()
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

}
