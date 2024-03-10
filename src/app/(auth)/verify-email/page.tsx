import React, { createContext } from "react";
import VerifyEmail from "@/components/VerifyEmail";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const VerifyEmailPage = ({ searchParams }: PageProps) => {
  const token = searchParams.token;
  const toEmail = searchParams.to;
  return (
    <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        {token && typeof token === "string" ? (
          <div>
            <VerifyEmail token={token} />
          </div>
        ) : (
          <div>TOKEN NOT PROVIDED</div>
        )}
      </div>
    </div>
  );
};
export default VerifyEmailPage;
