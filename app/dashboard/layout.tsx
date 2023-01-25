import Image from "next/image";
import Providers from "../providers";
import Menu from "../../components/layout/menu";
import Sidebar from "../../components/layout/sidebar";
import GoogleButton from "../../components/buttons/google-button";
// import LoginImg from "../public/login.jpeg";
// import { unstable_getServerSession } from "next-auth/next";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

// import "../../styles/dist.css";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // console.log(params);
  const session = await getSession();
  return (
    <>
      {/* {!session && {
        redirect("/login");
      }} */}
      {session && (
        <div>
          <Sidebar />
          <div className="md:pl-64">
            <Menu />
            <div className="mx-auto flex max-w-4xl flex-col md:px-8 xl:px-0">
              <div className="px-4 py-4">{children}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
