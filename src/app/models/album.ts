export class Album {
  constructor(
    public _id: string = '',
    public title: string  = '',
    public description: string = '',
    public year: number = (new Date()).getFullYear(),
    public image: string = '',
    public artist: string = ''
  ) {
  }
}
