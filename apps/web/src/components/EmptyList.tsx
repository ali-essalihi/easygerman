interface Props {
  children: string
}

export default function EmptyList({ children }: Props) {
  return <p className="text-gray-600">{children}</p>
}
