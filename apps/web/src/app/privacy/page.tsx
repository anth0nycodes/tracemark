import type { ReactNode } from "react";
import type { Metadata } from "next";
import { TrapezoidGuy } from "@/components/decor/characters";

export const metadata: Metadata = {
  title: "Privacy Policy | Tracemark",
  description:
    "Tracemark doesn't collect, store, or send your data. The only thing it remembers is your theme.",
};

const LAST_UPDATED = "November 9, 2026";
const CONTACT_EMAIL = "hoanganthony2207@gmail.com";

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-secondary text-xl font-medium md:text-2xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Code({ children }: { children: ReactNode }) {
  return (
    <code className="bg-secondary-background rounded-md px-1.5 py-0.5 text-sm">
      {children}
    </code>
  );
}

const PERMISSIONS = [
  {
    name: "activeTab",
    reason:
      "Lets Tracemark open on the tab you're on, only after you click its toolbar icon. It has no access to your other tabs.",
  },
  {
    name: "scripting",
    reason:
      "Adds the drawing overlay and toolbar to that tab when you open Tracemark.",
  },
  {
    name: "storage",
    reason: "Remembers your light or dark theme. Nothing else is stored.",
  },
];

export default function PrivacyPolicy() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-4 py-12 sm:px-6 md:py-20">
      <header className="relative flex flex-col gap-3">
        <h1 className="font-secondary text-3xl font-medium md:text-6xl">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground">Last updated {LAST_UPDATED}</p>
        {/* Nothing to see here */}
        <TrapezoidGuy
          aria-hidden
          lookX={-4}
          className="pointer-events-none absolute right-0 bottom-0 w-14 sm:w-28"
        />
      </header>

      <div className="bg-secondary-background flex flex-col gap-2 rounded-2xl p-5 md:p-6">
        <p className="font-secondary text-lg font-medium md:text-xl">
          The short version
        </p>
        <p>
          Tracemark doesn&apos;t collect, save, or send any of your data. There
          are no accounts, no analytics, and no tracking in the extension. Your
          drawings and screenshots never leave your browser. The only thing it
          remembers is whether you picked the light or dark theme.
        </p>
      </div>

      <PolicySection title="What Tracemark collects">
        <p>
          Nothing. The extension has no servers to send data to, and it makes no
          network requests. It doesn&apos;t read the content of the pages you
          visit, and it doesn&apos;t know which sites you use it on.
        </p>
      </PolicySection>

      <PolicySection title="Your drawings and screenshots">
        <p>
          What you draw exists only in the tab, and only while the overlay is
          open. Closing Tracemark or reloading the page clears it, and none of
          it is saved anywhere.
        </p>
        <p>
          Tracemark captures the visible part of the tab only when you choose
          Copy or Export. The image goes straight to your clipboard or your
          downloads folder. It is never uploaded.
        </p>
      </PolicySection>

      <PolicySection title="The one thing that's saved: your theme">
        <p>
          If you switch between light and dark mode, Tracemark remembers your
          choice in <Code>chrome.storage.local</Code>, Chrome&apos;s built-in
          storage for extensions. It&apos;s a single setting, kept on your
          device. It isn&apos;t synced to your Google account or sent anywhere,
          and removing the extension deletes it.
        </p>
      </PolicySection>

      <PolicySection title="Permissions, and why they're needed">
        <ul className="flex flex-col gap-3">
          {PERMISSIONS.map((permission) => (
            <li
              key={permission.name}
              className="flex flex-col items-start gap-1"
            >
              <Code>{permission.name}</Code>
              <span className="text-muted-foreground">{permission.reason}</span>
            </li>
          ))}
        </ul>
      </PolicySection>

      <PolicySection title="This website">
        <p>
          tracemark.fun uses Vercel Web Analytics to count page visits. It
          collects anonymous, aggregated statistics, doesn&apos;t use cookies,
          and has nothing to do with the extension. The Add to Chrome buttons
          take you to the Chrome Web Store, which is covered by Google&apos;s
          own privacy policy.
        </p>
      </PolicySection>

      <PolicySection title="Changes to this policy">
        <p>
          If anything here changes, this page will be updated along with the
          date at the top.
        </p>
      </PolicySection>

      <PolicySection title="Contact">
        <p>
          Questions about privacy? Email{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-primary hover:text-primary-hover underline underline-offset-2"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </PolicySection>
    </main>
  );
}
