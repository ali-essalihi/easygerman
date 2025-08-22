import Link from 'next/link'

interface Item {
  href: string
  label: string
}

interface Props {
  items: Item[]
}

export default function Breadcrumb({ items }: Props) {
  const sep = <span className="px-1.5">/</span>
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol>
        {items.map((item, index) => (
          <li key={item.href} className="inline-block">
            {index !== 0 && sep}
            <Link href={item.href} prefetch={false} className="text-primary hover:underline">
              {item.label}
            </Link>
            {items.length - 1 === index && sep}
          </li>
        ))}
      </ol>
    </nav>
  )
}
