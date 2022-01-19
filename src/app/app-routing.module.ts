import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { ArtistListComponent } from './components/artist-list/artist-list.component';
import { HomeComponent } from './components/home/home.component';
import { ArtistAddComponent } from './components/artist-add/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail/artist-detail.component';
import { AlbumAddComponent } from './components/album-add/album-add.component';
import { AlbumEditComponent } from './components/album-edit/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail/album-detail.component';
import { SongAddComponent } from './components/song-add/song-add.component';
import { AlbumListComponent } from './components/album-list/album-list.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'mis-datos', component: UserEditComponent },

  { path: 'artistas', component: ArtistListComponent },
  { path: 'crear-artista', component: ArtistAddComponent },
  { path: 'editar-artista/:id', component: ArtistEditComponent},
  { path: 'artista/:id', component: ArtistDetailComponent },

  { path: 'albums', component: AlbumListComponent },
  { path: 'crear-album/:artistId', component: AlbumAddComponent },
  { path: 'editar-album/:id', component: AlbumEditComponent },
  { path: 'album/:id', component: AlbumDetailComponent },
  { path: 'crear-cancion/:albumId', component: SongAddComponent },
  { path: '**', component: HomeComponent },
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
}
