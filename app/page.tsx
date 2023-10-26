"use client";

import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/dashboard");
  }, []);

  return (
    <main className="w-full h-screen flex items-center justify-center">
      <CircularProgress />
    </main>
  );
}
