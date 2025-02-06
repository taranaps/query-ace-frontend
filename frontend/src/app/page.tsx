"use client";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const Home = () => {
  const { token, user } = useAuth();

  useEffect(() => {
    if (!token || !user) {
      redirect("/pages/login");
    } else {
      redirect("/pages/dashboard");
    }
  }, [token, user]);

  return null;
};

export default Home;
