import { Repos, User } from './types'

const GITHUB_API = 'https://api.github.com'
const GITHUB_USERNAME = 'Berohlfs'

const githubHeaders = () => ({
    'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
})

export async function getGithubUser(): Promise<User> {
    const res = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`, {
        cache: 'force-cache',
        next: {
            revalidate: 86400 // in seconds: 1 day
        },
        headers: githubHeaders()
    })
    if (!res.ok) {
        throw new Error(`GitHub API responded ${res.status} for /users/${GITHUB_USERNAME}`)
    }
    return await res.json() as User
}

export async function getGithubRepos(): Promise<Repos> {
    const res = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}/repos`, {
        cache: 'force-cache',
        next: {
            revalidate: 86400 // in seconds: 1 day
        },
        headers: githubHeaders()
    })
    if (!res.ok) {
        throw new Error(`GitHub API responded ${res.status} for /users/${GITHUB_USERNAME}/repos`)
    }
    return await res.json() as Repos
}
