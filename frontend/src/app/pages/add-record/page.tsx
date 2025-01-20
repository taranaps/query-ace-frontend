"use client";
import React from "react";
import NavigationTabs from "@/app/components/navigation-tabs/NavigationTabs";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AddRecordPage = () => {

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.status === "INACTIVE") {
      router.push("/pages/login");
    }
  }, [user, router]);

  return (
    <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
      <NavigationTabs />
    </div>
  );
};

export default AddRecordPage;
