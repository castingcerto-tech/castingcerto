"use client";

const clientes = [
  { nome: "Samsung",       logo: "/logos/samsung.png" },
  { nome: "Sicredi",       logo: "/logos/Sicredi.png" },
  { nome: "Netshoes",      logo: "/logos/netshoes.png" },
  { nome: "Mercado Livre", logo: "/logos/mercado livre.png" },
  { nome: "Google",        logo: "/logos/google.png" },
  { nome: "Adidas",        logo: "/logos/Adidas.png" },
  { nome: "Disney+",       logo: "/logos/Disney.png" },
  { nome: "Nestle",        logo: "/logos/Nestle.png" },
  { nome: "FTW",           logo: "/logos/ftw.png" },
  { nome: "Metodo CIS",    logo: "/logos/cis.png" },
  { nome: "Mix FM",        logo: "/logos/radio mix.png" },
];

const doubled = [...clientes, ...clientes];

export default function LogoCarousel() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-dark-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-dark-900 to-transparent z-10 pointer-events-none" />

      <div className="flex animate-marquee" style={{ width: "max-content" }}>
        {doubled.map(({ nome, logo }, i) => (
          <div key={i} className="flex items-center justify-center mx-5 shrink-0">
            <div className="flex items-center justify-center bg-cream rounded-xl px-5 py-2.5 h-14 transition-all duration-300 hover:scale-105 hover:shadow-md">
              <img
                src={logo}
                alt={nome}
                className="h-7 w-auto max-w-[110px] object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
