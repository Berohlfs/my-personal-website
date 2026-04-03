// Next
import Link from "next/link"
import Image from "next/image"
// Icons
import { ExternalLink } from "lucide-react"

type Props = {
    image_url?: string,
    title: string,
    link: string
    specs: {
        label: string,
        count: number | string,
    }[]
}

export const PlatformSpecs = ({ image_url, title, specs, link }: Props) => {
    return (
        <Link href={link} target={'_blank'}>
            <section className={'rounded-lg bg-card p-4 flex gap-5 sm:items-center'}>
                {image_url && (
                <Image
                    src={image_url}
                    alt={`Profile Picture - ${title}`}
                    width={45}
                    height={45}
                        className={'rounded-full h-16 w-16 shrink-0'}
                    />
                )}
                <div>
                    <h4 className={'mb-2 flex items-center gap-2'}>{title} <ExternalLink size={12} /></h4>
                    <div className={'flex items-center gap-3 flex-wrap'}>
                        {specs.map(item => (
                            <p className={'text-sm text-muted-foreground'} key={item.label}>
                                <span className={'font-bold text-primary'}>{item.count}</span> {item.label}
                            </p>
                        ))}
                    </div>
                </div>
            </section>
        </Link>
    )
}