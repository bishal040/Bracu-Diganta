const fs = require('fs');

const links = [
  "https://i.ibb.co.com/8DKLyHWS/Whats-App-Image-2026-06-17-at-01-47-35-1.jpg",
  "https://i.ibb.co.com/WvJvYjYj/Whats-App-Image-2026-06-17-at-01-47-35-2.jpg",
  "https://i.ibb.co.com/prbVZ8sb/Whats-App-Image-2026-06-17-at-01-47-35.jpg",
  "https://i.ibb.co.com/KxThc0hN/Whats-App-Image-2026-06-17-at-01-47-36-1.jpg",
  "https://i.ibb.co.com/bj7QSj2S/Whats-App-Image-2026-06-17-at-01-47-36-2.jpg",
  "https://i.ibb.co.com/Gvr6YZ01/Whats-App-Image-2026-06-17-at-01-47-36.jpg",
  "https://i.ibb.co.com/ynNs3gYr/Whats-App-Image-2026-06-17-at-01-47-37-1.jpg",
  "https://i.ibb.co.com/7d2MTKMm/Whats-App-Image-2026-06-17-at-01-47-37-2.jpg",
  "https://i.ibb.co.com/Kcbt4Y4t/Whats-App-Image-2026-06-17-at-01-47-37.jpg",
  "https://i.ibb.co.com/JWZfrVXM/Whats-App-Image-2026-06-17-at-01-47-38-1.jpg",
  "https://i.ibb.co.com/TD2hyM5k/Whats-App-Image-2026-06-17-at-01-47-38-2.jpg",
  "https://i.ibb.co.com/qLyLQJ0Z/Whats-App-Image-2026-06-17-at-01-47-38.jpg",
  "https://i.ibb.co.com/rKPR3N1h/Whats-App-Image-2026-06-17-at-01-47-39-1.jpg",
  "https://i.ibb.co.com/C5PX8GNn/Whats-App-Image-2026-06-17-at-01-47-39-2.jpg",
  "https://i.ibb.co.com/HD2KZ9Ns/Whats-App-Image-2026-06-17-at-01-47-40-1.jpg",
  "https://i.ibb.co.com/n8PjhYjt/Whats-App-Image-2026-06-17-at-01-47-40.jpg",
  "https://i.ibb.co.com/9k2RzPY7/Whats-App-Image-2026-06-17-at-01-47-41-1.jpg",
  "https://i.ibb.co.com/LzP2f9TQ/Whats-App-Image-2026-06-17-at-01-47-41-2.jpg",
  "https://i.ibb.co.com/HDBTyNRt/Whats-App-Image-2026-06-17-at-01-47-41.jpg",
  "https://i.ibb.co.com/Ndzxfmbc/Whats-App-Image-2026-06-17-at-01-47-42-1.jpg",
  "https://i.ibb.co.com/9QjdGvd/Whats-App-Image-2026-06-17-at-01-47-42-2.jpg",
  "https://i.ibb.co.com/DfM7GPL5/Whats-App-Image-2026-06-17-at-01-47-43-1.jpg",
  "https://i.ibb.co.com/jk1DyJtQ/Whats-App-Image-2026-06-17-at-01-47-43-2.jpg",
  "https://i.ibb.co.com/wh0nz9mJ/Whats-App-Image-2026-06-17-at-01-47-44-2.jpg",
  "https://i.ibb.co.com/qYfTDFjq/Whats-App-Image-2026-06-17-at-01-47-45.jpg",
  "https://i.ibb.co.com/bVWCrBB/Whats-App-Image-2026-06-17-at-01-47-46.jpg",
  "https://i.ibb.co.com/zW1YgbmM/Whats-App-Image-2026-06-17-at-01-47-47-2.jpg",
  "https://i.ibb.co.com/0156Xkd/Whats-App-Image-2026-06-17-at-01-47-47.jpg",
  "https://i.ibb.co.com/S4dZ9grx/Whats-App-Image-2026-06-17-at-01-47-48-1.jpg",
  "https://i.ibb.co.com/W42n1dsP/Whats-App-Image-2026-06-17-at-01-47-48-2.jpg",
  "https://i.ibb.co.com/35WZ6czz/Whats-App-Image-2026-06-17-at-01-47-49-1.jpg",
  "https://i.ibb.co.com/20dfZ4gZ/Whats-App-Image-2026-06-17-at-01-47-49.jpg",
  "https://i.ibb.co.com/k2t4Jp36/Whats-App-Image-2026-06-17-at-01-47-50-2.jpg",
  "https://i.ibb.co.com/fYzBb6VQ/Whats-App-Image-2026-06-17-at-01-47-50.jpg",
  "https://i.ibb.co.com/7NpXkRxq/Whats-App-Image-2026-06-17-at-01-47-51.jpg",
  "https://i.ibb.co.com/20jJtBRY/Whats-App-Image-2026-06-17-at-01-47-52-1.jpg",
  "https://i.ibb.co.com/SXWFygdT/Whats-App-Image-2026-06-17-at-01-47-52.jpg",
  "https://i.ibb.co.com/Txyrz8CK/Whats-App-Image-2026-06-17-at-01-47-53-1.jpg",
  "https://i.ibb.co.com/xnXnV6t/Whats-App-Image-2026-06-17-at-01-47-53-2.jpg"
];

let fileContent = fs.readFileSync('src/components/pages/NewsTeknofest2026Page.tsx', 'utf8');

