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
    text: "Trong không gian nơi người trẻ và người lớn tuổi gặp gỡ, chúng ta không chỉ chia sẻ câu chuyện — mà còn chữa lành khoảng cách giữa những thời đại.",
    author: "Nguyễn Quang Linh",
    role: "Nhà sáng lập CHẠM CỘI",
  },
  {
    text: "Lắng nghe những câu chuyện của các cụ khiến tôi nhận ra rằng những trăn trở của chúng ta không hề mới, và sức mạnh của các cụ là kim chỉ nam cho con đường phía trước.",
    author: "Lê Minh Thư",
    role: "Người trẻ tham gia (17 tuổi)",
  },
  {
    text: "Trí tuệ không phải là di vật của quá khứ, mà là ánh sáng cho tương lai khi được gửi gắm trong đôi tay của người trẻ.",
    author: "Bác Nguyễn Văn Hai",
    role: "Người hướng dẫn cao niên (74 tuổi)",
  },
];

type Value = {
  num: string;
  title: string;
  desc: string;
};

const values: Value[] = [
  {
    num: "01",
    title: "Thấu cảm trước hết",
    desc: "Chúng tôi lắng nghe bằng cả sự chú ý sâu sắc, bắc cầu những thập kỷ giữa các thế hệ bằng sự kiên nhẫn, trái tim mở và sự tôn trọng lẫn nhau.",
  },
  {
    num: "02",
    title: "Tiếp nối văn hóa",
    desc: "Chúng tôi tin rằng nghệ thuật truyền thống và ký ức cá nhân là di sản sống, cần được hiện diện trong hiện tại chứ không cất giữ mãi trong quá khứ.",
  },
  {
    num: "03",
    title: "Cùng nhau trưởng thành",
    desc: "Sự kết nối là một con đường hai chiều. Người lớn tuổi trao truyền trí tuệ cả đời và nghề thủ công truyền thống, còn người trẻ góp phần năng lượng và tiếng nói thời đại số.",
  },
  {
    num: "04",
    title: "Biểu đạt chân thật",
    desc: "Dù qua tranh sơn mài, những câu chuyện được kể hay nghệ thuật số, chúng tôi khuyến khích sự tự thể hiện chân thật và sáng tạo.",
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
            alt="Tranh sơn mài giao thoa các thế hệ"
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
            alt="Cánh cổng bên trái" 
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
            alt="Cánh cổng bên phải" 
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
          <span className="text-xs uppercase tracking-[0.4em] text-[#c5a880] mb-3">Về CHẠM CỘI</span>
          <h1 className="font-display text-5xl md:text-7xl text-white">
            Vì Sao Chúng Tôi Tồn Tại
          </h1>
          {progress === 0 && (
            <p className="text-xs text-white/40 tracking-widest uppercase mt-8 animate-pulse">
              Cuộn xuống để mở
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
          <span className="text-xs uppercase tracking-[0.3em] text-[#c5a880] mb-4">Tầm nhìn</span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-6">
            Bắc Cầu Giữa Các Thế Hệ
          </h2>
          <p className="font-sans text-sm md:text-base text-white/80 leading-relaxed font-light mb-6">
            Mỗi người lớn tuổi là một thư viện sống của những câu chuyện, ký ức và nghề thủ công truyền thống. Thế nhưng, trong thế giới số hối hả, tiếng nói của các cụ thường chìm vào im lặng. Trong khi đó, người trẻ sở hữu nguồn năng lượng và công cụ vô tận để kiến tạo tương lai, nhưng lại khao khát một điểm tựa, một bản ngã và những dẫn dắt.
          </p>
          <p className="font-sans text-sm md:text-base text-[#c5a880]/90 leading-relaxed font-light">
            CHẠM CỘI là một cánh cổng dấn thân. Chúng tôi đưa người lớn tuổi và người trẻ cùng hòa điệu sáng tạo để chia sẻ những câu chuyện truyền miệng, dạy tranh sơn mài truyền thống và kiến tạo những mối liên kết bền vững — khôi phục sự liền mạch cho mạch nguồn văn hóa của chúng ta.
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
              Hành trình
            </motion.span>
            
            <h2 className="font-display text-5xl md:text-7xl font-light tracking-tight text-white leading-tight">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="italic text-[#c5a880]/90 mr-4 font-normal"
              >
                (Câu chuyện của chúng tôi)
              </motion.span>
              Tôn Vinh Di Sản
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
                  alt="Nghệ nhân cao niên dạy nghề sơn mài" 
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
                  Nơi truyện kể truyền miệng hòa vào toan vẽ.
                </h3>
                <p className="text-sm md:text-base text-white/70 leading-relaxed font-light">
                  Chúng tôi khởi đầu từ một nhóm nghệ sĩ và nhân viên xã hội địa phương, những người nhận thấy khoảng cách ngày càng lớn giữa các thế hệ tại vùng đô thị. Người lớn tuổi tâm sự về nỗi cô đơn, còn người trẻ cảm thấy xa lạ với chính di sản của mình. Chúng tôi nhận ra nghệ thuật có thể trở thành chất kết nối sâu sắc nhất.
                </p>
                <p className="text-sm md:text-base text-white/70 leading-relaxed font-light">
                  Bằng cách xoay quanh các buổi workshop nghệ thuật sơn mài truyền thống Việt Nam — một quá trình chậm rãi, thiền định đòi hỏi nhiều lớp sơn, sự khô dần và đánh bóng — chúng tôi tạo ra một không gian tự nhiên cho những cuộc trò chuyện. Khi đôi tay chạm vào vàng lá và nhựa cây, những câu chuyện tự khắc tuôn chảy.
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
                <p className="text-sm text-[#c5a880] tracking-widest uppercase">Đốm lửa khởi nguyên</p>
                <p className="text-sm md:text-base text-white/80 leading-relaxed font-light">
                  "Nhìn ánh mắt một người trẻ sáng lên khi được học một nét cọ từ một bà cụ, và thấy bà cụ ấy cảm thấy được trân trọng — đó là lý do chúng tôi dấn thân vào điều này. Đó là một cuộc đối thoại của sự im lặng, tiếng cười và sự tái khám phá."
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
                  alt="Người trẻ cười bên người hướng dẫn cao niên" 
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
              <span className="text-xs uppercase tracking-[0.3em] text-[#c5a880] mb-3 block">Giá trị nền tảng</span>
              <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-6 uppercase tracking-wider leading-tight">
                Điều dẫn dắt chúng ta
              </h2>
              <p className="text-sm text-white/60 leading-relaxed font-light">
                Những giá trị cốt lõi này là nền tảng cho mọi cuộc đối thoại, dự án và buổi workshop mà chúng tôi kiến tạo. Chúng đảm bảo rằng chúng tôi tôn vinh quá khứ, đồng thời đón nhận sức sống của tương lai.
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
            alt="Cảnh ruộng bậc thang đơn sắc" 
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
                aria-label={`Đến trích dẫn ${idx + 1}`}
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
          aria-label="Trích dẫn trước"
          className="absolute left-6 md:left-12 z-20 w-12 h-12 rounded-full border border-white/5 hover:border-white/20 hover:bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-all duration-300"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => setCurrentQuote((prev) => (prev + 1) % quotes.length)}
          aria-label="Trích dẫn tiếp theo"
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
