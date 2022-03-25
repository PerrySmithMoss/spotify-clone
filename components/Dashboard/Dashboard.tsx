import { ChevronDownIcon } from "@heroicons/react/solid";
import { signOut, useSession } from "next-auth/react";
import React from "react";

interface DashboardProps {}

export const Dashboard: React.FC<DashboardProps> = ({}) => {
  const { data: session } = useSession();

  return (
    <div>
      <header className="absolute top-5 right-8">
        <div
          onClick={() => signOut()}
          className="flex items-center bg-spotify-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full pr-2"
        >
          <img
            className="rounded-full w-8 h-8 p-1"
            src={session?.user?.image}
            alt="Users Profile Picture"
          />
          <h2 className="truncate w-32 text-white">{session?.user?.name}</h2>
          <ChevronDownIcon className="h-5 w-5 text-white" />
        </div>
      </header>
      <div>
        <h1>Good morning</h1>
      </div>
    </div>
  );
};
