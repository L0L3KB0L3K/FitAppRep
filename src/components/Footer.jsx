function Footer() {
  return (
    <footer className="w-full bg-[#202533] border-t-2 border-gradient-to-r from-sky-400 via-fuchsia-400 to-lime-300 py-4 text-center">
      <div className="text-sm text-gray-400">
        © {new Date().getFullYear()} FitApp • Created by Maj Oman
        <span className="mx-2">|</span>
        <a
          href="https://github.com/L0L3KB0L3K/FitAppRep"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-400 hover:underline"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
export default Footer;
