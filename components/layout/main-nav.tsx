"use client";

import { NavigationMenu } from "@base-ui/react/navigation-menu";
import { ChevronDown } from "lucide-react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import {
  isNavGroup,
  mainNav,
  type NavGroup,
  type NavLink,
} from "@/lib/site-config";
import { cn } from "@/lib/utils";

/** Returns true for the exact route, or for any child of a section route. */
export function isActiveRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** A group is active when the current page is one of its links. */
export function isGroupActive(pathname: string, group: NavGroup) {
  return group.items.some((item) => isActiveRoute(pathname, item.href));
}

const topLevelClassName =
  "relative flex h-11 items-center gap-1 rounded-lg px-3 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

function ActiveUnderline() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-x-3 bottom-1.5 h-0.5 rounded-full bg-primary"
    />
  );
}

export function MainNav() {
  const pathname = usePathname();

  return (
    <NavigationMenu.Root aria-label="Main" className="hidden lg:block">
      <NavigationMenu.List className="flex items-center gap-0.5">
        {mainNav.map((item) =>
          isNavGroup(item) ? (
            <NavGroupItem
              key={item.label}
              group={item}
              active={isGroupActive(pathname, item)}
              pathname={pathname}
            />
          ) : (
            <NavigationMenu.Item key={item.href}>
              <TopLevelLink
                link={item}
                active={isActiveRoute(pathname, item.href)}
              />
            </NavigationMenu.Item>
          ),
        )}
      </NavigationMenu.List>

      <NavigationMenu.Portal>
        <NavigationMenu.Positioner
          sideOffset={6}
          collisionPadding={16}
          className="z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left] duration-200 ease-out data-instant:transition-none"
        >
          <NavigationMenu.Popup className="relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) rounded-2xl border border-border bg-popover text-popover-foreground shadow-lg shadow-primary/5 outline-none transition-[opacity,transform,width,height] duration-200 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <NavigationMenu.Viewport className="relative size-full overflow-hidden" />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  );
}

function TopLevelLink({ link, active }: { link: NavLink; active: boolean }) {
  return (
    <NavigationMenu.Link
      active={active}
      aria-current={active ? "page" : undefined}
      render={<NextLink href={link.href} />}
      className={cn(
        topLevelClassName,
        active ? "text-primary" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {link.label}
      {active ? <ActiveUnderline /> : null}
    </NavigationMenu.Link>
  );
}

function NavGroupItem({
  group,
  active,
  pathname,
}: {
  group: NavGroup;
  active: boolean;
  pathname: string;
}) {
  return (
    <NavigationMenu.Item value={group.label}>
      <NavigationMenu.Trigger
        className={cn(
          topLevelClassName,
          active
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground data-popup-open:text-foreground",
        )}
      >
        {group.label}
        <NavigationMenu.Icon className="transition-transform duration-200 data-popup-open:rotate-180">
          <ChevronDown aria-hidden="true" className="size-3.5" />
        </NavigationMenu.Icon>
        {active ? <ActiveUnderline /> : null}
      </NavigationMenu.Trigger>

      <NavigationMenu.Content className="w-max min-w-56 p-2 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0">
        <ul className="flex flex-col gap-0.5">
          {group.items.map((link) => {
            const linkActive = isActiveRoute(pathname, link.href);
            return (
              <li key={link.href}>
                <NavigationMenu.Link
                  active={linkActive}
                  aria-current={linkActive ? "page" : undefined}
                  closeOnClick
                  render={<NextLink href={link.href} />}
                  className={cn(
                    "flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    linkActive
                      ? "bg-accent text-primary"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  {link.label}
                </NavigationMenu.Link>
              </li>
            );
          })}
        </ul>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  );
}
