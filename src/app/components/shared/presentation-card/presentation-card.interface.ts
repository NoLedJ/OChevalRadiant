export interface PresentationCardArrayInterface {
  card: Array<PresentationCardInterface>
}

export interface PresentationCardInterface {
  id: number,
  nom: string,
  role?: string,
  info: string,
  photo_url: string
}
