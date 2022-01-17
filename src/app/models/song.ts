export class Song {
  constructor(
    public _id: string = '',
    public number: number = 0,
    public name: string = '',
    public duration: number = 0,
    public file: string = '',
    public album: string = ''
  ) {}
}
