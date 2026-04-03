// Next
import Image from "next/image"
import Link from "next/link"
// Icons
import { ExternalLink } from "lucide-react"
// Shadcn
import { Button } from "@/components/ui/button"

export const Certifications = () => {

    const certificates = [
        { title: 'Meta Front-End Developer', description: 'Professional Certificate', link: 'https://www.coursera.org/account/accomplishments/professional-cert/certificate/AJB8NV4V7YMH', image: '/meta.png' },
       // { title: 'Google Project Management', description: 'In progress...', link: 54, image: '/google.png' },
     //   { title: 'Duolingo', description: 'English Test', link: 'https://certs.duolingo.com/132d6d6d394a5f1893e5eb75578892d8', image: '/duolingo.png' },
       // { title: 'Certified Associate in Project Management', description: 'Future Goal', link: 0, image: '/pmi.svg' }
    ]

    return (<>
        <section className={'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'}>

            {certificates.map(item => (
                <article key={item.title} className={'flex flex-col h-48 justify-between items-center'}>
                    <Image
                        src={item.image}
                        alt={item.title}
                        width={80}
                        height={80}
                        className={'w-24'}
                    />
                    <div className={'text-center flex flex-col items-center'}>
                        <h4 className={'text-sm mb-1'}>{item.title}</h4>
                        <p className={'text-muted-foreground text-xs mb-2'}>{item.description}</p>
                        {typeof item.link === 'string' ?
                            <Button size={'sm'} variant={'ghost'} asChild>
                                <Link href={item.link} target={'_blank'}>
                                    Certification
                                    <ExternalLink />
                                </Link>
                            </Button> :
                            <div>
                                <div className={'h-2 w-[120px] bg-secondary rounded-lg'}>
                                    <div className={'h-2 bg-primary rounded-lg'} style={{width: `${120 / 100 * item.link}px`}} />
                                </div>
                                <p className={'text-muted-foreground mt-1 text-xs'}>{item.link}%</p>
                            </div>}
                    </div>
                </article>
            ))}
        </section>
    </>)
}