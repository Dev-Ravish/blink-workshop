"use client";

import LoadingScreen from "@/components/ui/loading";
import { Loader } from "lucide-react";
import React, { useState, useEffect } from "react";
import { FaXTwitter } from "react-icons/fa6";

interface WorkshopFormData {
    organizationName: string;
    email: string;
    image: File | null;
    description: string;
    totalSlot: number;
    publicKey: string;
    date: string;
    time: string;
    location: string;
    joinFees: number;
}

const WorkshopForm: React.FC = () => {
    const [formData, setFormData] = useState<WorkshopFormData>({
        organizationName: "",
        email: "",
        image: null,
        description: "",
        totalSlot: 1,
        publicKey: "",
        date: "",
        time: "",
        location: "",
        joinFees: 0,
    });

    const [, setImageUrl] = useState<string | null>(null);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [, setWorkshopUrl] = useState<string>("");
    const [workshopId, setWorkshopId] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
        setLoading(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    const getMinTime = () => {
        const now = new Date();
        return now.toTimeString().slice(0, 5);
    };

    const handleNext = () => {
        if (step < 4) setStep(step + 1);
    };

    const handlePrev = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleInputChange = (
        e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData({
        ...formData,
        [name as keyof WorkshopFormData]: value,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
        const imageUrl = URL.createObjectURL(file);
        setImageUrl(imageUrl);
        setFormData({
            ...formData,
            image: file,
        });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (step < 2) {
        handleNext();
        return;
        }

        setSubmitting(true);

        const formDataToSend = new FormData();
        for (const key in formData) {
            if (key === "image" && formData[key]) {
                formDataToSend.append("image", formData[key]);
            } else {
                formDataToSend.append(
                key,
                formData[key as keyof WorkshopFormData] as string | Blob
                );
            
            }

            try {
            const response = await fetch("/api/save-workshop", {
                method: "POST",
                body: formDataToSend,
            });

            if (response.ok) {
                const data = await response.json();
                setImageUrl(data.url);
                const workshopId = data.data.workshopId;
                setWorkshopId(workshopId);
                setWorkshopUrl(
                `https://blinkworkshop.xyz/api/actions/join/workshops/${workshopId}`
                );

                setFormData({
                organizationName: "",
                email: "",
                image: null,
                description: "",
                totalSlot: 1,
                publicKey: "",
                date: "",
                time: "",
                location: "",
                joinFees: 0,
                });

                handleNext();
            } else {
                console.error("Error creating workshop:", response.statusText);
            }
            } catch (err) {
            console.error("Failed to submit form:", err);
            } finally {
            setSubmitting(false);
            }
        };
    };

    const copyToClipboard = () => {
        const urlToCopy = `https://blinkworkshop.xyz/join/${workshopId}`;
        navigator.clipboard
        .writeText(urlToCopy)
        .then(() => {
            alert("URL copied to clipboard!");
        })
        .catch((err) => {
            console.error("Failed to copy URL:", err);
        });
    };

    const shareOnTwitter = () => {
        const urlToShare = `https://blinkworkshop.xyz/join/${workshopId}`;
        const textToShare = `Check out this workshop!`;
        const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        textToShare
        )}&url=${encodeURIComponent(urlToShare)}`;

        window.open(twitterShareUrl, "_blank");
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="font-serif min-h-screen bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF] flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none"></div>
        <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-4xl">
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-2">
                Create a Workshop
                </h2>
                <p className="text-[#CBD5E1]">Fill out the form below!</p>
            </div>

            {step === 1 && (
                <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-medium text-[#CBD5E1] mb-2">
                    Organization Name
                    </label>
                    <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 text-white rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:outline-none placeholder:text-[#CBD5E1]"
                    placeholder="Enter organization name"
                    required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#CBD5E1] mb-2">
                    Email
                    </label>
                    <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 text-white rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:outline-none placeholder:text-[#CBD5E1]"
                    placeholder="Enter email"
                    required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#CBD5E1] mb-2">
                    Upload Image
                    </label>
                    <input
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 bg-white/10 text-white rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                    accept="image/*"
                    required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#CBD5E1] mb-2">
                    Description
                    </label>
                    <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 text-white rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:outline-none resize-none placeholder:text-[#CBD5E1]"
                    placeholder="Enter description"
                    required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#CBD5E1] mb-2">
                    Total Slot Available
                    </label>
                    <input
                    type="number"
                    name="totalSlot"
                    value={formData.totalSlot}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 text-white rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:outline-none placeholder:text-[#CBD5E1]"
                    placeholder="Enter slot available"
                    />
                </div>
                </div>
            )}

            {step === 2 && (
                <div className="grid grid-cols-1 gap-6">

                <div>
                    <label className="block text-sm font-medium text-[#CBD5E1] mb-2">
                    Date
                    </label>
                    <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={getMinDate()}
                    className="w-full px-4 py-3 bg-white/10 text-white rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                    required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#CBD5E1] mb-2">
                    Time
                    </label>
                    <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    min={
                        formData.date === getMinDate() ? getMinTime() : undefined
                    }
                    className="w-full px-4 py-3 bg-white/10 text-white rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                    required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#CBD5E1] mb-2">
                    Location
                    </label>
                    <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 text-white rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:outline-none placeholder:text-[#CBD5E1]"
                    required
                    placeholder="Enter Workshop Location"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#CBD5E1] mb-2">
                    Join Fees (in SOL)
                    </label>
                    <input
                    type="number"
                    name="joinFees"
                    value={formData.joinFees}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 text-white rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                    required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#CBD5E1] mb-2">
                    Solana PublicKey
                    </label>
                    <input
                    type="text"
                    name="publicKey"
                    value={formData.publicKey}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 text-white rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:outline-none placeholder:text-[#CBD5E1]"
                    required
                    placeholder="Enter Solana PublicKey"
                    />
                </div>
                </div>
            )}


            {step === 3 && (
                <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-medium text-[#CBD5E1] mb-2">
                    Workshop URL
                    </label>
                    <input
                    type="text"
                    value={`https://blinkworkshop.xyz/join/${workshopId}`}
                    readOnly
                    className="w-full px-4 py-3 bg-white/10 text-white rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                    />
                </div>
                <div className="flex justify-between">
                    <button
                    type="button"
                    onClick={copyToClipboard}
                    className="bg-[#2563EB] text-white py-2 px-4 rounded-lg hover:bg-[#1E40AF] transition-colors"
                    >
                    Copy URL
                    </button>
                    <button
                    type="button"
                    onClick={shareOnTwitter}
                    className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                    <FaXTwitter className="h-6 w-6" />
                    </button>
                </div>
                </div>
            )}

            <div className="flex justify-between mt-8">
                {step > 1 && (
                <button
                    type="button"
                    onClick={handlePrev}
                    className="bg-[#1E40AF] text-white py-2 px-4 rounded-lg hover:bg-[#1E3A8A] transition-colors"
                >
                    Prev
                </button>
                )}
                {step < 3 && (
                <button
                    type="submit"
                    className="bg-[#2563EB] text-white py-2 px-4 rounded-lg hover:bg-[#1E40AF] transition-colors flex items-center justify-center"
                >
                    {submitting ? <Loader className="animate-spin" /> : "Next"}
                </button>
                )}
            </div>
            </form>
        </div>
        </div>
    );
    };


    export default WorkshopForm;