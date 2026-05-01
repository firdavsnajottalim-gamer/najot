/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Book as BookIcon, ChevronRight, Filter } from 'lucide-react';

// --- Types ---
interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  iconColor: string;
  pdfUrl?: string;
}

// --- Constants ---
const CATEGORIES = ['Barchasi', 'Badiiy', 'Mumtoz', 'Bolalar', 'Jahon', 'Ma\'rifiy'];

// Note: Using search links as fallbacks for specific PDFs to ensure they always point to a valid resource
const BOOKS: Book[] = [
  { id: 3, title: 'Garri Potter va ajal tuhfalari', author: 'J.K. Rowling', category: 'Jahon', iconColor: 'bg-purple-600', pdfUrl: 'https://ziyouz.uz/search?q=Garri+Potter' },
  { id: 4, title: 'Garri Potter va mahfiy hona', author: 'J.K. Rowling', category: 'Jahon', iconColor: 'bg-purple-600', pdfUrl: 'https://ru.scribd.com/document/740146078/2-Garri-Potter-va-Maxfiy-xujra' },
  { id: 5, title: '15 yoshli kapitan', author: 'Jyul Vern', category: 'Jahon', iconColor: 'bg-blue-600', pdfUrl: 'https://ru.scribd.com/document/843931227/Jyul-Vern-O-n-besh-yoshli-kapitan-roman-uzsmart-uz' },
  { id: 6, title: 'Tom Soyerning boshidan kechirganlari', author: 'Mark Tven', category: 'Jahon', iconColor: 'bg-orange-500', pdfUrl: 'https://ru.scribd.com/document/792286568/Tom-Soyerning-Boshidan-Kechirganlari-Mark-Tven' },
  { id: 7, title: 'Urush va tinchlik 1-2-qism', author: 'Lev Tolstoy', category: 'Jahon', iconColor: 'bg-red-700', pdfUrl: 'https://n.ziyouz.com/books/jahon_nasri/Lev%20Tolstoy.%20Urush%20va%20tinchlik%20(1-kitob).pdf' },
  { id: 8, title: 'Urush va tinchlik 3-4-qism', author: 'Lev Tolstoy', category: 'Jahon', iconColor: 'bg-red-700', pdfUrl: 'https://n.ziyouz.com/books/jahon_nasri/Lev%20Tolstoy.%20Urush%20va%20tinchlik%20(3-kitob).pdf' },
  { id: 9, title: 'Jaloliddin Rumiy', author: 'Radiy Fish', category: 'Mumtoz', iconColor: 'bg-amber-600', pdfUrl: 'https://n.ziyouz.com/books/jahon_nasri/Radiy%20Fish.%20Jaloliddin%20Rumiy%20(roman).pdf' },
  { id: 10, title: 'Ikki eshik orasi', author: 'O\'tkir Hoshimov', category: 'Badiiy', iconColor: 'bg-cyan-600', pdfUrl: 'https://ipkmvd.uz/media/pdf/kitoblar/Ikki_eshik_orasi_Otkir_Hoshimov_Xo9QkWN.pdf' },
  { id: 11, title: 'Avlodlar dovoni', author: 'Pirimqul Qodirov', category: 'Badiiy', iconColor: 'bg-indigo-600', pdfUrl: 'https://ziyouz.com/downloads/pirimqul_qodirov_avlodlar_dovoni.pdf' },
  { id: 12, title: 'Yosh xonim uchun odobnoma', author: 'Navoiy saboqlari', category: 'Ma\'rifiy', iconColor: 'bg-pink-500', pdfUrl: 'https://ziyouz.uz/search?q=odobnoma' },
  { id: 13, title: 'Ulug\'bek hazinasi', author: 'Odil Yoqubov', category: 'Badiiy', iconColor: 'bg-yellow-600', pdfUrl: 'https://ru.scribd.com/document/795866084/ODIL-YOQUBOVNING-ULUGBEK-XAZINASI-ROMANIDA-BADIIY' },
  { id: 14, title: 'Garov', author: 'Anton Chexov', category: 'Jahon', iconColor: 'bg-slate-500', pdfUrl: 'https://ru.scribd.com/document/843386070/Garov-Anton-Chexov' },
  { id: 15, title: 'Majoz va Haqiyqat', author: 'Ma\'rifiy asar', category: 'Mumtoz', iconColor: 'bg-teal-600', pdfUrl: 'https://ziyouz.uz/search?q=Majoz+va+Haqiqat' },
  { id: 16, title: 'Haqiqat kurtaklari', author: 'O\'gitlar', category: 'Ma\'rifiy', iconColor: 'bg-green-600', pdfUrl: 'https://ziyouz.uz/search?q=Haqiqat+kurtaklari' },
  { id: 17, title: 'Chol va dengiz', author: 'Ernest Xeminguey', category: 'Jahon', iconColor: 'bg-blue-400', pdfUrl: 'https://ru.scribd.com/document/823360598/Chol-Va-Dengiz' },
  { id: 18, title: 'Shaytonvachchaning nayranglari', author: 'Erkin Vohidov', category: 'Bolalar', iconColor: 'bg-rose-500', pdfUrl: 'https://ru.scribd.com/document/667087736/71a4175a3a80850aac0239e6fa0a82ce-Shaytonvachchaning-Nayranglari' },
  { id: 19, title: 'Bahor keldi seni so\'roqlab', author: 'Zulfiya', category: 'Badiiy', iconColor: 'bg-lime-500', pdfUrl: 'https://lib.utu-ranch.uz/media/files/2024/09/07/Zulfiya.Bahor.pdf' },
  { id: 20, title: 'Jannatga yo\'l', author: 'Diniy-ma\'rifiy', category: 'Ma\'rifiy', iconColor: 'bg-emerald-600', pdfUrl: 'https://ziyouz.uz/search?q=Jannatga+yo+l' },
  { id: 21, title: 'Hakim va ajal', author: 'Falsafiy asar', category: 'Mumtoz', iconColor: 'bg-gray-700', pdfUrl: 'https://ziyouz.uz/search?q=Hakim+va+ajal' },
  { id: 22, title: 'Ranjikom', author: 'Ensiklopedik asar', category: 'Ma\'rifiy', iconColor: 'bg-zinc-600', pdfUrl: 'https://ziyouz.uz/search?q=Ranjikom' },
  { id: 23, title: 'Sohibqiron', author: 'Abdulla Oripov', category: 'Badiiy', iconColor: 'bg-blue-900', pdfUrl: 'https://api.unilibrary.uz/storage/PublisherResourceFile/37018/images/1663572797.pdf' },
  { id: 24, title: 'Gulliverning sayohatlari', author: 'Jonatan Svift', category: 'Jahon', iconColor: 'bg-sky-500', pdfUrl: 'https://api.ziyonet.uz/uploads/books/29429/546465e52f4c6.pdf' },
  { id: 25, title: 'Qiyomat', author: 'Chingiz Aytmatov', category: 'Jahon', iconColor: 'bg-red-600', pdfUrl: 'https://ziyouz.com/downloads/chingiz_aytmatov_qiyomat.pdf' },
  { id: 26, title: 'Abulfayzhon', author: 'Abdurauf Fitrat', category: 'Mumtoz', iconColor: 'bg-amber-700', pdfUrl: 'https://ziyouz.com/downloads/abdurauf_fitrat_abulfayzhon.pdf' },
  { id: 27, title: 'Oydinda yurgan odamlar', author: 'Shukur Xolmirzayev', category: 'Badiiy', iconColor: 'bg-orange-600', pdfUrl: 'http://api.unilibrary.uz/storage/PublisherResourceFile/48843/images/1664261395.pdf' },
  { id: 28, title: 'Savdogarlar ustozi', author: 'Ahmad Lutfiy Qozonchi', category: 'Ma\'rifiy', iconColor: 'bg-amber-500', pdfUrl: 'https://ru.scribd.com/document/687571709/SAVDOGARLAR-USTOZI' },
  { id: 29, title: 'Ruhlar isyoni', author: 'Erkin Vohidov', category: 'Badiiy', iconColor: 'bg-violet-600', pdfUrl: 'https://n.ziyouz.com/books/uzbek_zamonaviy_sheriyati/Erkin%20Vohidov.%20Ruhlar%20isyoni.pdf' },
  { id: 30, title: 'Adabiyot muallimi', author: 'Badiiy hikoya', category: 'Badiiy', iconColor: 'bg-fuchsia-600', pdfUrl: 'https://n.ziyouz.com/portal-haqida/xarita/uzbek-nasri/abdulla-qahhor-1907-1968/abdulla-qahhor-adabiyot-muallimi-hikoya' },
  { id: 31, title: 'Tushda kechgan umrlar', author: 'O\'tkir Hoshimov', category: 'Badiiy', iconColor: 'bg-indigo-500', pdfUrl: 'https://www.sever.be/files/BADIIY%20KITOBLAR/Tushda%20kechgan%20umrlar.%20Utkir%20Hoshimov.%20Roman.Toshkent%202019..pdf' },
  { id: 32, title: 'Asrni qaritgan kunlar', author: 'Chingiz Aytmatov', category: 'Jahon', iconColor: 'bg-stone-600', pdfUrl: 'https://api.ziyonet.uz/uploads/books/49959/5b05397e6a59b.pdf' },
  { id: 33, title: 'Xamsa', author: 'Alisher Navoiy', category: 'Mumtoz', iconColor: 'bg-yellow-700', pdfUrl: 'https://ru.scribd.com/document/627299939/Ali%C5%9Fer-Navaiy-Xamsa' },
  { id: 34, title: 'Xojand qala\'si', author: 'Tarixiy asar', category: 'Badiiy', iconColor: 'bg-amber-800', pdfUrl: 'https://ziyouz.uz/search?q=Xojand+qalasi' },
  { id: 35, title: 'Quyonlar saltanati', author: 'Bolalar hikoyasi', category: 'Bolalar', iconColor: 'bg-pink-400', pdfUrl: 'https://n.ziyouz.com/books/bolalar_kutubxonasi/Xudoyberdi%20To\'xtaboyev.%20Quyonlar%20saltanatining%20shahanshohi%20(roman).pdf' },
  { id: 36, title: 'Shirin qovunlar mamlakati', author: 'Xudoyberdi To\'xtaboyev', category: 'Bolalar', iconColor: 'bg-orange-400', pdfUrl: 'https://n.ziyouz.com/portal-haqida/xarita/uzbek-nasri/xudoyberdi-to-xtaboyev-1933/xudoyberdi-to-xtaboyev-shirin-qovunlar-mamlakati-roman' },
  { id: 37, title: 'Sariq devning o\'limi', author: 'Xudoyberdi To\'xtaboyev', category: 'Bolalar', iconColor: 'bg-yellow-500', pdfUrl: 'https://api.ziyonet.uz/uploads/books/685302/5463314bd671f.pdf' },
  { id: 38, title: 'Qasoskorning oltin boshi', author: 'Xudoyberdi To\'xtaboyev', category: 'Bolalar', iconColor: 'bg-amber-600', pdfUrl: 'https://api.ziyonet.uz/uploads/books/29429/5464850689983.pdf' },
  { id: 39, title: 'Mungli ko\'zlar', author: 'Xudoyberdi To\'xtaboyev', category: 'Bolalar', iconColor: 'bg-sky-400', pdfUrl: 'https://api.unilibrary.uz/storage/PublisherResourceFile/271101/images/1680497251.pdf' },
  { id: 40, title: 'Quyoshli nay', author: 'Bolalar she\'riyati', category: 'Bolalar', iconColor: 'bg-yellow-300', pdfUrl: 'https://ziyouz.uz/search?q=Quyoshli+nay' },
  { id: 41, title: 'Ezop masallari', author: 'Ezop', category: 'Jahon', iconColor: 'bg-emerald-700', pdfUrl: 'https://n.ziyouz.com/portal-haqida/xarita/hikmatlar/ezop-masallari' },
  { id: 42, title: 'Oq kema', author: 'Chingiz Aytmatov', category: 'Jahon', iconColor: 'bg-white text-black', pdfUrl: 'https://api.unilibrary.uz/storage/PublisherResourceFile/216176/images/1673930988.pdf' },
  { id: 43, title: 'Jayhun ustida bulutlar', author: 'Tarixiy asar', category: 'Badiiy', iconColor: 'bg-blue-300', pdfUrl: 'https://api.unilibrary.uz/storage/PublisherResourceFile/560903/images/1723631755.pdf' },
  { id: 44, title: 'Navoiy (Roman)', author: 'Oybek', category: 'Badiiy', iconColor: 'bg-neutral-800', pdfUrl: 'http://ru.scribd.com/document/708831561/Oybek-Navoiy-Roman' },
  { id: 45, title: 'Shahzoda va gado', author: 'Mark Tven', category: 'Jahon', iconColor: 'bg-gold-500', pdfUrl: 'https://ru.scribd.com/document/877627201/Shahzoda-Va-Gado' },
  { id: 46, title: 'Alkimyogar', author: 'Paulo Koelyo', category: 'Jahon', iconColor: 'bg-amber-400', pdfUrl: 'https://ru.scribd.com/document/683781295/Alkimyogar' },
  { id: 47, title: 'Jannati odamlar', author: 'O\'tkir Hoshimov', category: 'Badiiy', iconColor: 'bg-teal-400', pdfUrl: 'https://ru.scribd.com/document/782353702/Jannati-odamlar-Xudoyberdi-To%CA%BBxtaboyev' },
  { id: 48, title: 'Robinzon Kruzo', author: 'Daniel Defo', category: 'Jahon', iconColor: 'bg-sky-700', pdfUrl: 'https://n.ziyouz.com/books/jahon_nasri/Daniel%20Defo.%20Robinzon%20Kruzoning%20hayoti%20va%20ajoyib%20sarguzashtlari.pdf' },
  { id: 49, title: 'Galaktikada bir kun 1', author: 'Ilmiy-fantastika', category: 'Ma\'rifiy', iconColor: 'bg-indigo-900', pdfUrl: 'https://ru.scribd.com/document/768519634/Galaktikada-bir-kun' },
  { id: 50, title: 'Galaktikada bir kun 2', author: 'Ilmiy-fantastika', category: 'Ma\'rifiy', iconColor: 'bg-indigo-900', pdfUrl: 'https://ziyouz.uz/search?q=Galaktikada+bir+kun' },
  { id: 51, title: 'On ikki yo\'lovchi', author: 'Sarguzasht', category: 'Jahon', iconColor: 'bg-zinc-500', pdfUrl: 'https://ziyouz.uz/search?q=On+ikki+yo+lovchi' },
  { id: 52, title: 'Mikrob kundaligidan', author: 'Ma\'lumotnoma', category: 'Ma\'rifiy', iconColor: 'bg-lime-600', pdfUrl: 'https://ziyouz.uz/search?q=Mikrob+kundaligidan' },
  { id: 53, title: 'Bo\'ladigan bolalar', author: 'O\'gitlar', category: 'Bolalar', iconColor: 'bg-blue-200 text-black', pdfUrl: 'https://ziyouz.uz/search?q=Bo+ladigan+bolalar' },
  { id: 54, title: 'Uloqda', author: 'Abdulla Qodiriy', category: 'Badiiy', iconColor: 'bg-emerald-900', pdfUrl: 'https://n.ziyouz.com/portal-haqida/xarita/uzbek-nasri/abdulla-qodiriy-1894-1938/abdulla-qodiriy-uloqda-hikoya' },
  { id: 55, title: 'Vijdonli bola', author: 'Ma\'rifiy asar', category: 'Bolalar', iconColor: 'bg-green-400', pdfUrl: 'https://ziyouz.uz/search?q=Vijdonli+bola' },
  { id: 56, title: 'Oltin bola', author: 'Bolalar hikoyasi', category: 'Bolalar', iconColor: 'bg-yellow-400', pdfUrl: 'https://n.ziyouz.com/books/bolalar_kutubxonasi/Gans%20Xristian%20Andersen.%20Oltin%20bola%20(ertaklar).pdf' },
  { id: 57, title: 'Nayranglar 4-kitob', author: 'Erkin Vohidov', category: 'Bolalar', iconColor: 'bg-red-500', pdfUrl: 'https://ziyouz.uz/search?q=Nayranglar' },
  { id: 58, title: 'Aql solig\'i', author: 'Hikmatli so\'zlar', category: 'Ma\'rifiy', iconColor: 'bg-purple-400', pdfUrl: 'https://ziyouz.uz/search?q=Aql+solig+i' },
  { id: 59, title: 'Nonni bosgan qiz', author: 'Ibratli hikoya', category: 'Ma\'rifiy', iconColor: 'bg-amber-200 text-black', pdfUrl: 'https://ziyouz.uz/search?q=Nonni+bosgan+qiz' },
  { id: 60, title: 'Non va oltin', author: 'Masal', category: 'Ma\'rifiy', iconColor: 'bg-yellow-600', pdfUrl: 'https://ziyouz.uz/search?q=Non+va+oltin' },
  { id: 61, title: 'Olijanob kishilar', author: 'Hikoyalar', category: 'Badiiy', iconColor: 'bg-indigo-400', pdfUrl: 'https://zakm.uz/media/books/Non_va_oltin.pdf' },
  { id: 62, title: 'Qora oqqush', author: 'Nassim Taleb (Jahon)', category: 'Jahon', iconColor: 'bg-black', pdfUrl: 'https://ru.scribd.com/document/895606738/Kalila-Va-Dimnahttps://ru.scribd.com/document/895606738/' },
  { id: 63, title: 'Kalila va Dimna', author: 'Mumtoz to\'plam', category: 'Mumtoz', iconColor: 'bg-rose-700', pdfUrl: 'https://ru.scribd.com/document/895606738/Kalila-Va-Dimna' },
  { id: 65, title: 'Sariq devni minib', author: 'Xudoyberdi To\'xtaboyev', category: 'Bolalar', iconColor: 'bg-yellow-500', pdfUrl: 'https://api.ziyonet.uz/uploads/books/29429/5464817167ccb.pdf' },
  { id: 66, title: 'Kundalik odoblar', author: 'Odob-axloq', category: 'Ma\'rifiy', iconColor: 'bg-teal-500', pdfUrl: 'https://ziyouz.uz/search?q=Kundalik+odoblar' },
  { id: 67, title: 'Kecha va kunduz', author: 'Cho\'lpon', category: 'Badiiy', iconColor: 'bg-slate-900', pdfUrl: 'https://sever.be/files/BADIIY%20KITOBLAR/Kecha%20va%20kunduz.%20Roman.%20A.Chulpon.%20Toshkent%202019.pdf' },
  { id: 68, title: 'Maktub', author: 'Paulo Koelyo', category: 'Jahon', iconColor: 'bg-stone-500', pdfUrl: 'https://jdpu.uz/wp-content/uploads/2020/04/Maktub-Paulo-Koelo.pdf' },
  { id: 69, title: 'Masnaviy', author: 'Jaloliddin Rumiy', category: 'Mumtoz', iconColor: 'bg-amber-900', pdfUrl: 'https://n.ziyouz.com/books/sharq_mumtoz_adabiyoti/Jaloliddin%20Rumiy.%20Masnaviyi%20ma\'naviy.%201-kitob.pdf' },
  { id: 70, title: 'Koinot oqimlari', author: 'Ayzek Azimov', category: 'Jahon', iconColor: 'bg-indigo-800', pdfUrl: 'https://n.ziyouz.com/books/jahon_nasri/Ayzek%20Azimov.%20Koinot%20oqimlari.pdf' },
  { id: 71, title: 'Qulayotgan tog\'lar', author: 'Chingiz Aytmatov', category: 'Jahon', iconColor: 'bg-stone-700', pdfUrl: 'https://ru.scribd.com/document/619678142/Qulayotgan-tog-lar-kitoblar1' },
];

