import Image from 'next/image';
import Link from 'next/link';
import { LayoutProps } from '../interfaces/intefaces';

export default function Layout({ children }: LayoutProps) {

  return (
    <div >
      <header>
        <div className="logo-img">
          <Image
            src="/media/convertMeIcon.png"
            height={40}
            width={300}
            alt="Logo for ConvertMe app"
          />
        </div>  
      </header>
      <main>{children}</main>
      <footer>
        <video autoPlay loop muted>
          <source src="/media/background.mp4" type="video/mp4" />
        </video>
      </footer>
    </div>
  );
}
