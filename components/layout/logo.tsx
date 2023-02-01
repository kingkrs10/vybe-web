export default function Logo() {
  return (
    <a href="/">
      <div className="relative">
        <div className="z-40 text-3xl font-bold tracking-[8px]">
          <p className="text-3xl font-bold tracking-[8px]">
            <span className="text-white">V</span>YBE
          </p>
        </div>
        <div className="absolute -left-[6px] top-[2px] -z-10 h-8 w-8 rounded-sm bg-purple-800" />
      </div>
    </a>
  );
}
