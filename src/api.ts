import { MOBILE_FEEDBACK_PATH, TILTEDOS_API_BASE_URL } from './config'
import type { MobileFeedbackPriority } from './priorities'

export interface SubmitMobileFeedbackParams {
  readonly apiKey: string
  readonly description: string
  readonly imageUri: string
  readonly priority?: MobileFeedbackPriority
  readonly platform?: string
  readonly appVersion?: string
  readonly buildNumber?: string
}

export async function submitMobileFeedback(
  params: SubmitMobileFeedbackParams,
): Promise<unknown> {
  const url = `${TILTEDOS_API_BASE_URL.replace(/\/$/, '')}${MOBILE_FEEDBACK_PATH}`
  const form = new FormData()
  form.append('description', params.description)
  if (params.priority) {
    form.append('priority', params.priority)
  }
  if (params.platform) form.append('platform', params.platform)
  if (params.appVersion) form.append('appVersion', params.appVersion)
  if (params.buildNumber) form.append('buildNumber', params.buildNumber)
  form.append('screenshot', {
    uri: params.imageUri,
    name: 'screenshot.jpg',
    type: 'image/jpeg',
  } as unknown as Blob)

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'x-api-key': params.apiKey,
    },
    body: form,
  })

  const text = await res.text()
  if (!res.ok) {
    let body: unknown = text
    try {
      body = text ? JSON.parse(text) : null
    } catch {
      /* keep text */
    }
    throw new Error(
      typeof body === 'object' && body !== null && 'message' in body
        ? String((body as { message?: unknown }).message)
        : `HTTP ${res.status}: ${text || res.statusText}`,
    )
  }

  return text ? JSON.parse(text) : null
}
