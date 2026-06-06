export interface ContactArrayInterface {
  coordonnees: Array<ContactInterface>
}

export interface ContactInterface {
  id: number,
  nom: string,
  info1: string,
  info2?: string,
  info3?: string,
  info4?: string,
  icon_url: string
}
