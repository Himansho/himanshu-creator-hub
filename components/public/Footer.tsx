import Link from "next/link";

export default function Footer({ name }: { name: string }) {
  return (
    <footer className="border-t border-edge">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-8 text-sm text-faint">
        <p>
          © {new Date().getFullYear()} {name}. Built with care.
        </p>
        <Link
          href="/login"
          className="transition-colors hover:text-muted"
          aria-label="Admin login"
        >
          ⌂
        </Link>
      </div>
    </footer>
  );
}
