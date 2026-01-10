import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

export default function SidebarLink({ href, icon, label }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-4 py-2 rounded-lg border-2
        ${isActive
          ? "bg-surface-alt text-text border-border"
          : "text-text border-transparent hover:bg-surface-alt hover:border-border"
        }
        transition-none
      `}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

