// OTO SANAYİ FORUMU - STATİK & YARDIMCI VERİLER

const APP_DATA = {
  brands: [
    // Türkiye'de En Çok Tercih Edilen Popüler Markalar (popular: true)
    { id: 'fiat', name: 'Fiat', logo: 'FIAT', logoUrl: '/img/brands/fiat.png', popular: true, popularModels: ['Egea', 'Doblo', 'Fiorino', 'Linea', 'Punto', 'Panda', '500', 'Albea', 'Palio', 'Uno', 'Ducato'] },
    { id: 'renault', name: 'Renault', logo: 'RN', logoUrl: '/img/brands/renault.png', popular: true, popularModels: ['Clio', 'Megane', 'Fluence', 'Symbol', 'Captur', 'Kadjar', 'Austral', 'Talisman', 'Duster', 'Kangoo', 'Master', 'Trafic'] },
    { id: 'volkswagen', name: 'Volkswagen', logo: 'VW', logoUrl: '/img/brands/volkswagen.png', popular: true, popularModels: ['Golf', 'Passat', 'Polo', 'Tiguan', 'Jetta', 'Caddy', 'Transporter', 'Crafter', 'T-Roc', 'Taigo', 'Arteon', 'Touareg', 'Amarok'] },
    { id: 'ford', name: 'Ford', logo: 'FORD', logoUrl: '/img/brands/ford.png', popular: true, popularModels: ['Focus', 'Fiesta', 'Courier', 'Transit', 'Tourneo Connect', 'Mondeo', 'Kuga', 'Puma', 'Ranger', 'Custom'] },
    { id: 'toyota', name: 'Toyota', logo: 'TOYOTA', logoUrl: '/img/brands/toyota.png', popular: true, popularModels: ['Corolla', 'Yaris', 'C-HR', 'RAV4', 'Auris', 'Hilux', 'Proace', 'Avensis', 'Camry', 'Land Cruiser'] },
    { id: 'opel', name: 'Opel', logo: 'OPEL', logoUrl: '/img/brands/opel.png', popular: true, popularModels: ['Astra', 'Corsa', 'Insignia', 'Mokka', 'Crossland', 'Grandland', 'Vectra', 'Combo', 'Zafira'] },
    { id: 'peugeot', name: 'Peugeot', logo: 'PEUGEOT', logoUrl: '/img/brands/peugeot.png', popular: true, popularModels: ['208', '308', '3008', '2008', '508', '408', 'Partner', 'Rifter', '206', '207', 'Boxer'] },
    { id: 'hyundai', name: 'Hyundai', logo: 'HYUNDAI', logoUrl: '/img/brands/hyundai.png', popular: true, popularModels: ['i20', 'i10', 'i30', 'Tucson', 'Bayon', 'Elantra', 'Accent Blue', 'Accent Era', 'Kona', 'Santa Fe', 'H-100'] },
    { id: 'honda', name: 'Honda', logo: 'HONDA', logoUrl: '/img/brands/honda.png', popular: true, popularModels: ['Civic', 'City', 'Jazz', 'CR-V', 'HR-V', 'Accord'] },
    { id: 'bmw', name: 'BMW', logo: 'BMW', logoUrl: '/img/brands/bmw.png', popular: true, popularModels: ['3 Serisi (F30/G20)', '5 Serisi (F10/G30)', '1 Serisi', '2 Serisi Gran Coupe', '4 Serisi', 'X1', 'X3', 'X5', '7 Serisi', 'i4'] },
    { id: 'mercedes', name: 'Mercedes-Benz', logo: 'MB', logoUrl: '/img/brands/mercedes.png', popular: true, popularModels: ['C Serisi (W205/W206)', 'E Serisi (W213/W214)', 'A Serisi', 'CLA', 'GLC', 'S Serisi', 'GLA', 'GLB', 'Vito', 'Sprinter'] },
    { id: 'audi', name: 'Audi', logo: 'AUDI', logoUrl: '/img/brands/audi.png', popular: true, popularModels: ['A3', 'A4', 'A5', 'A6', 'Q2', 'Q3', 'Q5', 'Q7', 'A1', 'TT', 'e-tron'] },
    { id: 'dacia', name: 'Dacia', logo: 'DACIA', logoUrl: '/img/brands/dacia.png', popular: true, popularModels: ['Duster', 'Sandero Stepway', 'Sandero', 'Lodgy', 'Dokker', 'Logan', 'Jogger', 'Spring'] },
    { id: 'skoda', name: 'Škoda', logo: 'SKODA', logoUrl: '/img/brands/skoda.png', popular: true, popularModels: ['Octavia', 'Superb', 'Fabia', 'Kodiaq', 'Kamiq', 'Karoq', 'Scala', 'Rapid'] },
    { id: 'citroen', name: 'Citroën', logo: 'CITROEN', logoUrl: '/img/brands/citroen.png', popular: true, popularModels: ['C3', 'C4', 'C5 Aircross', 'Berlingo', 'C-Elysée', 'C3 Aircross', 'Nemo', 'Jumpy'] },
    { id: 'togg', name: 'TOGG', logo: 'TOGG', logoUrl: '/img/brands/togg.svg', popular: true, popularModels: ['T10X V1', 'T10X V2 Uzun Menzil', 'T10F Sedan'] },
    { id: 'chery', name: 'Chery', logo: 'CHERY', logoUrl: '/img/brands/chery.png', popular: true, popularModels: ['Tiggo 7 Pro', 'Tiggo 8 Pro', 'Omoda 5', 'Tiggo 4 Pro', 'Arrizo 8'] },
    { id: 'byd', name: 'BYD', logo: 'BYD', logoUrl: '/img/brands/byd.png', popular: true, popularModels: ['Atto 3', 'Seal', 'Seal U DM-i', 'Dolphin', 'Tang', 'Han', 'Song Plus'] },
    { id: 'seat', name: 'SEAT', logo: 'SEAT', logoUrl: '/img/brands/seat.png', popular: true, popularModels: ['Leon', 'Ibiza', 'Ateca', 'Arona', 'Toledo', 'Tarraco', 'Cordoba'] },
    { id: 'nissan', name: 'Nissan', logo: 'NISSAN', logoUrl: '/img/brands/nissan.png', popular: true, popularModels: ['Qashqai', 'Micra', 'Juke', 'X-Trail', 'Navara', 'Note', 'Almera', 'Primera'] },
    { id: 'kia', name: 'Kia', logo: 'KIA', logoUrl: '/img/brands/kia.png', popular: true, popularModels: ['Sportage', 'Ceed', 'Cerato', 'Rio', 'Stonic', 'Picanto', 'Sorento', 'EV6', 'Bongo', 'Niro'] },
    { id: 'tofas', name: 'Tofaş', logo: 'TOFAŞ', logoUrl: '/img/brands/tofas.svg', popular: true, popularModels: ['Şahin', 'Doğan SLX', 'Kartal', 'Murat 131', 'Murat 124', 'Serçe'] },
    { id: 'volvo', name: 'Volvo', logo: 'VOLVO', logoUrl: '/img/brands/volvo.png', popular: true, popularModels: ['XC90', 'XC60', 'S60', 'S90', 'XC40', 'V40', 'EX30', 'EX90', 'V60'] },
    { id: 'tesla', name: 'Tesla', logo: 'TESLA', logoUrl: '/img/brands/tesla.png', popular: true, popularModels: ['Model Y Long Range', 'Model Y RWD', 'Model 3', 'Model S Plaid', 'Model X', 'Cybertruck'] },

    // A-Z Tüm Araç ve Ticari Markaları
    { id: 'abarth', name: 'Abarth', logo: 'ABARTH', logoUrl: '/img/brands/abarth.png', popular: false, popularModels: ['595', '695', '124 Spider'] },
    { id: 'alfa-romeo', name: 'Alfa Romeo', logo: 'ALFA', logoUrl: '/img/brands/alfa-romeo.png', popular: false, popularModels: ['Giulia', 'Stelvio', 'Giulietta', 'Tonale', '156', '147', '159', 'MiTo'] },
    { id: 'aston-martin', name: 'Aston Martin', logo: 'AM', logoUrl: '/img/brands/aston-martin.png', popular: false, popularModels: ['DB11', 'Vantage', 'DBX', 'DBS', 'Rapide'] },
    { id: 'bentley', name: 'Bentley', logo: 'BENTLEY', logoUrl: '/img/brands/bentley.png', popular: false, popularModels: ['Continental GT', 'Flying Spur', 'Bentayga'] },
    { id: 'bmc', name: 'BMC', logo: 'BMC', logoUrl: '/img/brands/bmc.svg', popular: false, popularModels: ['Tuğra Çekici', 'Pro 827', 'Pro 1144', 'Neocity', 'Fatih'] },
    { id: 'cadillac', name: 'Cadillac', logo: 'CADILLAC', logoUrl: '/img/brands/cadillac.png', popular: false, popularModels: ['Escalade', 'CTS', 'XT5', 'SRX'] },
    { id: 'changan', name: 'Changan', logo: 'CHANGAN', logoUrl: '/img/brands/changan.png', popular: false, popularModels: ['Alsvin', 'CS35 Plus', 'CS55 Plus', 'UNI-T', 'UNI-K'] },
    { id: 'chevrolet', name: 'Chevrolet', logo: 'CHEVROLET', logoUrl: '/img/brands/chevrolet.png', popular: false, popularModels: ['Cruze', 'Aveo', 'Captiva', 'Kalos', 'Lacetti', 'Spark', 'Trax', 'Camaro'] },
    { id: 'chrysler', name: 'Chrysler', logo: 'CHRYSLER', logoUrl: '/img/brands/chrysler.png', popular: false, popularModels: ['300C', 'Grand Voyager', 'Sebring', 'Voyager'] },
    { id: 'cupra', name: 'Cupra', logo: 'CUPRA', logoUrl: '/img/brands/cupra.png', popular: false, popularModels: ['Formentor', 'Leon', 'Ateca', 'Born', 'Tavascan'] },
    { id: 'daewoo', name: 'Daewoo', logo: 'DAEWOO', logoUrl: '/img/brands/daewoo.png', popular: false, popularModels: ['Nexia', 'Matiz', 'Lanos', 'Nubira', 'Tico'] },
    { id: 'daf', name: 'DAF', logo: 'DAF', logoUrl: '/img/brands/daf.png', popular: false, popularModels: ['XF 105', 'XF 106', 'CF Serisi', 'LF Serisi', 'XG+'] },
    { id: 'daihatsu', name: 'Daihatsu', logo: 'DAIHATSU', logoUrl: '/img/brands/daihatsu.png', popular: false, popularModels: ['Terios', 'Sirion', 'Cuore', 'Materia', 'YRV', 'Applause'] },
    { id: 'dfsk', name: 'DFSK', logo: 'DFSK', logoUrl: '/img/brands/dfsk.png', popular: false, popularModels: ['Fengon 500', 'Fengon 5', 'Seres 3', 'Glory 580'] },
    { id: 'dodge', name: 'Dodge', logo: 'DODGE', logoUrl: '/img/brands/dodge.png', popular: false, popularModels: ['Ram 1500', 'Challenger', 'Charger', 'Nitro', 'Durango', 'Journey'] },
    { id: 'ds-automobiles', name: 'DS Automobiles', logo: 'DS', logoUrl: '/img/brands/ds-automobiles.png', popular: false, popularModels: ['DS 7 Crossback', 'DS 4', 'DS 9', 'DS 3 Crossback'] },
    { id: 'ferrari', name: 'Ferrari', logo: 'FERRARI', logoUrl: '/img/brands/ferrari.png', popular: false, popularModels: ['488 GTB', 'F8 Tributo', 'Roma', '296 GTB', '458 Italia', 'Portofino'] },
    { id: 'ford-trucks', name: 'Ford Trucks', logo: 'F-TRUCKS', logoUrl: '/img/brands/ford-trucks.png', popular: false, popularModels: ['F-MAX 500', 'Cargo 1846T', 'Cargo 2533', 'Cargo 3233'] },
    { id: 'geely', name: 'Geely', logo: 'GEELY', logoUrl: '/img/brands/geely.png', popular: false, popularModels: ['Emgrand', 'Coolray', 'Monjaro', 'Geometry C', 'Tugella', 'Echo', 'CK'] },
    { id: 'genesis', name: 'Genesis', logo: 'GENESIS', logoUrl: '/img/brands/genesis.png', popular: false, popularModels: ['G70', 'G80', 'G90', 'GV70', 'GV80'] },
    { id: 'gmc', name: 'GMC', logo: 'GMC', logoUrl: '/img/brands/gmc.png', popular: false, popularModels: ['Sierra', 'Yukon', 'Savana', 'Acadia'] },
    { id: 'hummer', name: 'Hummer', logo: 'HUMMER', logoUrl: '/img/brands/hummer.png', popular: false, popularModels: ['H2', 'H3', 'Hummer EV'] },
    { id: 'infiniti', name: 'Infiniti', logo: 'INFINITI', logoUrl: '/img/brands/infiniti.png', popular: false, popularModels: ['Q50', 'Q30', 'QX70', 'FX35', 'FX37'] },
    { id: 'isuzu', name: 'Isuzu', logo: 'ISUZU', logoUrl: '/img/brands/isuzu.png', popular: false, popularModels: ['D-Max', 'D-Max V-Cross', 'NPR', 'NQR 3D', 'Novo Lux', 'Turquoise'] },
    { id: 'iveco', name: 'Iveco', logo: 'IVECO', logoUrl: '/img/brands/iveco.png', popular: false, popularModels: ['Daily 35S15', 'Daily 70C15', 'Eurocargo', 'S-Way 510', 'Stralis'] },
    { id: 'jac', name: 'JAC', logo: 'JAC', logoUrl: '/img/brands/jac.png', popular: false, popularModels: ['JS4', 'T8 Pro Pickup', 'e-JS1', 'T6'] },
    { id: 'jaecoo', name: 'Jaecoo', logo: 'JAECOO', logoUrl: '/img/brands/jaecoo.svg', popular: false, popularModels: ['Jaecoo 7', 'Jaecoo 8'] },
    { id: 'jaguar', name: 'Jaguar', logo: 'JAGUAR', logoUrl: '/img/brands/jaguar.png', popular: false, popularModels: ['F-Pace', 'XF', 'XE', 'E-Pace', 'XJ', 'F-Type', 'I-Pace'] },
    { id: 'jeep', name: 'Jeep', logo: 'JEEP', logoUrl: '/img/brands/jeep.png', popular: false, popularModels: ['Renegade', 'Compass', 'Grand Cherokee', 'Wrangler', 'Cherokee', 'Avenger'] },
    { id: 'karsan', name: 'Karsan', logo: 'KARSAN', logoUrl: '/img/brands/karsan.svg', popular: false, popularModels: ['Jest', 'Atak', 'e-Jest', 'e-Atak', 'Star'] },
    { id: 'kgm-ssangyong', name: 'KGM / SsangYong', logo: 'KGM', logoUrl: '/img/brands/kgm-ssangyong.png', popular: false, popularModels: ['Torres', 'Korando', 'Tivoli', 'Musso Grand', 'Rexton G4', 'Actyon Sports'] },
    { id: 'lada', name: 'Lada', logo: 'LADA', logoUrl: '/img/brands/lada.png', popular: false, popularModels: ['Niva 4x4', 'Samara 2108/2109', 'Vega', 'Kalina', 'Vesta', 'Granta'] },
    { id: 'lamborghini', name: 'Lamborghini', logo: 'LAMBO', logoUrl: '/img/brands/lamborghini.png', popular: false, popularModels: ['Huracan', 'Urus', 'Aventador', 'Gallardo'] },
    { id: 'lancia', name: 'Lancia', logo: 'LANCIA', logoUrl: '/img/brands/lancia.png', popular: false, popularModels: ['Delta', 'Ypsilon', 'Thema', 'Musa', 'Dedra'] },
    { id: 'land-rover', name: 'Land Rover', logo: 'LANDROVER', logoUrl: '/img/brands/land-rover.png', popular: false, popularModels: ['Range Rover', 'Range Rover Sport', 'Evoque', 'Velar', 'Discovery', 'Defender', 'Freelander 2'] },
    { id: 'leapmotor', name: 'Leapmotor', logo: 'LEAP', logoUrl: '/img/brands/leapmotor.png', popular: false, popularModels: ['T03', 'C10', 'C11'] },
    { id: 'lexus', name: 'Lexus', logo: 'LEXUS', logoUrl: '/img/brands/lexus.png', popular: false, popularModels: ['RX 350h', 'NX 350h', 'ES 300h', 'UX 250h', 'IS 250', 'LS 500'] },
    { id: 'lincoln', name: 'Lincoln', logo: 'LINCOLN', logoUrl: '/img/brands/lincoln.png', popular: false, popularModels: ['Navigator', 'Aviator', 'Town Car', 'MKZ'] },
    { id: 'lotus', name: 'Lotus', logo: 'LOTUS', logoUrl: '/img/brands/lotus.png', popular: false, popularModels: ['Emira', 'Eletre', 'Evora', 'Elise'] },
    { id: 'man', name: 'MAN', logo: 'MAN', logoUrl: '/img/brands/man.png', popular: false, popularModels: ['TGX 18.440/18.480', 'TGS Serisi', 'TGM', 'TGL', 'Lion’s Coach'] },
    { id: 'maserati', name: 'Maserati', logo: 'MASERATI', logoUrl: '/img/brands/maserati.png', popular: false, popularModels: ['Ghibli', 'Levante', 'Grecale', 'Quattroporte', 'GranTurismo'] },
    { id: 'maxus', name: 'Maxus', logo: 'MAXUS', logoUrl: '/img/brands/maxus.png', popular: false, popularModels: ['e-Deliver 3', 'Deliver 9', 'T90 EV Pickup', 'Mifa 9'] },
    { id: 'mazda', name: 'Mazda', logo: 'MAZDA', logoUrl: '/img/brands/mazda.png', popular: false, popularModels: ['Mazda 3', 'Mazda 6', 'CX-5', 'CX-3', 'MX-5 Miata', '323', '626'] },
    { id: 'mclaren', name: 'McLaren', logo: 'MCLAREN', logoUrl: '/img/brands/mclaren.png', popular: false, popularModels: ['720S', 'GT', 'Artura', '570S'] },
    { id: 'mercedes-trucks', name: 'Mercedes-Benz Trucks', logo: 'MB-TRUCKS', logoUrl: '/img/brands/mercedes-trucks.png', popular: false, popularModels: ['Actros 1845/1851', 'Axor 1840', 'Atego 1518', 'Arocs'] },
    { id: 'mg', name: 'MG', logo: 'MG', logoUrl: '/img/brands/mg.png', popular: false, popularModels: ['ZS 1.5G / 1.0T', 'HS PHEV', 'MG4 Electric', 'ZS EV', 'MG5', 'Cyberster'] },
    { id: 'mini', name: 'MINI', logo: 'MINI', logoUrl: '/img/brands/mini.png', popular: false, popularModels: ['Cooper S', 'Cooper D', 'Countryman', 'Clubman', 'One'] },
    { id: 'mitsubishi', name: 'Mitsubishi', logo: 'MITSUBISHI', logoUrl: '/img/brands/mitsubishi.png', popular: false, popularModels: ['L200 Pickup', 'ASX', 'Colt', 'Outlander', 'Pajero', 'Eclipse Cross', 'Canter Fuso'] },
    { id: 'omoda', name: 'Omoda', logo: 'OMODA', logoUrl: '/img/brands/omoda.png', popular: false, popularModels: ['Omoda 5', 'Omoda E5'] },
    { id: 'otokar', name: 'Otokar', logo: 'OTOKAR', logoUrl: '/img/brands/otokar.svg', popular: false, popularModels: ['Sultan', 'Navigo T', 'Kent LF', 'Atlas Kamyon', 'Doruk'] },
    { id: 'piaggio', name: 'Piaggio', logo: 'PIAGGIO', logoUrl: '/img/brands/piaggio.svg', popular: false, popularModels: ['Porter Ticari', 'Ape 50', 'Ape Calessino'] },
    { id: 'polestar', name: 'Polestar', logo: 'POLESTAR', logoUrl: '/img/brands/polestar.png', popular: false, popularModels: ['Polestar 2', 'Polestar 3', 'Polestar 4'] },
    { id: 'porsche', name: 'Porsche', logo: 'PORSCHE', logoUrl: '/img/brands/porsche.png', popular: false, popularModels: ['Macan', 'Cayenne', 'Panamera', '911 Carrera', 'Taycan', '718 Cayman / Boxster'] },
    { id: 'proton', name: 'Proton', logo: 'PROTON', logoUrl: '/img/brands/proton.png', popular: false, popularModels: ['Gen-2', 'Persona', 'Savvy', 'Waja'] },
    { id: 'renault-trucks', name: 'Renault Trucks', logo: 'RN-TRUCKS', logoUrl: '/img/brands/renault-trucks.png', popular: false, popularModels: ['T High 520', 'Range T 460', 'Range D', 'Midlum'] },
    { id: 'rolls-royce', name: 'Rolls-Royce', logo: 'RR', logoUrl: '/img/brands/rolls-royce.png', popular: false, popularModels: ['Ghost', 'Phantom', 'Cullinan', 'Wraith', 'Spectre'] },
    { id: 'rover', name: 'Rover', logo: 'ROVER', logoUrl: '/img/brands/rover.png', popular: false, popularModels: ['75', '45', '25', '216', '416'] },
    { id: 'saab', name: 'Saab', logo: 'SAAB', logoUrl: '/img/brands/saab.png', popular: false, popularModels: ['9-3 1.9 TiD / Turbo', '9-5 Aero', '900'] },
    { id: 'scania', name: 'Scania', logo: 'SCANIA', logoUrl: '/img/brands/scania.png', popular: false, popularModels: ['R Serisi (R450/R500)', 'S Serisi (S500/S730 V8)', 'G Serisi', 'Streamline 440'] },
    { id: 'seres', name: 'Seres', logo: 'SERES', logoUrl: '/img/brands/seres.svg', popular: false, popularModels: ['Seres 3', 'Seres 5'] },
    { id: 'skywell', name: 'Skywell', logo: 'SKYWELL', logoUrl: '/img/brands/skywell.png', popular: false, popularModels: ['ET5', 'ET5 LR Legend', 'HT-i'] },
    { id: 'smart', name: 'Smart', logo: 'SMART', logoUrl: '/img/brands/smart.png', popular: false, popularModels: ['Fortwo', 'Forfour', 'Smart #1', 'Smart #3'] },
    { id: 'subaru', name: 'Subaru', logo: 'SUBARU', logoUrl: '/img/brands/subaru.png', popular: false, popularModels: ['Forester Boxer', 'XV', 'Impreza WRX', 'Outback', 'Crosstrek', 'BRZ'] },
    { id: 'suzuki', name: 'Suzuki', logo: 'SUZUKI', logoUrl: '/img/brands/suzuki.png', popular: false, popularModels: ['Swift', 'Vitara Boosterjet', 'Jimny 4x4', 'SX4 S-Cross', 'Baleno', 'Grand Vitara', 'Alto'] },
    { id: 'tata', name: 'Tata', logo: 'TATA', logoUrl: '/img/brands/tata.png', popular: false, popularModels: ['Telcoline', 'Xenon 2.2 Dicor', 'Indica', 'Indigo', 'Marina', 'Safari'] },
    { id: 'volkswagen-ticari', name: 'Volkswagen Ticari', logo: 'VW-TICARI', logoUrl: '/img/brands/volkswagen-ticari.png', popular: false, popularModels: ['Transporter T5/T6/T6.1', 'Caddy Maxi / Kombi', 'Crafter', 'Caravelle', 'Amarok V6'] },
    { id: 'volvo-trucks', name: 'Volvo Trucks', logo: 'VOLVO-TRUCKS', logoUrl: '/img/brands/volvo-trucks.png', popular: false, popularModels: ['FH16 750', 'FH 500 / 540', 'FM Serisi', 'FMX'] },
    { id: 'voyah', name: 'Voyah', logo: 'VOYAH', logoUrl: '/img/brands/voyah.png', popular: false, popularModels: ['Free EV/EREV', 'Dream MPV', 'Courage'] }
  ],

  obdCodes: [
    // 1. Motor, Hava & Yakıt Sistemi (P00xx - P02xx)
    { code: 'P0010', category: 'Motor, Hava & Yakıt', title: 'Eksantrik Mili Konum Aktüatörü Devresi (Sıra 1)', desc: 'VVT / Vanos selenoid valfi arızası veya yağ kanalı tıkanıklığı.' },
    { code: 'P0011', category: 'Motor, Hava & Yakıt', title: 'Eksantrik Mili Zamanlama Aşırı İleri (Sıra 1)', desc: 'Eksantrik mil ayar mekanizması veya düşük motor yağ basıncı.' },
    { code: 'P0016', category: 'Motor, Hava & Yakıt', title: 'Krank Mili - Eksantrik Mili Senkronizasyon Hatası', desc: 'Triger zinciri uzaması, senteden atlama veya sensör arızası.' },
    { code: 'P0030', category: 'Motor, Hava & Yakıt', title: 'Oksijen (O2) Sensörü Isıtıcı Devresi (Sıra 1 Sensör 1)', desc: 'Katalizör öncesi lambda sensörü ısıtıcı rezistans arızası.' },
    { code: 'P0087', category: 'Motor, Hava & Yakıt', title: 'Yakıt Dağıtım Yolu (Rail) Basıncı Çok Düşük', desc: 'Yüksek basınç pompası (CP4 vb.), tıkalı mazot filtresi veya rail müşürü.' },
    { code: 'P0088', category: 'Motor, Hava & Yakıt', title: 'Yakıt Dağıtım Yolu (Rail) Basıncı Çok Yüksek', desc: 'Rail basınç regülatörü sıkışması veya geri dönüş hattı tıkanıklığı.' },
    { code: 'P0100', category: 'Motor, Hava & Yakıt', title: 'Hava Akış (MAF) Sensörü Devre Arızası', desc: 'Kütle hava akış metre soketi temassızlığı veya sensör bozulması.' },
    { code: 'P0101', category: 'Motor, Hava & Yakıt', title: 'Hava Akış (MAF) Sensörü Performans Sorunu', desc: 'Hava filtresi aşırı kirli, emme hortumunda yırtık/kaçak veya kirli MAF.' },
    { code: 'P0102', category: 'Motor, Hava & Yakıt', title: 'Hava Akış (MAF) Sensörü Düşük Sinyal', desc: 'Kablo kopukluğu veya sensör iç elemanı hasarı.' },
    { code: 'P0110', category: 'Motor, Hava & Yakıt', title: 'Emme Havası Sıcaklık Sensörü (IAT) Devresi', desc: 'Emme manifold hava sıcaklık sensörü arızalı.' },
    { code: 'P0115', category: 'Motor, Hava & Yakıt', title: 'Motor Soğutma Suyu Hararet Sensörü Devresi (ECT)', desc: 'Hararet müşürü arızası, kablo kopukluğu veya termostat açık kalması.' },
    { code: 'P0120', category: 'Motor, Hava & Yakıt', title: 'Gaz Kelebeği / Pedal Konum Sensörü A Devresi', desc: 'Potansiyometre aşınması veya kelebek boğazı karbon birikimi.' },
    { code: 'P0128', category: 'Motor, Hava & Yakıt', title: 'Termostat Arızası (Motor Geç Isınıyor)', desc: 'Termostat açık konumda kilitli kalmış, motor ideal çalışma ısısına ulaşamıyor.' },
    { code: 'P0130', category: 'Motor, Hava & Yakıt', title: 'Oksijen (Lambda) Sensörü Devre Arızası (Sıra 1 Sensör 1)', desc: 'Egzoz manifoldu kaçakları veya sensör elemanı bozulması.' },
    { code: 'P0171', category: 'Motor, Hava & Yakıt', title: 'Sistem Çok Fakir (Sıra 1 - System Too Lean)', desc: 'Vakum hortumu kaçağı, MAF sensörü kirliliği veya yakıt basıncı düşüklüğü.' },
    { code: 'P0172', category: 'Motor, Hava & Yakıt', title: 'Sistem Çok Zengin (Sıra 1 - System Too Rich)', desc: 'Damlatan enjektör, tıkalı hava filtresi veya yüksek yakıt basıncı.' },
    { code: 'P0201', category: 'Motor, Hava & Yakıt', title: '1. Silindir Enjektör Devresi Açık / Arızalı', desc: 'Enjektör kablo soket temassızlığı veya piezo bobin arızası.' },
    { code: 'P0202', category: 'Motor, Hava & Yakıt', title: '2. Silindir Enjektör Devresi Açık / Arızalı', desc: '2. silindir enjektör kablo veya bobin arızası.' },
    { code: 'P0203', category: 'Motor, Hava & Yakıt', title: '3. Silindir Enjektör Devresi Açık / Arızalı', desc: '3. silindir enjektör kablo veya bobin arızası.' },
    { code: 'P0204', category: 'Motor, Hava & Yakıt', title: '4. Silindir Enjektör Devresi Açık / Arızalı', desc: '4. silindir enjektör kablo veya bobin arızası.' },
    { code: 'P0234', category: 'Motor, Hava & Yakıt', title: 'Turboşarj Aşırı Basınç Durumu (Overboost)', desc: 'Turbo georadyal kanatçık (VNT) sıkışması, N75 valfi arızası veya wastegate.' },
    { code: 'P0299', category: 'Motor, Hava & Yakıt', title: 'Turboşarj Düşük Basınç (Underboost)', desc: 'Turbo wastegate kaçırma, intercooler hortum yırtığı veya vakum tüpü arızası.' },

    // 2. Ateşleme & Yanma Kaçırma (P03xx)
    { code: 'P0300', category: 'Ateşleme & Silindir Kaçırma', title: 'Çoklu / Rastgele Silindir Ateşleme Kaçırma (Misfire)', desc: 'Ateşleme bobini, bujiler, sübap kaçağı veya enjektör arızası kaynaklı.' },
    { code: 'P0301', category: 'Ateşleme & Silindir Kaçırma', title: '1. Silindirde Ateşleme Kaçırma Algılandı', desc: '1. silindir buji/bobin veya kompresyon düşüklüğü.' },
    { code: 'P0302', category: 'Ateşleme & Silindir Kaçırma', title: '2. Silindirde Ateşleme Kaçırma Algılandı', desc: '2. silindir buji/bobin veya kompresyon düşüklüğü.' },
    { code: 'P0303', category: 'Ateşleme & Silindir Kaçırma', title: '3. Silindirde Ateşleme Kaçırma Algılandı', desc: '3. silindir buji/bobin veya kompresyon düşüklüğü.' },
    { code: 'P0304', category: 'Ateşleme & Silindir Kaçırma', title: '4. Silindirde Ateşleme Kaçırma Algılandı', desc: '4. silindir buji/bobin veya kompresyon düşüklüğü.' },
    { code: 'P0325', category: 'Ateşleme & Silindir Kaçırma', title: 'Vuruntu Sensörü 1 Devre Arızası (Knock Sensor)', desc: 'Sensör gevşemesi, kablo aşınması veya iç devre kopukluğu.' },
    { code: 'P0335', category: 'Ateşleme & Silindir Kaçırma', title: 'Krank Mili Konum Sensörü (CKP) Devresi', desc: 'Motor marş basıp çalışmıyor veya ani stop ediyor; volan dişli okuyucu arızası.' },
    { code: 'P0340', category: 'Ateşleme & Silindir Kaçırma', title: 'Eksantrik Mili Konum Sensörü (CMP) Devresi', desc: 'Eksantrik mil okuyucu sensör arızası veya tesisat kopukluğu.' },

    // 3. Emisyon, Egzoz, EGR & DPF (P04xx, P20xx - P24xx)
    { code: 'P0400', category: 'Egzoz, EGR & DPF Filtresi', title: 'EGR Egzoz Gazı Geri Çevrim Akış Arızası', desc: 'EGR valfi karbon ve kurum birikimi sebebiyle tıkanmış.' },
    { code: 'P0401', category: 'Egzoz, EGR & DPF Filtresi', title: 'EGR Valfi Yetersiz Akış Algılandı', desc: 'EGR borusu veya soğutucusu kurum bağlamış, temizlik gerekir.' },
    { code: 'P0403', category: 'Egzoz, EGR & DPF Filtresi', title: 'EGR Kontrol Devresi Arızası', desc: 'EGR selenoid veya elektrikli motor bobini yanmış/kopuk.' },
    { code: 'P0420', category: 'Egzoz, EGR & DPF Filtresi', title: 'Katalitik Konvertör Verim Eşiği Altında (Sıra 1)', desc: 'Katalizör petek erimesi/tıkanıklığı veya arka oksijen sensörü yanılsaması.' },
    { code: 'P0430', category: 'Egzoz, EGR & DPF Filtresi', title: 'Katalitik Konvertör Verim Eşiği Altında (Sıra 2)', desc: 'V6/V8 motorlarda 2. sıra katalizör performans kaybı.' },
    { code: 'P0442', category: 'Egzoz, EGR & DPF Filtresi', title: 'EVAP Depo Havalandırma Küçük Gaz Kaçağı', desc: 'Depo kapağı contası yırtık veya kanister havalandırma valfi sızdırıyor.' },
    { code: 'P2002', category: 'Egzoz, EGR & DPF Filtresi', title: 'Dizel Partikül Filtresi (DPF) Verim Eşiği Altında', desc: 'DPF petek çatlağı, aşırı kurum veya rejenerasyon yetersizliği.' },
    { code: 'P20EE', category: 'Egzoz, EGR & DPF Filtresi', title: 'SCR AdBlue NOx Katalizör Verim Hatası', desc: 'AdBlue enjektörü kristalleşmiş veya NOx sensörü arızalı.' },
    { code: 'P2452', category: 'Egzoz, EGR & DPF Filtresi', title: 'DPF Diferansiyel Basınç Sensörü Devresi', desc: 'DPF giriş-çıkış silikon hortumları erimiş veya sensör bozulmuş.' },
    { code: 'P2463', category: 'Egzoz, EGR & DPF Filtresi', title: 'DPF Kurum Birikimi - Filtre Aşırı Dolu', desc: 'Acil DPF rejenerasyonu veya profesyonel partikül temizliği gereklidir.' },

    // 4. Rölanti, Hız Sensörleri & Beyin/ECU (P05xx - P06xx)
    { code: 'P0500', category: 'Rölanti, Hız & Beyin (ECU)', title: 'Araç Hız Sensörü (VSS) Arızası', desc: 'Hız göstergesi çalışmıyor, ABS modülü veya şanzıman hız sensörü hatası.' },
    { code: 'P0505', category: 'Rölanti, Hız & Beyin (ECU)', title: 'Rölanti Kontrol Sistemi Arızası (IAC)', desc: 'Rölanti motoru arızalı veya boğaz kelebeğinde hava kaçağı.' },
    { code: 'P0520', category: 'Rölanti, Hız & Beyin (ECU)', title: 'Motor Yağ Basınç Sensörü / Şalteri Devresi', desc: 'Yağ basınç müşürü bozuk veya motor yağ pompası aşınmış.' },
    { code: 'P0562', category: 'Rölanti, Hız & Beyin (ECU)', title: 'Sistem Voltajı Düşük', desc: 'Alternatör (şarj dinamosu) şarj etmiyor veya akü ömrü tükenmiş.' },
    { code: 'P0606', category: 'Rölanti, Hız & Beyin (ECU)', title: 'ECM / PCM Motor Kontrol Beyin İşlemci Hatası', desc: 'Motor beyni iç mikroişlemci iletişim veya besleme arızası.' },

    // 5. Şanzıman & Aktarma (P07xx - P09xx)
    { code: 'P0700', category: 'Şanzıman & Aktarma Organları', title: 'Otomatik Şanzıman Kontrol Sistemi Arızası', desc: 'Şanzıman beyni (TCM) hata kaydetti, vites koruma moduna geçti.' },
    { code: 'P0705', category: 'Şanzıman & Aktarma Organları', title: 'Şanzıman Vites Konum Şalteri (PRNDL Girişi)', desc: 'Vites kolu şalteri ayarsız veya vites konumu algılanamıyor.' },
    { code: 'P0715', category: 'Şanzıman & Aktarma Organları', title: 'Şanzıman Giriş / Türbin Hız Sensörü Devresi', desc: 'Tork konvertör veya giriş mili devir sensörü okumuyor.' },
    { code: 'P0730', category: 'Şanzıman & Aktarma Organları', title: 'Yanlış Vites Oranı (Vites Geçiş Uyumsuzluğu)', desc: 'Otomatik şanzıman balataları kaçırıyor veya selenoid takılı kalmış.' },
    { code: 'P0740', category: 'Şanzıman & Aktarma Organları', title: 'Tork Konvertör Debriyaj (TCC) Selenoid Devresi', desc: 'Tork konvertör kilitlenemiyor, aşırı şanzıman ısınması.' },
    { code: 'P0841', category: 'Şanzıman & Aktarma Organları', title: 'Şanzıman Yağ Basınç Sensörü / Anahtarı Aralığı', desc: 'Mekatronik gövde yağ basıncı düşük veya selenoid kaçırıyor.' },

    // 6. Şasi, Fren & ABS / ESP (C0xxx - C1xxx)
    { code: 'C0035', category: 'Şasi, Fren & ABS/ESP', title: 'Sol Ön Tekerlek Hız Sensörü Devresi (ABS)', desc: 'ABS tekerlek sensörü kablosu sürtmüş veya porya rulman manyetiği bozuk.' },
    { code: 'C0040', category: 'Şasi, Fren & ABS/ESP', title: 'Sağ Ön Tekerlek Hız Sensörü Devresi (ABS)', desc: 'Sağ ön ABS sensör arızası veya soket korozyonu.' },
    { code: 'C0045', category: 'Şasi, Fren & ABS/ESP', title: 'Sol Arka Tekerlek Hız Sensörü Devresi (ABS)', desc: 'Sol arka ABS sensör arızası.' },
    { code: 'C0050', category: 'Şasi, Fren & ABS/ESP', title: 'Sağ Arka Tekerlek Hız Sensörü Devresi (ABS)', desc: 'Sağ arka ABS sensör arızası.' },
    { code: 'C1201', category: 'Şasi, Fren & ABS/ESP', title: 'Motor Kontrol Sistemi Hatası Nedeniyle ABS İptali', desc: 'Motor arıza lambası yandığı için ABS/ESP kendini emniyete aldı.' },
    { code: 'C1288', category: 'Şasi, Fren & ABS/ESP', title: 'Fren Basınç Sensörü Ana Devre Arızası', desc: 'ABS hidrolik blok iç basınç sensörü arızalı (ESP devre dışı).' },

    // 7. Gövde, Airbag & Konfor (B0xxx - B1xxx)
    { code: 'B0001', category: 'Gövde, Airbag & Güvenlik', title: 'Sürücü Ön Hava Yastığı Dağıtım Kontrolü', desc: 'Direksiyon zembereği (airbag sargısı) kopuk veya soket gevşek.' },
    { code: 'B0028', category: 'Gövde, Airbag & Güvenlik', title: 'Sağ Yan Hava Yastığı Dağıtım Kontrolü', desc: 'Koltuk altı airbag sarı soketi temassızlığı (kronik sanayi arızası).' },
    { code: 'B1000', category: 'Gövde, Airbag & Güvenlik', title: 'Gövde Kontrol Modülü (BCM) Donanım Arızası', desc: 'Konfor beyni / sigorta kutusu dahili elektronik arızası.' },
    { code: 'B1318', category: 'Gövde, Airbag & Güvenlik', title: 'Gövde Modülü Akü Voltajı Çok Düşük', desc: 'Merkezi kilit, camlar veya aydınlatma modülü düşük voltaj hatası.' },

    // 8. Ağ, CAN-Bus & Haberleşme (U0xxx - U1xxx)
    { code: 'U0001', category: 'Ağ & CAN-Bus İletişim', title: 'Yüksek Hızlı CAN İletişim Veri Yolu Hatası (Bus-Off)', desc: 'CAN-H veya CAN-L hatlarında şaseye kısa devre veya hat kopukluğu.' },
    { code: 'U0100', category: 'Ağ & CAN-Bus İletişim', title: 'Motor Kontrol Modülü (ECM) ile İletişim Kaybı', desc: 'Motor beyni ana besleme rölesi, sigortası veya CAN tesisatı kopuk.' },
    { code: 'U0101', category: 'Ağ & CAN-Bus İletişim', title: 'Şanzıman Kontrol Modülü (TCM) ile İletişim Kaybı', desc: 'Şanzıman mekatronik beynine elektrik gitmiyor veya haberleşme kesik.' },
    { code: 'U0121', category: 'Ağ & CAN-Bus İletişim', title: 'Fren / ABS Kontrol Modülü ile İletişim Kaybı', desc: 'ABS beyni soketi oksitlenmiş veya besleme hattı kesilmiş.' },
    { code: 'U0140', category: 'Ağ & CAN-Bus İletişim', title: 'Gövde Kontrol Modülü (BCM) ile İletişim Kaybı', desc: 'İç konfor beyni ile gösterge/motor arasındaki ağ kopukluğu.' },
    { code: 'U0401', category: 'Ağ & CAN-Bus İletişim', title: 'Motor Kontrol Modülünden Geçersiz Veri Alındı', desc: 'Şanzıman veya ABS beyni motordan gelen tork/devir verisini doğrulayamıyor.' }
  ],

  cities: [
    { name: 'İstanbul', sanayiler: ['Maslak Atatürk Oto Sanayi', 'İkitelli Bağcılar-Güngören', 'Bostancı Oto Sanayi', 'Ümraniye Kadosan', 'Kartal Oto Sanayi'] },
    { name: 'Ankara', sanayiler: ['Şaşmaz Oto Sanayi', 'İvedik Organize Sanayi', 'Ostim Sanayi Sitesi', 'Erciyes Oto Sanayi'] },
    { name: 'İzmir', sanayiler: ['1. Sanayi Sitesi', '2. Sanayi Sitesi', '3. Sanayi Sitesi', '6. Sanayi Sitesi', 'Çiğli Ata Sanayi'] },
    { name: 'Bursa', sanayiler: ['Nilüfer Küçük Sanayi', 'Otosansit Sanayi Sitesi', 'Beşevler Sanayi'] },
    { name: 'Antalya', sanayiler: ['Akdeniz Sanayi Sitesi', 'Yeşil Sanayi Sitesi'] },
    { name: 'Kocaeli', sanayiler: ['İzmit Sanayi Sitesi', 'Gebze Küçük Sanayi'] }
  ],

  levelThresholds: {
    cirak: { min: 0, max: 99, title: 'Çırak', badgeClass: 'badge-level-cirak' },
    kalfa: { min: 100, max: 299, title: 'Kalfa', badgeClass: 'badge-level-kalfa' },
    usta: { min: 300, max: 699, title: 'Usta', badgeClass: 'badge-level-usta' },
    master: { min: 700, max: 99999, title: 'Master', badgeClass: 'badge-level-master' }
  },

  // Popüler Model Bazlı Motor & Güç Seçenekleri
  modelEngines: {
    // Škoda
    'superb': [
      '1.5 TSI ACT (150 HP) DSG Benzin',
      '1.6 TDI (120 HP) DSG Dizel',
      '2.0 TDI CR (150 HP) DSG Dizel',
      '2.0 TDI CR (190 HP) 4x4 DSG Dizel',
      '2.0 TDI CR (200 HP) 4x4 DSG Dizel',
      '1.4 TSI (125 / 150 HP) ACT Benzin',
      '2.0 TSI (280 HP) 4x4 DSG Benzin',
      '1.4 TSI iV Plug-in Hybrid (218 HP)',
      '1.5 eTSI mHEV (150 HP) Hafif Hibrit'
    ],
    'octavia': [
      '1.5 TSI / 1.5 eTSI (150 HP) DSG Benzin',
      '1.6 TDI CR (105 / 115 HP) DSG Dizel',
      '1.0 TSI / 1.0 eTSI (110 / 115 HP) DSG',
      '2.0 TDI CR (150 / 200 HP RS) Dizel',
      '1.4 TSI (140 / 150 HP) Benzin',
      '2.0 TSI RS (245 HP) DSG'
    ],
    'fabia': [
      '1.0 TSI (95 / 110 HP) DSG Benzin',
      '1.0 MPI (65 / 75 / 80 HP) Atmosferik Benzin',
      '1.2 TSI (90 / 110 HP) Benzin',
      '1.4 TDI (75 / 90 / 105 HP) Dizel',
      '1.5 TSI (150 HP) DSG Benzin'
    ],
    'kodiaq': [
      '1.5 TSI ACT (150 HP) DSG Benzin',
      '2.0 TDI CR (150 HP) DSG Dizel',
      '2.0 TDI CR (190 / 200 HP) 4x4 Dizel',
      '2.0 BiTDI RS (240 HP) 4x4 Dizel',
      '2.0 TSI (190 HP) 4x4 Benzin'
    ],
    'kamiq': [
      '1.5 TSI ACT (150 HP) DSG Benzin',
      '1.0 TSI (110 / 115 HP) DSG Benzin',
      '1.6 TDI (115 HP) DSG Dizel'
    ],
    'karoq': [
      '1.5 TSI ACT (150 HP) DSG Benzin',
      '1.6 TDI (115 HP) DSG Dizel',
      '2.0 TDI (150 HP) 4x4 DSG Dizel'
    ],
    'scala': [
      '1.5 TSI ACT (150 HP) DSG Benzin',
      '1.0 TSI (110 / 115 HP) DSG Benzin',
      '1.6 TDI (115 HP) DSG Dizel'
    ],

    // Volkswagen
    'passat': [
      '1.6 TDI CR (105 / 120 HP) DSG Dizel',
      '2.0 TDI CR (150 HP) DSG Dizel',
      '2.0 TDI CR (190 / 200 HP) 4Motion DSG Dizel',
      '1.5 TSI EVO ACT (150 HP) DSG Benzin',
      '1.4 TSI (122 / 125 / 150 HP ACT) Benzin',
      '2.0 BiTDI (240 HP) 4Motion Dizel',
      '2.0 TSI (220 / 280 HP) 4Motion Benzin',
      '1.9 TDI (105 / 130 HP) Dizel'
    ],
    'golf': [
      '1.6 TDI CR (105 / 115 HP) DSG Dizel',
      '1.5 TSI / 1.5 eTSI ACT (150 HP) DSG Benzin',
      '1.0 TSI / 1.0 eTSI (110 / 115 HP) Benzin',
      '2.0 TDI (150 / 184 / 200 HP GTD) Dizel',
      '1.4 TSI (122 / 125 / 140 / 150 HP) Benzin',
      '1.2 TSI (105 / 110 HP) Benzin',
      '2.0 TSI GTI / R (245 / 320 HP) Benzin'
    ],
    'polo': [
      '1.0 TSI (95 / 110 HP) DSG Benzin',
      '1.0 MPI (65 / 80 HP) Benzin',
      '1.6 TDI (80 / 90 / 95 HP) Dizel',
      '1.4 TDI (75 / 90 HP) Dizel',
      '1.2 TSI (90 / 105 HP) Benzin',
      '1.4 16V (85 HP) Benzin'
    ],
    'tiguan': [
      '1.5 TSI / 1.5 eTSI (150 HP) DSG Benzin',
      '2.0 TDI CR (150 / 190 / 200 HP) 4Motion Dizel',
      '1.4 TSI (125 / 150 HP) Benzin',
      '1.6 TDI (115 HP) Dizel',
      '2.0 TSI (190 / 245 HP) 4Motion'
    ],
    'caddy': [
      '2.0 TDI (102 / 122 HP) DSG Dizel',
      '1.6 TDI (102 HP) Dizel',
      '1.9 TDI (105 HP Pumpe-Düse) Dizel',
      '1.5 TSI (114 HP) Benzin',
      '2.0 SDI Atmosferik Dizel'
    ],
    'transporter': [
      '2.0 TDI (102 / 140 / 150 HP) Dizel',
      '2.0 BiTDI (180 / 199 / 204 HP 4Motion) Dizel',
      '1.9 TDI (105 HP) Dizel',
      '2.5 TDI (130 / 174 HP) 5 Silindir Dizel'
    ],
    'jetta': [
      '1.6 TDI (105 HP) DSG Dizel',
      '1.4 TSI (122 / 125 / 150 HP) DSG Benzin',
      '1.2 TSI (105 HP) Benzin',
      '1.6 Düz Atmosferik (102 HP) Hit Motor / LPG'
    ],

    // Renault
    'megane': [
      '1.5 dCi (90 / 110 / 115 HP) EDC Dizel',
      '1.3 TCe (140 HP) EDC Benzin',
      '1.6 16V (115 HP) Benzin / LPG',
      '1.2 TCe (130 HP) Benzin',
      '1.6 dCi (130 / 160 HP) EDC Dizel',
      '1.0 TCe (115 HP) Benzin',
      '1.6 E-Tech Plug-in Hybrid (160 HP)'
    ],
    'clio': [
      '1.5 dCi (75 / 90 HP) Dizel',
      '1.0 TCe (90 / 100 HP) X-Tronic Benzin',
      '1.0 SCe (65 / 72 HP) Atmosferik Benzin',
      '0.9 TCe (90 HP) Turbo Benzin',
      '1.2 16V (75 HP) Benzin / LPG',
      '1.6 E-Tech Full Hybrid (145 HP)'
    ],
    'fluence': [
      '1.5 dCi (90 / 110 HP) EDC Dizel',
      '1.6 16V (110 / 115 HP) Otomatik / Manuel Benzin',
      '1.6 dCi (130 HP) Dizel'
    ],
    'symbol': [
      '1.5 dCi (75 / 90 HP) Dizel',
      '0.9 TCe (90 HP) Turbo Benzin',
      '1.2 16V (75 HP) Benzin',
      '1.0 SCe (73 HP) Benzin'
    ],
    'duster': [
      '1.5 dCi (110 / 115 HP) 4x2 / 4x4 Dizel',
      '1.0 TCe ECO-G (100 HP) Fabrikasyon LPG',
      '1.3 TCe (130 / 150 HP) EDC Benzin',
      '1.2 TCe Mild Hybrid 48V (130 HP)',
      '1.6 SCe (115 HP) Benzin'
    ],
    'austral': [
      '1.2 E-Tech Full Hybrid (200 HP) Otomatik',
      '1.3 TCe Mild Hybrid (160 HP) X-Tronic'
    ],
    'captur': [
      '1.3 TCe (140 / 155 HP) EDC Benzin',
      '1.5 dCi (90 / 115 HP) EDC Dizel',
      '1.0 TCe (100 HP) Benzin',
      '1.2 TCe (120 HP) EDC Benzin'
    ],

    // Fiat
    'egea': [
      '1.3 Multijet (95 HP) Dizel',
      '1.6 Multijet (120 / 130 HP) DCT Otomatik Dizel',
      '1.4 Fire (95 HP) 6 İleri Manuel Benzin',
      '1.5 T4 Hibrit (130 HP) 7 İleri Otomatik',
      '1.0 FireFly (100 HP) Turbo Benzin',
      '1.6 E-Torq (110 HP) AT6 Otomatik Benzin'
    ],
    'doblo': [
      '1.3 Multijet (90 / 95 HP) Dizel',
      '1.6 Multijet (105 / 120 HP) Dizel',
      '1.5 BlueHDi (100 / 130 HP) EAT8 Dizel',
      '1.9 JTD / Multijet (105 HP) Dizel',
      '2.0 Multijet (135 HP) Dizel',
      '1.4 Fire (95 HP) Benzin'
    ],
    'fiorino': [
      '1.3 Multijet (75 / 95 HP) Dizel',
      '1.4 Fire (77 HP) Benzin / Eko LPG'
    ],
    'linea': [
      '1.3 Multijet (90 / 95 HP) Dizel',
      '1.6 Multijet (105 HP) Dizel',
      '1.4 Fire (77 HP) Benzin',
      '1.4 T-Jet (120 HP) Turbo Benzin'
    ],
    'punto': [
      '1.3 Multijet (75 / 90 / 95 HP) Dizel',
      '1.4 Fire (77 HP) Dualogic Benzin',
      '1.2 8V (65 / 69 HP) Benzin'
    ],

    // Ford
    'focus': [
      '1.5 EcoBlue (120 HP) 8 İleri Otomatik Dizel',
      '1.6 TDCi (95 / 115 HP) Dizel',
      '1.0 EcoBoost (100 / 125 HP) mHEV Benzin',
      '1.5 EcoBoost (150 / 182 HP) Benzin',
      '1.6 Ti-VCT Duratec (125 HP) Benzin / LPG',
      '2.0 TDCi (150 / 185 HP) Dizel'
    ],
    'courier': [
      '1.5 TDCi / EcoBlue (75 / 100 HP) Dizel',
      '1.6 TDCi (95 HP) Dizel',
      '1.0 EcoBoost (100 / 125 HP) Benzin'
    ],
    'fiesta': [
      '1.4 TDCi (68 / 70 HP) Dizel',
      '1.5 TDCi (75 / 85 HP) Dizel',
      '1.0 EcoBoost (100 HP) Powershift Benzin',
      '1.25 Duratec (82 HP) Benzin',
      '1.4 16V (96 HP) Otomatik Benzin'
    ],
    'transit': [
      '2.0 EcoBlue (130 / 170 / 185 HP) Dizel',
      '2.2 TDCi Puma (100 / 125 / 155 HP) Dizel',
      '2.4 TDCi (140 HP) Arkadan İtiş Dizel'
    ],
    'mondeo': [
      '2.0 TDCi (140 / 150 / 163 / 180 HP) Dizel',
      '1.5 EcoBoost (160 HP) Otomatik Benzin',
      '1.6 TDCi (115 HP) Dizel',
      '2.0 Hybrid (187 HP) e-CVT'
    ],

    // Toyota
    'corolla': [
      '1.8 Hybrid (122 / 140 HP) e-CVT Hibrit',
      '1.6 Valvematic (132 HP) Multidrive S Benzin',
      '1.5 Dynamic Force (123 HP) Multidrive S Benzin',
      '1.4 D-4D (90 HP) M/M Dizel',
      '1.6 VVT-i (110 / 124 HP) Benzin',
      '2.0 Hybrid (184 HP) e-CVT'
    ],
    'yaris': [
      '1.5 Hybrid (116 HP) e-CVT',
      '1.5 Benzinli (125 HP) Multidrive S',
      '1.0 Benzinli (72 HP)',
      '1.4 D-4D (90 HP) Dizel',
      '1.33 Dual VVT-i (99 HP)'
    ],
    'c-hr': [
      '1.8 Hybrid (122 / 140 HP) e-CVT',
      '2.0 Hybrid (197 HP) e-CVT',
      '1.2 Turbo (116 HP) Benzin'
    ],
    'hilux': [
      '2.4 D-4D (150 HP) 4x2 / 4x4 Dizel',
      '2.8 D-4D (204 HP) 4x4 Otomatik Dizel',
      '2.5 D-4D (144 HP) Dizel',
      '3.0 D-4D (171 HP) 4x4 Dizel'
    ],

    // BMW
    '3-serisi': [
      '320d 2.0 Dizel (N47 184 HP / B47 190 HP)',
      '320i 1.6 Turbo (N13 170 HP) Benzin',
      '320i 2.0 Turbo (B48 170 / 184 HP) Benzin',
      '316i 1.6 Turbo (N13 136 HP) Benzin',
      '318d 2.0 Dizel (143 / 150 HP)',
      '330i 2.0 Turbo (252 / 258 HP) Benzin',
      '330e Plug-in Hybrid (292 HP)',
      '330d 3.0 6 Silindir Dizel (258 HP)'
    ],
    '5-serisi': [
      '520d 2.0 Dizel (N47 184 HP / B47 190 HP)',
      '520i 1.6 Turbo (N13 170 HP) Benzin',
      '520i 2.0 Turbo (B48 184 HP) Benzin',
      '525d 2.0 Twin Turbo Dizel (218 HP)',
      '530d 3.0 6 Silindir Dizel (258 / 265 HP)',
      '530i 2.0 Turbo (252 HP) Benzin',
      '530e Plug-in Hybrid (252 / 292 HP)'
    ],
    '1-serisi': [
      '116d 1.5 3 Silindir Dizel (116 HP)',
      '118i 1.5 Turbo Benzin (136 / 140 HP)',
      '116i 1.6 Turbo Benzin (136 HP)',
      '120d 2.0 Dizel (177 / 190 HP)'
    ],

    // Mercedes-Benz
    'c-serisi': [
      'C200d 1.6 Dizel (OM626 136 HP / OM654 160 HP)',
      'C200 1.5 Mild Hybrid (184 / 204 HP 4MATIC)',
      'C180 1.6 Turbo (156 HP) 7G / 9G-Tronic',
      'C220d 2.0 Dizel (170 / 194 / 200 HP 4MATIC)'
    ],
    'e-serisi': [
      'E220d 2.0 Dizel (OM654 194 / 200 HP)',
      'E200d 1.6 / 2.0 Dizel (160 HP)',
      'E180 1.6 Turbo Benzin (156 HP)',
      'E200 2.0 Turbo Benzin (184 / 197 HP)',
      'E350d 3.0 V6 Dizel (258 HP)'
    ],

    // Audi
    'a3': [
      '1.6 TDI (105 / 110 / 115 HP) S tronic Dizel',
      '1.5 TFSI / 35 TFSI (150 HP) S tronic Benzin',
      '1.0 TFSI / 30 TFSI (110 / 116 HP) Benzin',
      '1.4 TFSI (125 / 150 HP COD) Benzin',
      '2.0 TDI (150 / 184 HP quattro) Dizel'
    ],
    'a4': [
      '2.0 TDI (143 / 150 / 177 / 190 / 204 HP quattro) Dizel',
      '2.0 TFSI / 40 TFSI (190 / 204 HP) S tronic',
      '1.4 TFSI (150 HP) S tronic Benzin',
      '3.0 TDI V6 (218 / 272 HP quattro) Dizel'
    ],
    'a6': [
      '2.0 TDI / 40 TDI (177 / 190 / 204 HP) S tronic',
      '3.0 TDI V6 (245 / 272 / 313 HP BiTDI quattro)',
      '2.0 TFSI / 45 TFSI (245 / 265 HP)'
    ],

    // Hyundai
    'i20': [
      '1.4 MPI (100 HP) Otomatik Benzin',
      '1.0 T-GDI (100 / 120 HP) 48V DCT Benzin',
      '1.2 D-CVVT (84 HP) Manuel Benzin',
      '1.4 CRDi (90 HP) Dizel'
    ],
    'tucson': [
      '1.6 CRDi (136 HP) 4x2 / 4x4 DCT Dizel',
      '1.6 T-GDI (177 / 180 HP) 4x4 DCT Benzin',
      '1.6 HEV Hibrit (230 HP) Otomatik',
      '2.0 CRDi (185 HP) 4x4 Dizel'
    ],
    'elantra': [
      '1.6 MPI (123 HP) CVT Otomatik Benzin',
      '1.6 D-CVVT (127 HP) Benzin',
      '1.6 CRDi (136 HP) DCT Dizel'
    ],

    // Honda
    'civic': [
      '1.6 i-VTEC Eco (125 HP) Otomatik Fabrikasyon LPG',
      '1.5 VTEC Turbo (182 HP) CVT Benzin',
      '1.6 i-DTEC (120 HP) 9 İleri Otomatik Dizel',
      '2.0 e:HEV Full Hybrid (184 HP)',
      '1.8 i-VTEC (140 HP) Otomatik Benzin'
    ],

    // Opel
    'astra': [
      '1.6 CDTI (110 / 136 HP) Dizel',
      '1.4 Turbo (140 / 150 HP) Otomatik Benzin',
      '1.5 Dizel (122 / 130 HP) AT8 Otomatik',
      '1.2 Turbo PureTech (110 / 130 HP) Benzin',
      '1.3 CDTI (90 / 95 HP) Dizel',
      '1.6 16V Ecotec (115 HP) Benzin'
    ],
    'corsa': [
      '1.2 Benzinli (75 HP) Manuel',
      '1.2 Turbo (100 / 130 HP) AT8 Otomatik',
      '1.5 Dizel (102 HP) Manuel',
      '1.3 CDTI (75 / 90 / 95 HP) Dizel',
      '1.4 16V (90 / 100 HP) Otomatik',
      'Elektrikli 100 kW / 136 HP'
    ],
    'insignia': [
      '1.6 CDTI (136 HP) Otomatik Dizel',
      '2.0 CDTI (160 / 170 / 195 HP BiTurbo) Dizel',
      '1.5 Turbo (165 HP) Otomatik Benzin',
      '1.6 Turbo (180 / 200 HP) Benzin'
    ],

    // Peugeot
    '3008': [
      '1.5 BlueHDi (130 HP) EAT8 Dizel',
      '1.6 BlueHDi (120 HP) EAT6 Dizel',
      '1.2 PureTech (130 HP) EAT8 Benzin',
      '1.6 THP / PureTech (165 / 180 HP) EAT8 Benzin',
      '1.6 Plug-in Hybrid (225 / 300 HP AWD)'
    ],
    '208': [
      '1.5 BlueHDi (100 / 130 HP) Dizel',
      '1.2 PureTech (75 / 100 / 130 HP) EAT8 Benzin',
      '1.6 BlueHDi (100 HP) Dizel',
      '1.4 HDi (68 HP) Dizel',
      'e-208 Elektrikli (136 / 156 HP)'
    ],
    '2008': [
      '1.5 BlueHDi (130 HP) EAT8 Dizel',
      '1.2 PureTech (130 HP) EAT8 Benzin',
      'e-2008 Elektrikli (136 / 156 HP)'
    ],

    // TOGG
    't10x': [
      'RWD Tek Motor Standart Menzil (218 HP / 160 kW / 52.4 kWh)',
      'RWD Tek Motor Uzun Menzil (218 HP / 160 kW / 88.5 kWh)',
      'AWD Çift Motor (435 HP / 320 kW)'
    ],
    't10f': [
      'RWD Tek Motor (218 HP / 160 kW)',
      'AWD Çift Motor (435 HP / 320 kW)'
    ],

    // Tesla
    'model-y': [
      'RWD Tek Motor Arkadan İtiş (LFP 60 kWh)',
      'Long Range Çift Motor AWD (78.1 kWh)',
      'Performance Çift Motor AWD (534 HP)'
    ],
    'model-3': [
      'RWD Tek Motor Standart Menzil',
      'Long Range Çift Motor AWD',
      'Performance AWD'
    ],

    // Chery
    'tiggo-7-pro': [
      '1.6 TGDI (183 HP) 7DCT Benzin',
      '1.5 TCI (147 / 156 HP) CVT'
    ],
    'tiggo-8-pro': [
      '1.6 TGDI (183 HP) 7DCT Benzin',
      '2.0 TGDI (254 HP) AWD Benzin'
    ],
    'omoda-5': [
      '1.6 TGDI (183 HP) 7DCT Benzin',
      'Elektrikli EV (204 HP / 61 kWh)'
    ],

    // BYD
    'atto-3': [
      'Tam Elektrikli 150 kW (204 HP / 60.5 kWh Blade Batarya)'
    ],
    'seal': [
      'RWD Tek Motor 230 kW (313 HP / 82.5 kWh)',
      'AWD Çift Motor 390 kW (530 HP Excellence)'
    ],
    'seal-u': [
      '1.5 DM-i Şarj Edilebilir Hibrit (218 HP)',
      'Tam Elektrikli EV (218 HP / 87 kWh)'
    ],

    // Tofaş
    'sahin': [
      '1.6 ie Enjeksiyonlu (SOHC) LPG/Benzin',
      '1.6 Karbüratörlü Düz Motor',
      '1.4 Karbüratörlü'
    ],
    'dogan': [
      '1.6 ie SLX Enjeksiyonlu (SOHC) LPG/Benzin',
      '1.6 SLX Karbüratörlü',
      '1.6 Düz Karbüratörlü'
    ],
    'kartal': [
      '1.6 ie SLX Enjeksiyonlu',
      '1.6 SLX Karbüratörlü',
      '1.6 Düz Motor'
    ]
  },

  // Standart Genel Motor Seçenekleri
  genericEngines: [
    '1.0 Turbo Benzin (TSI / TCe / EcoBoost / PureTech)',
    '1.2 Turbo Benzin (PureTech / TSI / TCe)',
    '1.3 Multijet / CDTI Dizel',
    '1.4 Turbo Benzin (TSI / Fire / T-Jet / T-GDI)',
    '1.5 dCi / BlueHDi / EcoBlue Dizel',
    '1.5 Turbo Benzin / Hibrit (TSI / VVT-i / T-GDI)',
    '1.6 TDI / BlueHDi / CRDi / Multijet Dizel',
    '1.6 Atmosferik Benzin & LPG (i-VTEC / 16V / Valvematic)',
    '1.6 Turbo Benzin (THP / PureTech / T-GDI / VTEC Turbo)',
    '1.8 Hibrit (HEV / PHEV)',
    '2.0 Turbo Dizel (TDI / BlueHDi / d / D-4D / Duratorq)',
    '2.0 Turbo Benzin (TSI / TFSI / EcoBoost / BMW Turbo)',
    '2.2 / 2.5 / 2.8 Ticari & Kamyonet Dizel',
    '3.0 V6 Dizel / Benzin',
    'Tam Elektrikli (EV)',
    'Plug-in Hybrid (PHEV)'
  ],

  // Marka veya modele göre motor listesi getiren akıllı yardımcı
  getEnginesFor(brandName, modelName) {
    const cleanStr = (s) => (s || '').toLowerCase()
      .replace(/[\u0131]/g, 'i')
      .replace(/[\u015f]/g, 's')
      .replace(/[\u011f]/g, 'g')
      .replace(/[\u00fc]/g, 'u')
      .replace(/[\u00f6]/g, 'o')
      .replace(/[\u00e7]/g, 'c')
      .replace(/[^a-z0-9]/g, '');

    const cModel = cleanStr(modelName);
    const cBrand = cleanStr(brandName);

    // 1. Model eşleşmesi ara
    if (cModel) {
      for (const [key, engines] of Object.entries(this.modelEngines)) {
        const cKey = cleanStr(key);
        if (cModel.includes(cKey) || cKey.includes(cModel)) {
          return engines;
        }
      }
    }

    // 2. Marka özel popüler motorları birleştir
    const brandEngines = [];
    if (cBrand) {
      for (const [key, engines] of Object.entries(this.modelEngines)) {
        // Markanın modelleriyle eşleşiyor mu?
        const brandObj = this.brands.find(b => cleanStr(b.name) === cBrand || cleanStr(b.id) === cBrand);
        if (brandObj && brandObj.popularModels) {
          const isModelOfBrand = brandObj.popularModels.some(m => cleanStr(m).includes(cleanStr(key)) || cleanStr(key).includes(cleanStr(m)));
          if (isModelOfBrand) {
            engines.forEach(e => { if (!brandEngines.includes(e)) brandEngines.push(e); });
          }
        }
      }
    }

    if (brandEngines.length > 0) {
      return brandEngines;
    }

    return this.genericEngines;
  }
};

window.APP_DATA = APP_DATA;

