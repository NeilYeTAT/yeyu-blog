export type CreateTagDTO = {
  tagName: string
}

export type UpdateTagNameDTO = CreateTagDTO & {
  id: number
}
export type DeleteTagDTO = UpdateTagNameDTO

export type TagOptionRecord = {
  id: number
  tagName: string
}

export type WithCountTagDTO = UpdateTagNameDTO & {
  count: number
}
