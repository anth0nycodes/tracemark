export function Footer() {
  return (
    <div className="mt-auto flex flex-col items-center justify-between gap-4 px-4 py-5 font-medium sm:flex-row sm:py-6 md:px-12">
      <span className="text-muted-foreground text-sm sm:text-base">
        Made with ❤️ by{" "}
        <a
          href="https://github.com/anth0nycodes"
          className="transition hover:opacity-80"
          target="_blank"
          rel="noopener noreferrer"
        >
          anth0nycodes
        </a>
      </span>
      <div className="text-muted-foreground flex gap-4 text-sm sm:text-base">
        <a
          href="mailto:hoanganthony2207@gmail.com"
          className="transition hover:opacity-80"
        >
          Contact
        </a>
        <a
          href="https://github.com/anth0nycodes/tracemark"
          className="transition hover:opacity-80"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
