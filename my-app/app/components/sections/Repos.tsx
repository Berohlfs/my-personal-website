// Next
import Link from "next/link"
// Types
import { Repos } from "@/types/types"
// Shadcn
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
// Icons
import { CircleDot, ExternalLink, GitFork, Star } from "lucide-react"

type Props = {
    repos: Repos
}

export const ReposList = ({ repos }: Props) => {
    return (
        <section>
            <ul className={'mt-4 h-64 overflow-y-scroll grid grid-cols-1 sm:grid-cols-2 gap-4'}>
                {repos.map(repo => (
                    <li key={repo.id}>
                        <article className={'border rounded-md p-3 h-full flex flex-col justify-between'}>
                            <div>
                                <div className={'flex items-center justify-between'}>
                                    <h1 className={'font-medium text-sm truncate w-64 sm:w-full'}>{repo.full_name}</h1>
                                    <Link href={repo.html_url} target="_blank">
                                        <Button variant={'link'} size={'sm'}>
                                            Visit
                                            <ExternalLink />
                                        </Button>
                                    </Link>
                                </div>
                                <p className={'text-xs text-muted-foreground'}>{repo.description || 'No description'}</p>
                            </div>
                            <div className={'flex items-center gap-2 mt-3'}>
                                <Badge><CircleDot />{repo.language} </Badge>
                                <Badge variant={'outline'}>{repo.forks_count} forks <GitFork /></Badge>
                                <Badge variant={'outline'}>{repo.stargazers_count} stars <Star /></Badge>
                            </div>
                        </article>
                    </li>))}
            </ul >
        </section>
    )
}