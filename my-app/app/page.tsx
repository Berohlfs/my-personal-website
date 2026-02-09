// Icons
import { Github, Newspaper, Verified, Youtube } from "lucide-react"
// Libs
import Parser from 'rss-parser'
// Types
import { User, Channel, Repos } from "@/utils/types"
// Components
import { Header } from "./components/sections/Header"
import { MediumArticles } from "./components/sections/MediumArticles"
import { PlatformSpecs } from "./components/sections/PlatformSpecs"
import { ReposList } from "./components/sections/Repos"
import { Certifications } from "./components/sections/Certifications"
import { Intro } from "./components/sections/Intro"
import { Subtitle } from "./components/Subtitle"
import { Footer } from "./components/sections/Footer"

export default async function Home() {

  const getUser = async () => {
    const res = await fetch(`https://api.github.com/users/Berohlfs`, {
      cache: 'force-cache',
      next: {
        revalidate: 86400 // em segundos: 1 dia
      },
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    const user = await res.json() as User
    return user
  }

  const getRepos = async () => {
    const res = await fetch(`https://api.github.com/users/Berohlfs/repos`, {
      cache: 'force-cache',
      next: {
        revalidate: 86400 // em segundos: 1 dia
      },
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    const repos = await res.json() as Repos
    return repos
  }

  const getYTChannel = async () => {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${process.env.GOOGLE_YOUTUBE_CHANNEL_ID}&key=${process.env.GOOGLE_YOUTUBE_KEY}`, {
      cache: 'force-cache',
      next: {
        revalidate: 86400 // em segundos: 1 dia
      }
    })
    const channel = await res.json() as Channel

    return channel
  }

  const parser = new Parser({
    customFields: {
      item: [
        ['content:encoded', 'contentEncoded']
      ]
    }
  })

  async function getMediumPosts(username: string) {
    const res = await fetch(`https://medium.com/feed/@${username}`, {
      cache: 'force-cache',
      next: {
        revalidate: 3600
      }
    })
    const xml = await res.text()
    const feed = await parser.parseString(xml)

    return feed.items.map(item => {
      const html = item.contentEncoded as string
      const plainText = html.replace(/<[^>]+>/g, '').trim() // strip HTML tags

      const preview = plainText.slice(0, 200) + (plainText.length > 200 ? '…' : '')

      return {
        title: item.title,
        link: item.link,
        description: preview,
        pubDate: item.pubDate
      }
    })
  }

  const articles = await getMediumPosts('berohlfs')
  const user = await getUser()
  const repos = await getRepos()
  const channel = await getYTChannel()

  return (<>

    <Header avatar_url={user.avatar_url} />

    <main className={'relative top-17 max-w-[1200px] mx-auto px-10 mb-10'}>

      <Intro />

      <Subtitle title={'GitHub Projects'} Icon={Github} />

      <PlatformSpecs
        link={'https://github.com/Berohlfs'}
        title={user.login}
        image_url={user.avatar_url}
        specs={[
          { label: 'repositories', count: user.public_repos },
          { label: 'followers', count: user.followers },
          { label: 'following', count: user.following },
        ]} />

      <ReposList repos={repos} />

      <Subtitle title={'Medium Articles'} Icon={Newspaper} />

      <MediumArticles articles={articles} />

      <Subtitle title={'Certifications'} Icon={Verified} />

      <Certifications />

      <Subtitle title={'YouTube Videos'} Icon={Youtube} />

      <PlatformSpecs
        link={'https://www.youtube.com/@BrazilianBunker'}
        title={channel.items[0].snippet.title}
        image_url={channel.items[0].snippet.thumbnails.default.url}
        specs={[
          { label: 'subscribers', count: channel.items[0].statistics.subscriberCount },
          { label: 'total views', count: channel.items[0].statistics.viewCount },
          { label: 'videos', count: channel.items[0].statistics.videoCount },
        ]} />

    </main>

    <Footer />

  </>)
}