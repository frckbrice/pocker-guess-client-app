import Image from "next/image";
import { FaCloudDownloadAlt } from "react-icons/fa";
export default function Footer() {
  const footerNavs = [
    {
      name: "Terms",
      onClick: () => { },
    },
    {
      name: "License",
      onClick: () => { },
    },
    {
      name: "Privacy",
      onClick: () => { },
    },
    {
      name: "About us",
      onClick: () => { },
    },
  ];
  return (
    <footer className="pt-10 px-24 bg-themecolor mobile:max-sm:px-2">
      <div className="max-w-screen-xl mx-auto px-24 text-gray-600 md:px-4 mobile:max-sm:w-full">
        <div className="justify-between sm:flex">
          <div className="space-y-6">
            <Image
              src={"/POCKERPLAY-LOGO-white.png"}
              alt=""
              width={200}
              height={100}
            />
            <p className="max-w-md text-slate-400 ">
              PockerPlay is a web-based card game platform that allows you to play various card games with your friends online. Whether you're into poker, blackjack, or any other card game, PockerPlay has got you covered. Join us and start playing today!
            </p>
            <ul className="flex flex-wrap text-slate-300 items-center gap-4 text-sm sm:text-base">
              {footerNavs.map((item, idx) => (
                <li
                  key={idx}
                  className="text-slate-300  hover:text-gray-500 duration-150"
                >
                  <button
                    type="button"
                    onClick={item.onClick}
                    className="bg-transparent border-none p-0 m-0 text-inherit cursor-pointer hover:underline"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <p className="text-orange-500 font-semibold">Get the app</p>
            <div className="flex items-center gap-3 mt-3 sm:block">
              <button type="button" className="text-white border border-white rounded py-1 px-2 flex justify-between items-center gap-3">

                <FaCloudDownloadAlt />
                <span className="text-sm">Download</span>
              </button>
            </div>
          </div>
        </div>
        <div className="mt-10 py-10 border-t md:text-center text-slate-400">
          <p>© 2025 POCKERPLAY Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
