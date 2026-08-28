import Parser from 'rss-parser'
import { MediumArticle } from './types'

type CustomItem = {
    contentEncoded: string
}

const parser = new Parser<Record<string, unknown>, CustomItem>({
    customFields: {
        item: [
            ['content:encoded', 'contentEncoded']
        ]
    }
})

export async function getMediumPosts(username: string): Promise<MediumArticle[]> {
    const res = await fetch(`https://medium.com/feed/@${username}`, {
        cache: 'force-cache',
        next: {
            revalidate: 3600 // in seconds: 1 hour
        }
    })
    if (!res.ok) {
        throw new Error(`Medium RSS feed responded ${res.status} for @${username}`)
    }
    const xml = await res.text()
    const feed = await parser.parseString(xml)

    return feed.items.map(item => {
        const plainText = (item.contentEncoded ?? '').replace(/<[^>]+>/g, '').trim() // strip HTML tags
        const preview = plainText.slice(0, 200) + (plainText.length > 200 ? '…' : '')

        return {
            title: item.title,
            link: item.link,
            description: preview,
            pubDate: item.pubDate
        }
    })
}
