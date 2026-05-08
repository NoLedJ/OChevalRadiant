export interface DefinitionCardInterface {
  card: Array<Card>
}

export interface Card {
  id: number,
  nom: string,
  info: string,
  icon_url: string
}
