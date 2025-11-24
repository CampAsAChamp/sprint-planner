import GitHubLogo from './GitHubLogo'

export default function Footer() {
  return (
    <footer className="relative mt-8 mb-4 text-center text-sm text-gray-600 dark:text-gray-400">
      <div className="absolute bottom-0 right-4">
        <GitHubLogo />
      </div>
      Created by{' '}
      <a
        href="https://github.com/CampAsAChamp"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
      >
        Nick Schneider
      </a>
    </footer>
  )
}

