// Response shapes for the archived integrations.
// Sample values from real responses are kept as inline comments.

export type User = {
    login: string, // "Berohlfs",
    id: number, // 90404673,
    node_id: string, // "MDQ6VXNlcjkwNDA0Njcz",
    avatar_url: string, // "https://avatars.githubusercontent.com/u/90404673?v=4",
    gravatar_id: string, // "",
    url: string, // "https://api.github.com/users/Berohlfs",
    html_url: string, // "https://github.com/Berohlfs",
    followers_url: string, // "https://api.github.com/users/Berohlfs/followers",
    following_url: string, // "https://api.github.com/users/Berohlfs/following{/other_user}",
    gists_url: string, // "https://api.github.com/users/Berohlfs/gists{/gist_id}",
    starred_url: string, // "https://api.github.com/users/Berohlfs/starred{/owner}{/repo}",
    subscriptions_url: string, // "https://api.github.com/users/Berohlfs/subscriptions",
    organizations_url: string, // "https://api.github.com/users/Berohlfs/orgs",
    repos_url: string, // "https://api.github.com/users/Berohlfs/repos",
    events_url: string, // "https://api.github.com/users/Berohlfs/events{/privacy}",
    received_events_url: string, // "https://api.github.com/users/Berohlfs/received_events",
    type: string, // "User",
    user_view_type: string, // "public",
    site_admin: boolean,
    name: string, // "Bernardo Cruz Rohlfs",
    company: string, // "Webimob Seguros Imobiliários",
    blog: string, // "",
    location: string, // "Belo Horizonte",
    email: string | null,
    hireable: string | null,
    bio: string, // "Software Engineering Student",
    twitter_username: string | null,
    public_repos: number,
    public_gists: number,
    followers: number,
    following: number,
    created_at: string, // "2021-09-09T15:11:00Z",
    updated_at: string, // "2025-06-26T11:38:58Z"
}

export type Repos = {
    id: number // 994199590,
    node_id: string // "R_kgDOO0JIJg",
    name: string // "AI-medical-triage-assistant",
    full_name: string // "Berohlfs/AI-medical-triage-assistant",
    private: boolean // false,
    html_url: string // "https://github.com/Berohlfs/AI-medical-triage-assistant",
    description: string // null,
    fork: boolean // false,
    url: string // "https://api.github.com/repos/Berohlfs/AI-medical-triage-assistant",
    stargazers_count: number // 0,
    watchers_count: number // 0,
    language: string // "HTML",
    forks_count: number // 1,
    visibility: string // "public",
    forks: number // 1,
    open_issues: number // 0,
    watchers: number // 0,
    default_branch: string // "main"
}[]

export type MediumArticle = {
    title?: string, // "Some article title"
    link?: string, // "https://medium.com/@berohlfs/..."
    description: string, // plain-text preview, ≤200 chars + ellipsis
    pubDate?: string, // "Tue, 01 Jul 2025 12:00:00 GMT"
}

export type Channel = {
    kind: string, // "youtube#channelListResponse",
    etag: string, // "pd_GicW72aGfU04YnKLo2wQHoy0",
    pageInfo: {
        totalResults: number, // 1,
        resultsPerPage: number, // 5
    },
    items: [
        {
            kind: string, // "youtube#channel",
            etag: string, // "tvgTbUPJx6M5TuACw389QIFN3hY",
            id: string, // "UCeYd75shMrx7jb8IEJXNTNg",
            snippet: {
                title: string, // "Brazilian Bunker",
                description: string, // "Welcome to Brazilian Bunker! ..."
                customUrl: string, // "@brazilianbunker",
                publishedAt: string, // "2025-06-28T18:13:11.245049Z",
                thumbnails: {
                    default: {
                        url: string, // "https://yt3.ggpht.com/...=s88-c-k-c0x00ffffff-no-rj",
                        width: number, // 88,
                        height: number, // 88
                    },
                    medium: {
                        url: string, // "https://yt3.ggpht.com/...=s240-c-k-c0x00ffffff-no-rj",
                        width: number, // 240,
                        height: number, // 240
                    },
                    high: {
                        url: string, // "https://yt3.ggpht.com/...=s800-c-k-c0x00ffffff-no-rj",
                        width: number, // 800,
                        height: number, // 800
                    }
                },
                localized: {
                    title: string, // "Brazilian Bunker",
                    description: string, // "Welcome to Brazilian Bunker! ..."
                }
            },
            statistics: {
                viewCount: string, // "0",
                subscriberCount: string, // "0",
                hiddenSubscriberCount: boolean, // false,
                videoCount: string, // "0"
            }
        }
    ]
}
