import Link from "next/link";
import Image from "next/image";
import HeroImg from "../../public/img/hero.jpg";
import { Logo } from "@/components/Logo";

export default function Home() {

  return (
    <div className="w-screen h-screen overflow-hidden flex justify-center items-center
     relative">
    <Image src={HeroImg} alt="Hero" fill className="absolute"/>
      <div className="relative z-10 text-white px-10 py-5 text-center max-w-screen-sm  bg-slate-900/90 rounded-md backdrop-blur-sm">
        <Logo/>
        <p>
        Boost your blog's reach with our AI-powered SaaS solution that generates SEO-optimized posts effortlessly.
        </p>
        <Link href="/post/new"  className='btn'>Begin</Link>
      </div>
    </div>
  )
}
