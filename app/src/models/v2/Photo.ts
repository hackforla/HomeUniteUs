export interface Photo {
    id: string
    filename: string
}
export interface PhotoCollection {
    home: Array<Photo>
    host: Array<Photo>
}
