export interface DefinitionCardArrayInterface {
  card: Array<DefinitionCardInterface>
}

export interface DefinitionCardInterface {
  id: number,
  nom: string,
  info: string,
  icon_url: string
}
