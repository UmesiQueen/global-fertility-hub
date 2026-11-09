"use client";

import { Accordion } from "@base-ui/react/accordion";
import { Dialog } from "@base-ui/react/dialog";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ButtonLink } from "@/components/shared/button-link";
import { Button } from "@/components/ui/button";
import { isNavGroup, mainNav, type NavLink } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { isActiveRoute, isGroupActive } from "./main-nav";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        render={
          <Button
            variant="ghost"
            size="icon-lg"
            className="lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>
        }
      />

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex w-[min(20rem,85vw)] flex-col bg-background shadow-xl",
            "transition-transform duration-300 ease-out",
            "data-ending-style:translate-x-full data-starting-style:translate-x-full",
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-border px-5">
            <Dialog.Title className="font-heading text-sm font-semibold">
              Menu
            </Dialog.Title>
            <Dialog.Close
              render={
                <Button variant="ghost" size="icon" aria-label="Close menu">
                  <X className="size-5" />
                </Button>
              }
            />
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-4">
            {/* The group holding the current page starts open. */}
            <Accordion.Root
              multiple
              defaultValue={mainNav
                .filter(isNavGroup)
                .filter((group) => isGroupActive(pathname, group))
                .map((group) => group.label)}
              render={<ul />}
              className="flex flex-col gap-1"
            >
              {mainNav.map((item) =>
                isNavGroup(item) ? (
                  <Accordion.Item
                    key={item.label}
                    value={item.label}
                    render={<li />}
                  >
                    <Accordion.Header render={<div />}>
                      <Accordion.Trigger
                        className={cn(
                          "group flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-left text-base font-medium transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
                          isGroupActive(pathname, item)
                            ? "text-primary"
                            : "text-foreground",
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          aria-hidden="true"
                          className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-panel-open:rotate-180"
                        />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Panel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0">
                      <ul className="mt-1 ml-3 flex flex-col gap-1 border-l border-border pl-2">
                        {item.items.map((link) => (
                          <li key={link.href}>
                            <MobileLink
                              link={link}
                              active={isActiveRoute(pathname, link.href)}
                              onNavigate={() => setOpen(false)}
                              nested
                            />
                          </li>
                        ))}
                      </ul>
                    </Accordion.Panel>
                  </Accordion.Item>
                ) : (
                  <li key={item.href}>
                    <MobileLink
                      link={item}
                      active={isActiveRoute(pathname, item.href)}
                      onNavigate={() => setOpen(false)}
                    />
                  </li>
                ),
              )}
            </Accordion.Root>
          </nav>

          <div className="border-t border-border p-5">
            <ButtonLink href="/join" size="lg" className="w-full">
              Join the Community
            </ButtonLink>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function MobileLink({
  link,
  active,
  onNavigate,
  nested = false,
}: {
  link: NavLink;
  active: boolean;
  onNavigate: () => void;
  nested?: boolean;
}) {
  return (
    <Link
      href={link.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-11 items-center rounded-lg px-3 font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        nested ? "text-sm" : "text-base",
        active ? "bg-accent text-primary" : "text-foreground hover:bg-muted",
      )}
      onClick={onNavigate}
    >
      {link.label}
    </Link>
  );
}
