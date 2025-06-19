export default function Footer() {
  return (
    <footer className="border-t mt-8 pt-4 pb-2 bg-white">
      <div className="max-w-4xl mx-auto px-2 flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
        <div className="flex items-center gap-1 text-gray-500 text-base mb-2 md:mb-0">
          <span className="text-orange-500 text-lg">📍</span>
          <span>
            BARIŞ, Adalet, Karadeniz Cd. NO:59/13<br/>
            SİTESİ B BLOK, 55060 İlkadım/Samsun
          </span>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-base mb-2 md:mb-0">
          <span className="text-orange-500 text-lg">📞</span>
          <span>0 505 705 82 38</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-base">
          <span className="text-orange-500 text-lg">🩺</span>
          <span>Dilara Bayır Çınar - Ahmet Arda Çınar</span>
        </div>
      </div>
      <div className="mt-4 border-t pt-2 text-center text-gray-400 text-xs">
        © {new Date().getFullYear()} Çınar Pet Veteriner Kliniği. Sevgiyle ve özenle hazırlanmıştır.
      </div>
    </footer>
  );
} 