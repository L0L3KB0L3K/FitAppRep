function Footer() {
  return (
    <footer className="w-full bg-[#202533] border-t border-gray-800/70 py-4 text-center mt-12">
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
