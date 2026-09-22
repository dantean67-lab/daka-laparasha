import Link from "next/link";

export default function Breadcrumb({ parent, current }: { parent: { label: string; href: string }; current: string }) {
  return (
    <nav aria-label="פירורי לחם" className="font-ui text-base text-muted">
      <ol className="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-1 p-0">
        <li>
          <Link href="/" className="hover:text-accent">בית</Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link href={parent.href} className="hover:text-accent">{parent.label}</Link>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="text-text">{current}</li>
      </ol>
    </nav>
  );
}
