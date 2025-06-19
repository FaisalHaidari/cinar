"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Hero() {
    const router = useRouter();

    useEffect(() => {
        localStorage.removeItem("token");
    }, []);

    return (
        <section className="flex flex-col md:flex-row items-center justify-center gap-12 py-12 px-4 max-w-6xl mx-auto">
            {}
            <div className="flex-1 flex justify-center">
                <div className="rounded-2xl shadow-lg overflow-hidden bg-white">
                    <Image src="/vetpet.png" alt="Çınar Pet Veteriner Kliniği" width={420} height={320} className="object-cover w-full h-auto" />
                </div>
            </div>
            {}
            <div className="flex-1 flex flex-col items-start justify-center max-w-xl">
                <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-6 leading-tight">Çınar Pet Veteriner Kliniği</h1>
                <p className="text-gray-500 text-lg mb-8">
                    Çınar Pet Veteriner Kliniği, evcil hayvanlarınızın sağlığına ve mutluluğuna değer katan, modern yaklaşımıyla öne çıkan bir veteriner sağlık merkezidir. 2022 yılında kurulan kliniğimiz, deneyimli veteriner hekimlerimiz ve teknolojik altyapımızla, minik dostlarınıza güvenilir, bireysel ve özenli hizmet sunmak üzere faaliyet göstermektedir. Her türden evcil hayvan için sunduğumuz geniş kapsamlı veterinerlik çözümleriyle, onların yaşam kalitesini en üst seviyeye taşımayı hedefliyoruz.
                </p>
                <Link href="/about">
                    <button className="border-0 bg-orange-500 rounded-full text-white px-8 py-2 font-bold text-lg hover:bg-orange-600 transition-colors">
                        DEVAMINI OKU
                    </button>
                </Link>
            </div>
        </section>
    );
}