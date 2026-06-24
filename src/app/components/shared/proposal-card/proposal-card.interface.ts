export interface ProposalCardArrayInterface {
  card: Array<ProposalCardInterface>
}

export interface ProposalCardInterface {
  id: number,
  nom: string,
  info_title1?: string,
  info1: string,
  info_title2?: string,
  info2?: string,
  info_title_list?: string,
  info_list?: string,
  info_title3?: string,
  info3?: string
}