export default function App() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Barchasi');

  const filteredBooks = useMemo(() => {
    return BOOKS.filter((book) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower);
      const matchesCategory =
        activeCategory === 'Barchasi' || book.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#00c896] selection:text-black">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00c896]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00c896]/5 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24">
        {/* Header Section */}
        <section className="flex flex-col items-center text-center mb-16 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="w-24 h-24 bg-[#121212] rounded-3xl flex items-center justify-center p-4 border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00c896]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <NajotLogo className="w-full h-full text-white relative z-10" />
            </div>
          </motion.div>

          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-black tracking-tighter uppercase"
            >
              NAJOT <span className="text-[#00c896]">LIBRARY</span>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-[#00c896] text-sm md:text-base font-medium tracking-[0.2em] uppercase opacity-80"
            >
              By Odiljonov Firdavsbek
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 max-w-lg text-lg leading-relaxed"
            >
              Kitoblar to'plami. Mutolaa qilish uchun kitob ustiga bosing.
            </motion.p>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-xl relative group px-4"
          >
            <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#00c896] transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Kitob qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#121212] border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-lg focus:outline-none focus:ring-2 focus:ring-[#00c896]/50 focus:border-[#00c896] transition-all placeholder:text-gray-600 shadow-inner"
            />
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mt-8"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                  activeCategory === cat
                    ? 'bg-[#00c896] text-black border-[#00c896] shadow-[0_0_20px_rgba(0,200,150,0.3)]'
                    : 'bg-[#1a1a1a] text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </section>

        {/* Grid Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, delay: index * 0.01 }}
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </AnimatePresence>
        </section>

        {filteredBooks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 space-y-4"
          >
            <div className="inline-block p-6 rounded-full bg-[#121212] mb-4">
              <Filter className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-500">Hech narsa topilmadi</h3>
            <p className="text-gray-600">Qidiruv so'zini yoki kategoriyani o'zgartirib ko'ring</p>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 text-center text-gray-600 text-sm space-y-2">
        <p>© 2026 Najot Library. Barcha huquqlar himoyalangan.</p>
        <p className="text-gray-700 font-medium tracking-wide">By Odiljonov Firdavsbek</p>
      </footer>
    </div>
  );
}

// --- Subcomponents ---

function BookCard({ book }: { book: Book }) {
  const handleClick = () => {
    const url = book.pdfUrl || `https://ziyouz.uz/search?q=${encodeURIComponent(book.title)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      onClick={handleClick}
      className="group relative bg-[#121212] rounded-[2rem] p-8 h-[380px] border border-white/5 hover:border-[#00c896]/30 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-2xl hover:shadow-[#00c896]/10 cursor-pointer"
    >
      {/* Card Header Background Pattern */}
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <NajotLogo className="w-48 h-48 -mr-12 -mt-12 rotate-12" />
      </div>

      <div className="relative z-10 flex justify-end">
        <div className={`w-14 h-14 rounded-2xl ${book.iconColor} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
          <BookIcon className="w-7 h-7 text-white" />
        </div>
      </div>

      <div className="relative z-10 mt-auto">
        <h3 className="text-2xl font-bold mb-2 leading-tight group-hover:text-[#00c896] transition-colors line-clamp-2">
          {book.title}
        </h3>
        <p className="text-gray-500 text-lg line-clamp-1 mb-8">{book.author}</p>

        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest font-bold text-gray-600">
            {book.category}
          </span>
          <div className="flex items-center gap-2 group-hover:text-[#00c896] transition-colors">
            <span className="text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Yuklab olish</span>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#00c896] group-hover:text-black transition-all duration-300">
              <ChevronRight className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Hover Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#00c896]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
}

function NajotLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
      <path d="M50 15L85 35L85 65L50 85L15 65L15 35L50 15ZM50 25L25 40L25 60L50 75L75 60L75 40L50 25Z" />
      <path d="M50 40L65 50L50 60L35 50L50 40Z" />
      <path d="M48 5V15M52 5V15M95 33L85 38M95 67L85 62M52 85V95M48 85V95M5 67L15 62M5 33L15 38" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
