function Footer() {
  return (
    <footer className="border-t border-slate-800 py-6 text-center text-slate-400">
      © {new Date().getFullYear()} SkillForge AI.
      Built with React + TypeScript.
    </footer>
  );
}

export default Footer;