if (!fileContent.includes('const ALL_GALLERY_IMAGES')) {
  fileContent = fileContent.replace(
    'export const NewsTeknofest2026Page',
    `const ALL_GALLERY_IMAGES = ${JSON.stringify(links, null, 2)};\n\nexport const NewsTeknofest2026Page`
  );
}

// Replace the Hero image to a real one
fileContent = fileContent.replace(
  'https://i.ibb.co.com/FNmvLvB/IMG-4654.jpg',
  links[16]
);

// Add the group images block
const splitBlock = `
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-12 mb-12">
                <div>
                  <h3 className="font-orbitron text-2xl font-bold uppercase text-slate-900 mb-6">Mission Overview — SIGMA</h3>
                  <p className="leading-relaxed">
                    The TURKSAT Model Satellite Competition (SIGMA) focuses on designing a two-part model satellite system (Container and Science Payload) capable of stable, controlled, and autonomous landing using an active guidance mechanism.
                  </p>
                </div>
                <div className="rounded-3xl overflow-hidden shadow-2xl relative group h-64 md:h-80 w-full transform transition-all duration-500 hover:-translate-y-2">
                  <img src="${links[19]}" alt="Mission Objective" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay group-hover:bg-transparent transition-colors duration-500" />
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-blue-900 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    SIGMA Prototype
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-12 mb-12">
                <div className="order-2 md:order-1 rounded-3xl overflow-hidden shadow-2xl relative group h-64 md:h-80 w-full transform transition-all duration-500 hover:-translate-y-2">
                  <img src="${links[23]}" alt="Engineering Innovation" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay group-hover:bg-transparent transition-colors duration-500" />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-cyan-900 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Avionics Bay Testing
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <h3 className="font-orbitron text-2xl font-bold uppercase text-slate-900 mb-6">Mission Profile</h3>
                  <p className="leading-relaxed mb-4">
                    After release from 1500–1800 m altitude, the Science Payload separates from the Container at 1000 m and descends safely using a propulsion system while continuously transmitting telemetry and live video to the ground station.
                  </p>
                  <p className="leading-relaxed">
                    Throughout the mission, all data are recorded onboard and at the ground station. After landing, the payload continues transmitting for 10 seconds before automatically stopping and activating a buzzer for recovery.
                  </p>
                </div>
              </div>
`;

// remove old blocks
fileContent = fileContent.replace(
  /<h3 className="font-orbitron text-2xl font-bold uppercase text-slate-900 mt-12 mb-6">Mission Overview — SIGMA<\/h3>\s*<p className="leading-relaxed mb-6">\s*The TURKSAT Model Satellite Competition \(SIGMA\) focuses on designing a two-part model satellite system \(Container and Science Payload\) capable of stable, controlled, and autonomous landing using an active guidance mechanism\.\s*<\/p>\s*<h3 className="font-orbitron text-2xl font-bold uppercase text-slate-900 mt-12 mb-6">Mission Profile<\/h3>\s*<p className="leading-relaxed mb-6">\s*After release from 1500–1800 m altitude, the Science Payload separates from the Container at 1000 m and descends safely using a propulsion system while continuously transmitting telemetry and live video to the ground station\.\s*<\/p>\s*<p className="leading-relaxed mb-6">\s*Throughout the mission, all data are recorded onboard and at the ground station\. After landing, the payload continues transmitting for 10 seconds before automatically stopping and activating a buzzer for recovery\.\s*<\/p>/g,
  splitBlock
);

// Add marquee at the bottom
const marqueeBlock = `
        {/* Mission Archives Scrolling Gallery */}
        <div className="mt-24 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 reveal-anim">
            <div>
              <h3 className="font-orbitron text-3xl md:text-5xl font-black uppercase text-slate-900 tracking-tighter">
                Mission Archives
              </h3>
              <p className="text-slate-500 font-mono text-sm tracking-widest uppercase mt-4">
                Visual Documentation — SIGMA
              </p>
            </div>
          </div>

          <div className="relative w-full overflow-hidden flex flex-col gap-4 py-8 reveal-anim">
            {/* Fade edges */}
            <div className="absolute inset-y-0 left-0 w-12 md:w-32 bg-gradient-to-r from-[#eef2f5] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-12 md:w-32 bg-gradient-to-l from-[#eef2f5] to-transparent z-10 pointer-events-none" />
            
            {/* First Row (Left to Right) */}
            <div className="flex w-max animate-[marquee_40s_linear_infinite]">
              {[1, 2].map((set) => (
                <div key={set} className="flex gap-4 px-2 shrink-0">
                  {ALL_GALLERY_IMAGES.slice(0, 19).map((src, i) => (
                    <div key={i} className="w-48 h-32 md:w-64 md:h-48 rounded-2xl overflow-hidden shrink-0 group relative shadow-md">
                      <img src={src} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-blue-900/40 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Second Row (Right to Left) */}
            <div className="flex w-max animate-[marquee-reverse_45s_linear_infinite]">
              {[1, 2].map((set) => (
                <div key={set} className="flex gap-4 px-2 shrink-0">
                  {ALL_GALLERY_IMAGES.slice(19).map((src, i) => (
                    <div key={i} className="w-48 h-32 md:w-72 md:h-56 rounded-2xl overflow-hidden shrink-0 group relative shadow-md">
                      <img src={src} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-cyan-900/40 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
`;

// Insert marquee right before the closing div of the page content
fileContent = fileContent.replace(
  /      <\/div>\n    <\/div>\n  \);\n};\n/g,
  `${marqueeBlock}\n      </div>\n    </div>\n  );\n};\n`
);

fs.writeFileSync('src/components/pages/NewsTeknofest2026Page.tsx', fileContent, 'utf8');
