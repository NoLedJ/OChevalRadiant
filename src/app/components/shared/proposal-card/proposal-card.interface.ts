export interface ProposalCardArrayInterface {
  card: Array<ProposalCardInterface>
}

export interface ProposalCardInterface {
  id: number,
  nom: string,
  info1: string,
  info2?: string,
  info3?: string
}
