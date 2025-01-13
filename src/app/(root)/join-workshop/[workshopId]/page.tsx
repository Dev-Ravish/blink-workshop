"use client";

import { WorkshopCard } from "@/components/workshop-card";
import LoadingScreen from "@/components/ui/loading";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Workshop {
    workshopId: string;
    title: string;
    description: string;
    totalSlot: number;
    publicKey: string;
    joinFees: number;
    date: string;
    time: string;
    image: string;
    location: string;
}

export default function JoinWorkshop({
  params,
}: {
  params: { workshopId: string };
}) {
  const { workshopId } = params;

  const [workshopData, setWorkshopData] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkshopData = async () => {
      try {
        console.log("workshopId:", workshopId);
        const response = await fetch(`/api/check/${workshopId}`); 
        if (!response.ok) {
          throw new Error("Workshop not found");
        }
        const data = await response.json();
        if (data.success) {
          setWorkshopData(data.data);
        } else {
          throw new Error(data.message);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshopData();
  }, [workshopId]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF]">
        <p className="text-white text-center">Error: {error}</p>
      </div>
    );
  }

  return (
    <div
      className="flex justify-center items-center min-h-screen relative"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)",
      }}
    >
      {/* Background Image and Overlay */}
      <div className="absolute top-0 left-0 w-full h-full z-10 bg-gradient-to-b from-[#1E3A8A] to-[#1E40AF]">
        <Image
          src="/blink-img-1.png"
          layout="fill"
          alt="alt"
          className="object-cover w-full h-full blur-md"
        />
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-20"
          style={{
            backgroundImage: "url('/noise.png')",
            opacity: 0.8,
            mixBlendMode: "overlay",
          }}
        />
      </div>

      {/* Logo */}
      <Link href="/">
        <div className="absolute top-12 left-12 z-50 max-w-xl">
          <div className="text-left">
            <h1 className="text-white text-2xl font-medium">
              blink{" "}
              <span className="px-2 py-1 bg-gradient-to-r from-[#2563EB] to-[#1E40AF] rounded-md text-slate-200">
                workshop
              </span>
            </h1>
          </div>
        </div>
      </Link>

      {/* Workshop Card */}
      <div className="relative z-30">
        {workshopData ? (
          <WorkshopCard
            workshopId={workshopData.workshopId}
            title={workshopData.title}
            description={workshopData.description}
            totalSlot={workshopData.totalSlot}
            publicKey={workshopData.publicKey}
            image={workshopData.image}
            date={workshopData.date}
            time={workshopData.time}
            location={workshopData.location}
            joinFees={workshopData.joinFees}
          />
        ) : (
          <p className="text-white text-center">Workshop not found</p>
        )}
      </div>
    </div>
  );
}