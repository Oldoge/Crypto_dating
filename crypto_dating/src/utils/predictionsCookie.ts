export type PredictionItem = {
  client_id?: string
  type?: string
  payload: Record<string, any>
  score?: number
  created_at?: string
}

const COOKIE_NAME = 'predictions'

export function readPredictionsFromCookie(): PredictionItem[] {
  const match = document.cookie.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)'))
  if (!match) return []
  try {
    return JSON.parse(decodeURIComponent(match[2]))
  } catch {
    return []
  }
}

export function writePredictionsToCookie(items: PredictionItem[]) {
  const value = encodeURIComponent(JSON.stringify(items))
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${30 * 24 * 60 * 60}`
}

export function clearPredictionsCookie() {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`
}
