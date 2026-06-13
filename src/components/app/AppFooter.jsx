const APP_REPOSITORY_URL = 'https://github.com/lumachroma/leanlog/'
const GITHUB_PROFILE_URL = 'https://github.com/lumachroma/'
const LINKEDIN_PROFILE_URL = 'https://www.linkedin.com/in/nazrul-hisham/'

const socialLinkClassName =
  'inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:h-8 sm:w-8'

function LinkedInIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="currentColor"
    >
      <path d="M4.98 3.5A2.48 2.48 0 1 0 5 8.46 2.48 2.48 0 0 0 4.98 3.5ZM3 9.75h3.96V21H3V9.75Zm7.13 0H14v1.54h.06c.54-1.03 1.87-2.11 3.86-2.11 4.13 0 4.89 2.72 4.89 6.25V21h-3.96v-4.97c0-1.19-.02-2.72-1.66-2.72-1.66 0-1.92 1.3-1.92 2.64V21h-3.96V9.75Z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="currentColor"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12A11.5 11.5 0 0 0 8.36 22.9c.58.1.79-.25.79-.56v-2.15c-3.18.69-3.86-1.35-3.86-1.35-.52-1.31-1.27-1.66-1.27-1.66-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.02 1.75 2.68 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.54-.29-5.21-1.27-5.21-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.47.11-3.07 0 0 .96-.31 3.15 1.17a10.96 10.96 0 0 1 5.74 0c2.18-1.48 3.14-1.17 3.14-1.17.62 1.6.23 2.78.12 3.07.73.8 1.18 1.82 1.18 3.07 0 4.4-2.67 5.37-5.22 5.66.41.35.77 1.03.77 2.08v3.08c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}

function AppFooter() {
  const currentYear = new Date().getFullYear()
  const logoSrc = `${import.meta.env.BASE_URL}logo_transparent.svg`

  return (
    <footer className="mt-auto border-t border-border/80 pt-4 sm:pt-5" aria-label="Footer">
      <div className="flex items-center justify-center gap-1.5 px-1 text-center text-sm text-muted-foreground sm:gap-4">
        <a
          href={APP_REPOSITORY_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="LeanLog repository"
          className="group inline-flex items-center gap-1.5 rounded-[1.2rem] px-1 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:gap-2 sm:px-1.5"
        >
          <img
            src={logoSrc}
            alt="LeanLog footer logo"
            className="h-5 w-5 grayscale opacity-80 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          />
          <p className="text-sm font-medium tracking-[-0.04em] text-foreground sm:text-lg">
            LeanLog
          </p>
        </a>

        <p className="shrink-0 whitespace-nowrap text-[0.78rem] leading-6 sm:text-sm">
          &copy; {currentYear} Lumachroma Ent.
        </p>

        <a
          href={LINKEDIN_PROFILE_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          className={socialLinkClassName}
        >
          <LinkedInIcon />
        </a>
        <a
          href={GITHUB_PROFILE_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className={socialLinkClassName}
        >
          <GitHubIcon />
        </a>
      </div>
    </footer>
  )
}

export { AppFooter }