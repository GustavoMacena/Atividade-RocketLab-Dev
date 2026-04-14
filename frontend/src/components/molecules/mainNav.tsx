type NavItem = {
  label: string
  href: string
}

type MainNavProps = {
  items: NavItem[]
}

function MainNav({ items }: MainNavProps) {
  return (
    <nav aria-label="Navegacao principal">
      <ul className="flex items-center gap-6 text-sm font-medium text-slate-300">
        {items.map((item) => (
          <li key={item.href}>
            <a href={item.href} className="transition hover:text-slate-100">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default MainNav