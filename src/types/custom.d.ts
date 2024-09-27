export type User = {
  id: string
  email: string
  first_name: string
  last_name: string
  avatar: string
}

export type Page = {
  page: number
  per_page: number
  total: number
  total_pages: number
  data: Array<User>
}

export interface FetchUsersInterface {
  ({ pageParam }: { pageParam: number }): Promise<Page>
}
