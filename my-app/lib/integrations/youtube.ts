import { Channel } from './types'

export async function getYoutubeChannel(): Promise<Channel> {
    const key = process.env.GOOGLE_YOUTUBE_KEY
    const channelId = process.env.GOOGLE_YOUTUBE_CHANNEL_ID
    if (!key || !channelId) {
        throw new Error('Missing GOOGLE_YOUTUBE_KEY or GOOGLE_YOUTUBE_CHANNEL_ID env var')
    }
    const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${key}`, {
        cache: 'force-cache',
        next: {
            revalidate: 86400 // in seconds: 1 day
        }
    })
    if (!res.ok) {
        throw new Error(`YouTube Data API responded ${res.status}`)
    }
    return await res.json() as Channel
}
