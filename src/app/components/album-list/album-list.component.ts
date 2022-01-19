import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Album } from 'src/app/models/album';
import { User } from 'src/app/models/user';
import { Location } from '@angular/common';
import { TokenService } from 'src/app/services/token.service';
import { AlbumService } from 'src/app/services/album.service';
import { GLOBAL } from 'src/app/services/global';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css']
})
export class AlbumListComponent implements OnInit {
  @HostBinding('class') defaultClasses = 'd-flex h-100 w-100';

  currentUser : User = new User();

  prevPage = 1;
  currentPage = 1;
  nextPage = 1;

  itemsPerPage = 3;

  albumsToList : Array<Album> = [];
  isDeletingAlbum : Array<boolean> = [];
  
  errorText = '';

  constructor(private _activatedRoute: ActivatedRoute, 
    private _location: Location, 
    private _tokenService: TokenService,  
    private _albumService: AlbumService) { }

  ngOnInit(): void {
    this.loadAlbums(this.currentPage);
    this.currentUser = this._tokenService.getUser();
  }

  async loadAlbums(page: number){
    this.currentPage = page;
    this.nextPage = page + 1;
    this.prevPage = page - 1;
    this.albumsToList = [];
    this.isDeletingAlbum = [];
    if(this.prevPage == 0) this.prevPage = 1;
    try {
      let albums : any = await this._albumService.listAlbums(page, this.itemsPerPage);
      if(albums.albums){
        let totalPages = Math.ceil((albums.total_items / this.itemsPerPage));
        if(this.currentPage == totalPages) this.nextPage = this.currentPage;
        albums.albums.map((album: any) => {
          this.albumsToList.push(new Album(album._id, album.title, album.description, album.year, album.image));
          this.isDeletingAlbum.push(false);
        });
      } else {
        this.errorText = albums.message ? albums.message : 'Ocurrio un error, vuelva a intentarlo';
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

  getAlbumImageURL(albumImage: string){
    return GLOBAL.API_URL + 'get-image-album/' + albumImage;
  }

  deleteAlbum(i: number){
    this.isDeletingAlbum[i] = true;
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
