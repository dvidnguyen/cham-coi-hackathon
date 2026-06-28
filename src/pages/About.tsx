import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

// Image imports matching generated assets
import whyExistImg from "@/assets/about-7.png";
import ourStory1Img from "@/assets/about-2.jpg";
import ourStory2Img from "@/assets/about-3.jpg";
import quotesBgImg from "@/assets/about-quotes-bg.png";
import aboutGateImg from "@/assets/about-gate.png";

type Quote = {
  text: string;
  author: string;
  role: string;
};

const quotes: Quote[] = [
  {
    text: "In the spaces where teenagers and elders meet, we don't just share stories—we heal the distance between times.",
    author: "Nguyễn Quang Linh",
    role: "CHẠM CỘI Founder",
  },
  {
    text: "Wisdom is not a relic of the past, but a light for the future when held in the hands of the young.",
    author: "Bác Nguyễn Văn Hai",
    role: "Elderly Mentor (74 years old)",
  },
  {
    text: "Listening to their stories made me realize that our struggles are not new, and their strength is a guide for our path.",
    author: "Nguyễn Đan Khánh Ngọc",
    role: "Youth Participant (21 years old)",
  },
  {
    text: "Teenagers and the elderly are the two beautiful extremes of human life. When they connect, the energy of the future meets the wisdom of the past, creating a bridge that holds society together.",
    author: "Nguyễn Đăng Khôi",
    role: "Youth Participant (22 years old)",
  },
  {
    text: "There is a secret kinship between the young and the old. Both groups stand slightly outside the frantic rush of mid-life production, allowing them to see what truly matters: patience, laughter, and the value of a really good story.",
    author: "Võ Thị Đông Nghi",
    role: "Youth Participant (21 years old)",
  },
  {
    text: "The elderly give teenagers an anchor—a sense of history, roots, and unconditional acceptance. In return, teenagers give the elderly a torch—filling their days with new light, energy, and a reminder that the world keeps moving forward.",
    author: "Nguyễn Quốc Hải",
    role: "Youth Participant (21 years old)",
  }
];

type Value = {
  num: string;
  title: string;
  desc: string;
};

const values: Value[] = [
  {
    num: "01",
    title: "Empathy First",
    desc: "We listen with deep intent, bridging the decades between us with patience, open hearts, and mutual respect.",
  },
  {
    num: "02",
    title: "Cultural Continuity",
    desc: "We believe traditional arts and personal memories are living heritages that must be active in the present, not archived in the past.",
  },
  {
    num: "03",
    title: "Mutual Growth",
    desc: "The connection is a two-way street. Elders share lifetime wisdom and traditional crafts, while teenagers share their energy and digital voice.",
  },
  {
    num: "04",
    title: "Authentic Expression",
    desc: "Whether through lacquer painting, spoken stories, or digital art, we encourage honest and creative self-expression.",
  },
];

