import api from './axios'

export interface PredictionDto {
  client_id?: string
  type?: string
  payload: Record<string, any>
  score?: number
}

export async function createPrediction(item: PredictionDto, token?: string) {
  const res = await api.post('/predictions', item, token ? {
    headers: { Authorization: `Bearer ${token}` },
  } : undefined)
  return res.data
}

export async function bulkImportPredictions(items: PredictionDto[], token?: string) {
  const res = await api.post('/predictions/bulk', { items }, token ? {
    headers: { Authorization: `Bearer ${token}` },
  } : undefined)
  return res.data
}

export async function listPredictions(token?: string) {
  const res = await api.get('/predictions', token ? {
    headers: { Authorization: `Bearer ${token}` },
  } : undefined)
  return res.data
}
