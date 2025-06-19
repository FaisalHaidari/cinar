import Link from "next/link";

export default function ServicesSection() {
  const services = [
    { icon: '🩺', title: 'Cerrahi Hizmetler', path: '/services/cerrahi-hizmetler' },
    { icon: '🦴', title: 'Ortopedi', path: '/services/ortopedi' },
    { icon: '💊', title: 'Dahiliye', path: '/services/dahiliye' },
    { icon: '📈', title: 'Mrg', path: '/services/mrg' },
    { icon: '💉', title: 'Endoskopi', path: '/services/endoskopi' },
    { icon: '🩹', title: 'Yoğun Bakım', path: '/services/yogun-bakim' },
  ];
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-8">Hizmetler</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {services.map((service, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
            <div className="mb-4">
              <span className="inline-block w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-3xl text-blue-700">
                {service.icon}
              </span>
            </div>
            <div className="text-xl font-bold text-blue-900 mb-2">{service.title}</div>
            <Link href={service.path} className="w-full">
              <button className="mt-4 bg-orange-500 rounded-full text-white px-8 py-2 font-bold text-lg hover:bg-orange-600 transition-colors w-full">
                DETAY
              </button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
} 