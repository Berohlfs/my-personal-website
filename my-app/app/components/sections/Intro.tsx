// Next
import Image from "next/image"
import Link from "next/link"
// Icons
import { ExternalLink, Github, GraduationCap, Linkedin, Newspaper, Youtube } from "lucide-react"
// Shadcn
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export const Intro = () => {
    return (
        <section id={'intro'} className={'flex flex-col lg:flex-row justify-center mt-5 items-center'}>

            <div className={'w-full lg:w-3/5 xl:w-4/5 text-center lg:text-left'}>
                <h1 className={'text-2xl sm:text-3xl md:text-4xl xl:text-6xl font-extrabold flex flex-col mb-3 leading-10 md:leading-12 xl:leading-16'}>
                    <span>HI, I&apos;M BERNARDO!</span>
                    <span><span className={'text-primary'}>SOFTWARE</span> ENGINEER.</span>
                </h1>

                <p className={'text-muted-foreground mb-4'}>
                    I enjoy learning about new subjects and understanding how things work. I&apos;ve long been drawn to the tech industry, where I find joy in creating fun and simple solutions to everyday problems. At the moment, I dedicate most of my time to <span className={'font-bold text-primary'}>full-stack web development</span>, system documentation, and project management. Looking ahead, I&apos;m excited to specialize in <span className={'font-bold text-primary'}>data science and AI</span>.
                </p>

                <nav className={'flex gap-2 mb-7 lg:mb-0 justify-center lg:justify-start flex-wrap'}>
                    <Link href={'https://linkedin.com/in/bernardorohlfs'} target={'_blank'}>
                        <Badge className={'bg-sky-600 text-white'}>
                            <Linkedin />
                            LinkedIn
                            <ExternalLink />
                        </Badge>
                    </Link>
                    <Link href={'https://github.com/Berohlfs'} target={'_blank'}>
                        <Badge variant={'secondary'}>
                            <Github />
                            GitHub
                            <ExternalLink />
                        </Badge>
                    </Link>
                    {/*
                    <Link href={'https://www.youtube.com/@BrazilianBunker'} target={'_blank'}>
                        <Badge className={'bg-red-500 text-white'}>
                            <Youtube />
                            YouTube
                            <ExternalLink />
                        </Badge>
                    </Link>
                    */}
                    <Link href={'https://medium.com/@berohlfs'} target={'_blank'}>
                        <Badge variant={'secondary'}>
                            <Newspaper />
                            Medium
                            <ExternalLink />
                        </Badge>
                    </Link>
                     {/*
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Badge className={'bg-gray-600 text-white cursor-pointer'}>
                                <GraduationCap />
                                Bachelor&apos;s Capstone Project
                            </Badge>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Link href={'https://github.com/Berohlfs/BachelorsThesisSoftwareEngineering'} target={'_blank'}>
                                    <div className={'flex gap-2 items-center'}>
                                        Visit GitHub Repo <ExternalLink />
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href={'https://tuscan.bernardorohlfs.com'} target={'_blank'}>
                                    <div className={'flex gap-2 items-center'}>
                                        View Live Demo <ExternalLink />
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    */}
                </nav>

            </div>

            <div
                style={{
                    width: 330,
                    height: 330,
                    maskImage: 'url(/mask-hexagon.svg)',
                    WebkitMaskImage: 'url(/mask-hexagon.svg)',
                    maskSize: 'cover',
                    WebkitMaskSize: 'cover',
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    overflow: 'hidden',
                }}
            >
                <Image
                    src="/bernardo-profile-bg.png"
                    alt="Profile Picture"
                    width={330}
                    height={330}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
            </div>
        </section>
    )
}