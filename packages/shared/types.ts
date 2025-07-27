export interface GetGoogleAuthUrlRes {
  url: string
}

export interface GetCurrentUserRes {
  email: string
  role: 'admin' | 'learner'
}
