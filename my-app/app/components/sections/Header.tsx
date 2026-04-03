// Next
import Image from "next/image"
// Icons
import { Mail } from "lucide-react"
// Components
import { ModeToggle } from "../mode-toggle"

type Props = {
    avatar_url: string
}

export const Header = ({ avatar_url }: Props) => {
    return (
        <header className={'fixed top-0 w-full bg-background z-10 border-b'}>
            <div className={'max-w-[1200px] mx-auto px-10 py-4 flex justify-between items-center'}>
                <div className={'flex items-center gap-3'}>
                    <Image
                        src={avatar_url}
                        width={40}
                        height={40}
                        alt={'Profile Picture'}
                        className={'rounded-full shadow'} />
                    <div>
                        <p className={'text-sm'}>
                            <strong>Bernardo Rohlfs</strong>
                        </p>
                        <p className={'text-muted-foreground text-xs flex items-center gap-1'}>
                            <Mail size={13} />berohlfs@gmail.com
                        </p>
                    </div>
                </div>

                <ModeToggle />
            </div>
        </header>
    )
}