export function About() {
  const [progress, setProgress] = useState(0); // 0 (closed) to 1 (fully open)

  // Listen to wheel scroll events to control the gate opening state
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const isAtTop = window.scrollY === 0;

      // Scrolling down while the gate is not fully open
      if (isAtTop && progress < 1 && e.deltaY > 0) {
        e.preventDefault();
        setProgress((prev) => Math.min(prev + 0.08, 1));
      }
      // Scrolling up while the gate is open
      else if (isAtTop && progress > 0 && e.deltaY < 0) {
        e.preventDefault();
        setProgress((prev) => Math.max(prev - 0.08, 0));
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [progress]);

  // Listen to keyboard navigation to control the gate opening state
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isAtTop = window.scrollY === 0;

      if (isAtTop && progress < 1) {
        if (["ArrowDown", "Space", "PageDown", " "].includes(e.key)) {
          e.preventDefault();
          setProgress((prev) => Math.min(prev + 0.15, 1));
        }
      }
      if (isAtTop && progress > 0) {
        if (["ArrowUp", "PageUp"].includes(e.key)) {
          e.preventDefault();
          setProgress((prev) => Math.max(prev - 0.15, 0));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [progress]);

  // Listen to touch events for mobile touch scrolling
  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY; // positive = swipe up (scroll down)
      const isAtTop = window.scrollY === 0;

      if (isAtTop && progress < 1 && deltaY > 0) {
        e.preventDefault();
        setProgress((prev) => Math.min(prev + 0.05, 1));
      } else if (isAtTop && progress > 0 && deltaY < 0) {
        e.preventDefault();
        setProgress((prev) => Math.max(prev - 0.05, 0));
      }

      touchStartY = touchY;
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [progress]);

  // Quotes Slider State
  const [currentQuote, setCurrentQuote] = useState(0);

  // Auto-play quotes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Proportional text fades based on scrolling progress
  const titleRatio = Math.max(1 - progress / 0.35, 0);
  const narrativeRatio = progress > 0.65 ? (progress - 0.65) / 0.35 : 0;

  return (
    <div className="w-full bg-ink text-white overflow-x-hidden">
      
      {/* SECTION 1: Why We Exist (Scroll-locked splitting gate & zoom) */}
      <div className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-ink">
        
        {/* Background image inside the zooming arch */}
        <motion.div
          animate={{
            width: progress === 1 ? "100vw" : progress === 0 ? "300px" : `calc(300px + (100vw - 300px) * ${progress})`,
            height: progress === 1 ? "100vh" : progress === 0 ? "450px" : `calc(450px + (100vh - 450px) * ${progress})`,
            borderRadius: `${(1 - progress) * 180}px ${(1 - progress) * 180}px 0px 0px`,
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="absolute z-10 overflow-hidden flex items-center justify-center shadow-2xl shadow-black/80"
        >
          <img
            src={whyExistImg}
            alt="Intergenerational connection lacquer painting"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay that deepens when zoomed for readability */}
          <motion.div 
            animate={{ opacity: 0.3 + progress * 0.35 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black"
          />
        </motion.div>

        {/* Left Door */}
        <motion.div
          animate={{ x: `-${progress * 100}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="absolute top-0 left-0 w-1/2 h-full z-20 border-r border-[#c5a880]/15 overflow-hidden"
        >
          <img 
            src={aboutGateImg} 
            alt="Left gate door" 
            className="absolute top-0 left-0 w-[100vw] h-full max-w-none object-cover"
          />
        </motion.div>

        {/* Right Door */}
        <motion.div
          animate={{ x: `${progress * 100}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="absolute top-0 right-0 w-1/2 h-full z-20 border-l border-[#c5a880]/15 overflow-hidden"
        >
          <img 
            src={aboutGateImg} 
            alt="Right gate door" 
            className="absolute top-0 right-0 w-[100vw] h-full max-w-none object-cover"
          />
        </motion.div>

        {/* Seam line indicator at start */}
        <motion.div
          animate={{ opacity: progress > 0 ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#c5a880]/40 z-30 pointer-events-none"
        />

        {/* Initial Heading: "Why we exist" (fades out as gates open) */}
        <motion.div
          animate={{ 
            opacity: titleRatio, 
            scale: 0.9 + titleRatio * 0.1 
          }}
          transition={{ duration: 0.1 }}
          className="absolute z-30 flex flex-col items-center pointer-events-none text-center px-4"
        >
          <span className="text-xs uppercase tracking-[0.4em] text-[#c5a880] mb-3">About CHẠM CÕI</span>
          <h1 className="font-display text-5xl md:text-7xl text-white">
            Why We Exist
          </h1>
          {progress === 0 && (
            <p className="text-xs text-white/40 tracking-widest uppercase mt-8 animate-pulse">
              Scroll down to open
            </p>
          )}
        </motion.div>

        {/* Zoomed Narrative Overlay (Fades in proportionally as gates fully open) */}
        <motion.div
          animate={{ 
            opacity: narrativeRatio, 
            y: 25 * (1 - narrativeRatio) 
          }}
          transition={{ duration: 0.1 }}
          className="absolute z-30 max-w-2xl px-6 text-center flex flex-col items-center justify-center pointer-events-auto"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-[#c5a880] mb-4">Our Vision</span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-6">
            Bridging the Decades
          </h2>
          <p className="font-sans text-sm md:text-base text-white/80 leading-relaxed font-light mb-6">
            Every elder is a living library of stories, memories, and traditional craft. Yet, in our fast-paced digital world, their voices often sit in silence. At the same time, teenagers possess boundless energy and tools to shape the future, but seek grounding, identity, and guidance.
          </p>
          <p className="font-sans text-sm md:text-base text-[#c5a880]/90 leading-relaxed font-light">
            CHẠM CÕI is a dedicated gateway. We bring elders and teenagers together in creative harmony to share oral histories, teach traditional lacquer painting, and build lasting bonds that restore continuity to our cultural fabric.
          </p>
        </motion.div>
      </div>

      {/* SECTION 2: Our Story (Asymmetric Editorial Collage) */}
      <section className="relative w-full bg-ink py-24 md:py-36 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          
          {/* Header scattering */}
          <div className="mb-20">
            <motion.span 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="block text-xs uppercase tracking-[0.3em] text-[#c5a880] mb-3"
            >
              The Journey
            </motion.span>
            
            <h2 className="font-display text-5xl md:text-7xl font-light tracking-tight text-white leading-tight">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="italic text-[#c5a880]/90 mr-4 font-normal"
              >
                (Our Story)
              </motion.span>
              Celebrating Heritage
            </h2>
          </div>

          {/* Asymmetric Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
            
            {/* Left Column: First Image + Story block */}
            <div className="md:col-span-7 space-y-12">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="group relative overflow-hidden rounded-lg aspect-[4/3] bg-ink-soft border border-white/5"
              >
                <img 
                  src={ourStory1Img} 
                  alt="Elderly artisan teaching lacquer craft" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-xl space-y-6"
              >
                <h3 className="font-display text-2xl md:text-3xl text-amber-100/90 font-light italic">
                  Where oral tradition meets canvas.
                </h3>
                <p className="text-sm md:text-base text-white/70 leading-relaxed font-light">
                  We began as a group of local artists and social workers who observed a widening chasm between generations in urban areas. Elders spoke of isolation, and teenagers felt disconnected from their heritage. We realized art could serve as the ultimate connective tissue.
                </p>
                <p className="text-sm md:text-base text-white/70 leading-relaxed font-light">
                  By centering our workshops around traditional Vietnamese lacquer painting — a slow, meditative process requiring layers of paint, drying, and polishing — we created a natural space for conversation. As hands work with gold leaf and resin, stories flow freely.
                </p>
              </motion.div>
            </div>

            {/* Right Column: Narrative + Second Image */}
            <div className="md:col-span-5 md:mt-24 space-y-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="border-l border-[#c5a880]/30 pl-6 space-y-4"
              >
                <p className="text-sm text-[#c5a880] tracking-widest uppercase">The Spark</p>
                <p className="text-sm md:text-base text-white/80 leading-relaxed font-light">
                  "Seeing the eyes of a teenager light up when they learn a stroke from a grandmother, and seeing that grandmother feel valued, is why we commit to this. It is a dialogue of silence, laughter, and rediscovery."
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="group relative overflow-hidden rounded-lg aspect-[3/4] bg-ink-soft border border-white/5"
              >
                <img 
                  src={ourStory2Img} 
                  alt="Teenager smiling with elderly mentor" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: What Guides Us (Values Grid & Interaction) */}
      <section className="relative w-full bg-ink-soft py-24 md:py-36 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left Sticky Column */}
            <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit">
              <span className="text-xs uppercase tracking-[0.3em] text-[#c5a880] mb-3 block">Our Pillars</span>
              <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-6 uppercase tracking-wider leading-tight">
                What Guides Us
              </h2>
              <p className="text-sm text-white/60 leading-relaxed font-light">
                These core values form the foundation of every dialogue, project, and workshop we build. They ensure that we honor the past while embracing the vitality of the future.
              </p>
            </div>

            {/* Right Scrollable Values Cards */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((val, idx) => (
                <motion.div
                  key={val.num}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="group relative bg-ink p-8 rounded-xl border border-white/5 backdrop-blur-sm transition-all duration-300 hover:border-[#c5a880]/30 hover:shadow-lg hover:shadow-black/40"
                >
                  <div className="font-display text-4xl text-[#c5a880] font-light mb-6">
                    {val.num}
                  </div>
                  <h3 className="font-display text-xl text-white font-medium mb-3 group-hover:text-amber-100 transition-colors">
                    {val.title}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed font-light group-hover:text-white/80 transition-colors">
                    {val.desc}
                  </p>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: Inspirational Quotes (Monochrome Textured Backdrop with Slideshow) */}
      <section className="relative w-full h-[85vh] min-h-[550px] flex items-center justify-center overflow-hidden">
        
        {/* Full screen monochrome backdrop */}
        <div className="absolute inset-0 z-0">
          <img 
            src={quotesBgImg} 
            alt="Monochrome terraced fields landscape" 
            className="w-full h-full object-cover grayscale opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink" />
          <div className="absolute inset-0 bg-black/60 mix-blend-multiply" />
        </div>

        {/* Decorative central geometric icon */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 pointer-events-none">
          <div className="w-8 h-8 rounded-full border border-[#c5a880]/35 flex items-center justify-center rotate-45">
            <span className="w-1.5 h-1.5 bg-[#c5a880]" />
          </div>
          <span className="text-[0.6rem] tracking-[0.5em] text-[#c5a880]/60 uppercase mt-2">C.C</span>
        </div>

        {/* Quotes Slider Container */}
        <div className="relative z-10 w-full max-w-4xl px-6 text-center">
          <div className="min-h-[220px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuote}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-8"
              >
                <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl font-light italic text-white leading-relaxed tracking-wide px-4 md:px-12">
                  "{quotes[currentQuote].text}"
                </blockquote>
                
                <div className="space-y-1">
                  <cite className="not-italic text-sm tracking-widest uppercase font-medium text-[#c5a880]">
                    {quotes[currentQuote].author}
                  </cite>
                  <p className="text-xs text-white/40 tracking-wider">
                    {quotes[currentQuote].role}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="mt-12 flex items-center justify-center gap-3">
            {quotes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuote(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentQuote === idx ? "w-8 bg-[#c5a880]" : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Subtle arrow hooks (Left/Right) for tactile navigation */}
        <button
          onClick={() => setCurrentQuote((prev) => (prev - 1 + quotes.length) % quotes.length)}
          aria-label="Previous quote"
          className="absolute left-6 md:left-12 z-20 w-12 h-12 rounded-full border border-white/5 hover:border-white/20 hover:bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-all duration-300"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => setCurrentQuote((prev) => (prev + 1) % quotes.length)}
          aria-label="Next quote"
          className="absolute right-6 md:right-12 z-20 w-12 h-12 rounded-full border border-white/5 hover:border-white/20 hover:bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-all duration-300"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

      </section>

    </div>
  );
}
