export type CreateEchoDTO = {
  content: string
  reference: string
  isPublished: boolean
}

export type UpdateEchoDTO = CreateEchoDTO & {
  id: number
}

export type EchoRecord = {
  id: number
  content: string
  reference: string
  isPublished: boolean
  createdAt: string
}

export type UpdateEchoParams = {
  id: number
  content?: string
  reference?: string
  isPublished?: boolean
}
