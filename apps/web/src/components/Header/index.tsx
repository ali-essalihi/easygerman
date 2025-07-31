import Link from 'next/link'
import Logo from '../Logo'
import AuthButton from './AuthButton'

export default function Header() {
  return (
    <header className="bg-white shadow py-2">
      <div className="container flex items-center justify-between">
        <Link href="/" aria-label="Homepage">
          <Logo />
        </Link>
        <AuthButton />
      </div>
    </header>
  )
}
