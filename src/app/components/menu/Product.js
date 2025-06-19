export default function Product() {
    return (
        <div className="bg-gray-200 p-4 rounded-lg text-center hover:bg-white hover:shadow-md hover:shadow-black/25 transition-all w-[280px]">
            <div className="text-center">
                <img 
                    src="/ekmekarasi.jpeg" 
                    className="h-32 w-32 object-cover rounded-lg mx-auto" 
                    alt="ekmekarasi" 
                />
            </div>
            <h4 className="font-semibold text-lg my-2">Ekmek Arasi</h4>
            <p className="text-gray-500 text-sm line-clamp-2 h-10">Ankara Kavurma, Sogan, Domates, Kikek, Acibiber</p>
            <button className="mt-3 bg-orange-500 text-white rounded-full px-6 py-1.5 text-sm hover:bg-orange-600 transition-colors">
                Sepete Ekle 340 ₺
            </button>
        </div>
    );
}