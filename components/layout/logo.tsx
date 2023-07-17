import Link from "next/link";

export default function Logo(props: any) {
  return (
    <div className="relative">
      <div className="z-40 text-3xl font-bold tracking-[8px]">
        {/* <Link href="/"> */}
        <p className="text-3xl font-bold tracking-[8px]">
          <span className="text-white">V</span>
          {props.white === true ? (
            <span className="text-white">YBE</span>
          ) : (
            "YBE"
          )}
        </p>
        {/* </Link> */}
      </div>
      <div className="absolute -left-[6px] top-[2px] -z-10 h-8 w-8 rounded-sm bg-purple-800" />
    </div>
  );
}
