import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Artist } from 'src/app/models/artist';
import { User } from 'src/app/models/user';
import { ArtistService } from 'src/app/services/artist.service';
import { GLOBAL } from 'src/app/services/global';
import { TokenService } from 'src/app/services/token.service';
import { Location } from '@angular/common';
import { AlbumService } from 'src/app/services/album.service';
import { Album } from 'src/app/models/album';

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

  prevPage = 1;
  currentPage = 1;
  nextPage = 1;

  itemsPerPage = 3;

  albumsToList : Array<Album> = [];
  isDeletingAlbum : Array<boolean> = [];



  constructor(private _activatedRoute: ActivatedRoute, 
    private _location: Location, 
    private _tokenService: TokenService,  
    private _artistService: ArtistService, 
    private _albumService: AlbumService) { }

  ngOnInit() {
    this.loadArtist();
    this.currentUser = this._tokenService.getUser();
  }

  async loadArtist(){
    let params : any = await firstValueFrom(this._activatedRoute.params);
    if(params.id) {
      try {
        let getArtist : any = await this._artistService.getArtist(params.id);
        if(getArtist.artist){
          this.artist = new Artist(getArtist.artist._id, getArtist.artist.name, getArtist.artist.description, getArtist.artist.image);
          this.loadAlbums(this.currentPage);
        } else {
          this.errorText = 'No se obtuvo un artista';
        }
      } catch(error: any){
        this.errorText = error.error.message ? error.error.message : 'Ocurrio un error, vuelva a intentarlo';
      }
    }
  }

  async loadAlbums(page: number){
    this.currentPage = page;
    this.nextPage = page + 1;
    this.prevPage = page - 1;
    this.albumsToList = [];
    this.isDeletingAlbum = [];
    if(this.prevPage == 0) this.prevPage = 1;
    try {
      let albums : any = await this._albumService.listAlbums(page, this.itemsPerPage, this.artist._id);
      if(albums.albums){
        let totalPages = Math.ceil((albums.total_items / this.itemsPerPage));
        if(this.currentPage == totalPages) this.nextPage = this.currentPage;
        albums.albums.map((album: any) => {
          this.albumsToList.push(new Album(album._id, album.title, album.description, album.year, album.image, this.artist._id));
          this.isDeletingAlbum.push(false);
        });
      } else {
        this.errorText = albums.message ? albums.message : 'Ocurrio un error, vuelva a intentarlo';
      }
    } catch(error: any){
      this.errorText = error.error.message ? error.error.message : 'Ocurrio un error, vuelva a intentarlo';
    }
  }

  goToPage(page: number) {
    this.loadAlbums(page);
  }

  getArtistImageURL(){
    return GLOBAL.API_URL + 'get-image-artist/' + this.artist.image;
  }

  getAlbumImageURL(albumImage: string){
    return GLOBAL.API_URL + 'get-image-album/' + albumImage;
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

  async confirmDeleteAlbum(albumId: string){
    try {
      let deletedAlbum = await this._albumService.deleteAlbum(albumId);
      if(deletedAlbum){
        if(this.albumsToList.length == 1){
          this.loadAlbums(this.prevPage);
        } else {
          this.loadAlbums(this.currentPage);
        }
      } else {
        this.errorText = 'No se elimino el album.';
      }
    } catch(error: any){
      this.errorText = error.error.message ? error.error.message : 'Ocurrio un error, vuelva a intentarlo';
    }
  }

  delete(){
    this.isDeleting = true;
  }

  deleteAlbum(i: number){
    this.isDeletingAlbum[i] = true;
  }

  cancelDelete(){
    this.errorText = '';
    this.isDeleting = false;
  }

  cancelDeleteAlbum(i: number){
    this.isDeletingAlbum[i] = false;
  }

  isAdmin(){
    return this.currentUser.role == 'ROLE_ADMIN';
  }

  back(){
    this._location.back();
  }
}
