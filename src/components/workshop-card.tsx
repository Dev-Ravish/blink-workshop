import {
  BadgeDollarSign,
  BetweenVerticalStart,
  Clock,
  LocateIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface WorkshopCardProps {
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

export function WorkshopCard({
  workshopId,
  title,
  description,
  totalSlot,
  joinFees,
  date,
  time,
  image,
  location,
}: WorkshopCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 hover:shadow-[#2563EB]/20 transition-shadow duration-300">
      {/* Card Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-[#CBD5E1]">{description}</p>
      </div>

      {/* Workshop Image */}
      <div className="h-[200px] rounded-lg overflow-hidden mb-6">
        <Image
          src={image}
          alt={title}
          width={400}
          height={200}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Workshop Details */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center space-x-3">
          <Clock className="text-[#2563EB] h-5 w-5" />
          <span className="text-[#CBD5E1]">
            {date} / {time}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <LocateIcon className="text-[#2563EB] h-5 w-5" />
          <span className="text-[#CBD5E1]">{location}</span>
        </div>
        <div className="flex items-center space-x-3">
          <BetweenVerticalStart className="text-[#2563EB] h-5 w-5" />
          <span className="text-[#CBD5E1]">Available Slots: {totalSlot}</span>
        </div>
        <div className="flex items-center space-x-3">
          <BadgeDollarSign className="text-[#2563EB] h-5 w-5" />
          <span className="text-[#CBD5E1]">Join Fee: {joinFees} SOL</span>
        </div>
      </div>

      {/* Custom Join Button */}
      <Link
        href={`https://dial.to/?action=solana-action%3Ahttps%3A%2F%2Fblinkworkshop.tech%2Fapi%2Factions%2Fjoin%2F${workshopId}&cluster=devnet`}
      >
        <div className="w-full bg-[#2563EB] hover:bg-[#1E40AF] text-white py-3 rounded-lg text-center font-semibold transition-colors duration-300 cursor-pointer">
          Join Now
        </div>
      </Link>
    </div>
  );
}