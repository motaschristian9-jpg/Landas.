import { Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SlideContent = ({ slide, config, isActive, centered }) => (
    <div
        className={`space-y-4 md:space-y-6 ${centered ? "flex flex-col items-center text-center" : "text-left md:text-left"}`}
    >
        <div
            className={`flex items-center gap-3 transition-all duration-700 ${isActive ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} ${centered ? "justify-center" : "justify-start md:justify-start"}`}
        >
            <div className="h-[1px] w-6 bg-current opacity-20"></div>
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-slate-400">
                {slide.motto}
            </p>
            <div className="h-[1px] w-6 bg-current opacity-20"></div>
        </div>

        <h2
            className={`${config.font} ${config.heading} transition-all duration-1000 delay-100 ${isActive ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"} ${centered ? "text-5xl md:text-7xl lg:text-8xl xl:text-9xl" : "text-4xl md:text-6xl lg:text-7xl xl:text-8xl"}`}
        >
            {slide.title.split(" ").map((word, i) => (
                <span key={i} className={i === 1 ? config.accent : ""}>
                    {word}
                    {centered ? " " : <br className="hidden md:block" />}{" "}
                </span>
            ))}
        </h2>

        <p
            className={`text-sm md:text-base lg:text-lg font-medium max-w-lg leading-relaxed transition-all duration-1000 delay-300 ${isActive ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} ${config.layout === "bento" ? "text-slate-400" : "text-slate-500"} ${centered ? "mx-auto" : ""}`}
        >
            {slide.description}
        </p>
    </div>
);

const AppMockup3D = ({ isActive, type = "emerald" }) => {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Ambient Background Glow */}
            <motion.div
                animate={
                    isActive
                        ? {
                              scale: [1, 1.2, 1],
                              opacity: [0.3, 0.5, 0.3],
                          }
                        : { opacity: 0 }
                }
                transition={{ duration: 4, repeat: Infinity }}
                className={`absolute inset-0 blur-[100px] rounded-full -z-10 ${type === "blue" ? "bg-blue-200" : "bg-emerald-200"}`}
            />

            <motion.div
                initial={{ rotateY: 0, rotateX: 0, y: 50, opacity: 0 }}
                animate={
                    isActive
                        ? {
                              rotateY: -12,
                              rotateX: 8,
                              y: [0, -10, 0],
                              opacity: 1,
                          }
                        : { rotateY: 0, rotateX: 0, y: 50, opacity: 0 }
                }
                transition={
                    isActive
                        ? {
                              y: {
                                  duration: 4,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                              },
                              default: {
                                  type: "spring",
                                  stiffness: 40,
                                  damping: 15,
                                  mass: 1,
                              },
                          }
                        : { duration: 0.5 }
                }
                className="relative z-10 w-full max-w-lg perspective-1000"
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Main App Container */}
                <div className="bg-slate-50 rounded-[2.5rem] p-3 md:p-4 shadow-2xl border-4 border-white overflow-hidden flex gap-3 h-[250px] md:h-[350px]">
                    {/* Sidebar Skeleton */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={isActive ? { x: 0, opacity: 1 } : {}}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="w-10 md:w-16 bg-white rounded-3xl p-3 flex flex-col items-center gap-4 shadow-sm"
                    >
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-slate-100 rounded-xl"></div>
                        <div className="flex-1 space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="w-5 h-5 md:w-6 md:h-6 bg-slate-50 rounded-lg"
                                ></div>
                            ))}
                        </div>
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-slate-100 rounded-full"></div>
                    </motion.div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col gap-3">
                        {/* Mastery HUD Skeleton */}
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={isActive ? { y: 0, opacity: 1 } : {}}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="h-10 md:h-14 bg-white rounded-3xl px-4 flex items-center justify-end gap-3 shadow-sm"
                        >
                            <div className="h-2 w-16 md:w-24 bg-slate-100 rounded-full"></div>
                            <div
                                className={`w-6 h-6 md:w-8 md:h-8 rounded-lg ${type === "blue" ? "bg-blue-500/20" : "bg-emerald-500/20"}`}
                            ></div>
                        </motion.div>

                        {/* Dashboard Grid */}
                        <div className="flex-1 grid grid-cols-2 gap-3">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={
                                    isActive ? { scale: 1, opacity: 1 } : {}
                                }
                                transition={{ delay: 0.9, duration: 0.8 }}
                                className={`rounded-[2rem] p-5 space-y-3 border flex flex-col items-center justify-center ${type === "blue" ? "bg-blue-50/50 border-blue-100/50" : "bg-emerald-50/50 border-emerald-100/50"}`}
                            >
                                <div className="h-2 w-12 bg-slate-200 rounded-full mb-2"></div>
                                <div
                                    className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl shadow-xl flex items-center justify-center ${type === "blue" ? "bg-blue-500" : "bg-emerald-500"}`}
                                >
                                    <div className="w-6 h-6 border-2 border-white/50 rounded-lg"></div>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={
                                    isActive ? { scale: 1, opacity: 1 } : {}
                                }
                                transition={{ delay: 1.1, duration: 0.8 }}
                                className="bg-white rounded-[2rem] p-5 space-y-3 border border-slate-100 shadow-sm"
                            >
                                <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                                <div className="h-2 w-2/3 bg-slate-50 rounded-full"></div>
                                <div className="flex gap-2 pt-2">
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="w-4 h-4 bg-slate-50 rounded-full"
                                        ></div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Vision Hub Card Mock */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={isActive ? { y: 0, opacity: 1 } : {}}
                            transition={{ delay: 1.3, duration: 0.8 }}
                            className="h-24 md:h-32 bg-white border-2 border-slate-50 rounded-[2rem] p-4 flex items-center gap-4 shadow-xl shadow-slate-100/50"
                        >
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-900 rounded-[1.2rem] flex items-center justify-center flex-shrink-0">
                                <div className="w-5 h-5 md:w-6 md:h-6 border-4 border-white/20 rounded-full"></div>
                            </div>
                            <div className="flex-1 space-y-3 min-w-0">
                                <div className="h-3 w-3/4 bg-slate-900 rounded-full"></div>
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full ${type === "blue" ? "bg-blue-500" : "bg-emerald-500"}`}
                                            animate={
                                                isActive
                                                    ? { width: "65%" }
                                                    : { width: "0%" }
                                            }
                                            transition={{
                                                delay: 2,
                                                duration: 2.5,
                                            }}
                                        />
                                    </div>
                                    <div className="h-1.5 w-1/4 bg-slate-100 rounded-full"></div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Floating Decoration */}
                <motion.div
                    animate={
                        isActive ? { y: [0, -15, 0], rotate: [0, 5, 0] } : {}
                    }
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className={`absolute -top-6 -right-6 w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl flex items-center justify-center ${type === "blue" ? "bg-blue-500 shadow-blue-200" : "bg-emerald-500 shadow-emerald-200"}`}
                >
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full blur-sm"></div>
                    <div className="absolute w-5 h-5 md:w-6 md:h-6 bg-white/80 rounded-lg rotate-45"></div>
                </motion.div>
            </motion.div>

            {/* Floor Reflection */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={
                    isActive
                        ? { opacity: 0.1, scale: 1.1 }
                        : { opacity: 0, scale: 0.5 }
                }
                className={`absolute bottom-[-10%] w-[120%] h-24 blur-3xl rounded-full -z-20 ${type === "blue" ? "bg-blue-400" : "bg-emerald-400"}`}
            />
        </div>
    );
};

export default function Welcome({ auth }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(1);
    const [dragStartX, setDragStartX] = useState(null);
    const [dragOffset, setDragOffset] = useState(0);

    const slides = [
        {
            title: "Welcome to Landas",
            motto: "The Path to Mastery",
            description:
                "A productivity system designed for those who value focus over noise. Organize your life in blocks of pure intent.",
            icon: "🏔️",
            color: "text-emerald-500",
            image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000",
        },
        {
            title: "Bento Organization",
            motto: "Visual Clarity",
            description:
                "Break down your grand ambitions into bite-sized, actionable goals using our signature bento-grid interface.",
            icon: "🍱",
            color: "text-emerald-500",
            image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=1000",
        },
        {
            title: "Absolute Focus",
            motto: "Deep Work Only",
            description:
                "Minimalist by design, powerful by function. Landas removes the clutter so you can focus on what truly moves the needle.",
            icon: "⚡",
            color: "text-emerald-500",
            image: "https://images.unsplash.com/photo-1506784919141-91001e400192?auto=format&fit=crop&q=80&w=1000",
        },
        {
            title: "Ready to Start?",
            motto: "Your Future Awaits",
            description:
                "Join a community of high-performers who are defining their own destiny. Your new productivity habit starts now.",
            icon: "🎯",
            color: "text-slate-900",
            isFinal: true,
        },
    ];

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setDirection(1);
            setCurrentSlide(currentSlide + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setDirection(-1);
            setCurrentSlide(currentSlide - 1);
        }
    };

    const handleDragStart = (e) => {
        setDragStartX(e.clientX || e.touches?.[0].clientX);
    };

    const handleDragMove = (e) => {
        if (dragStartX === null) return;
        const currentX =
            e.clientX !== undefined ? e.clientX : e.touches?.[0].clientX;
        let offset = currentX - dragStartX;

        if (currentSlide === 0 && offset > 0) {
            offset = offset / 4;
        } else if (currentSlide === slides.length - 1 && offset < 0) {
            offset = offset / 4;
        }

        setDragOffset(offset);
    };

    const handleDragEnd = () => {
        if (dragStartX === null) return;

        const threshold = window.innerWidth * 0.15;
        if (dragOffset < -threshold) {
            nextSlide();
        } else if (dragOffset > threshold) {
            prevSlide();
        }

        setDragStartX(null);
        setDragOffset(0);
    };

    // Global listeners to prevent "sticky" drag
    useEffect(() => {
        if (dragStartX !== null) {
            window.addEventListener("mousemove", handleDragMove);
            window.addEventListener("mouseup", handleDragEnd);
            window.addEventListener("touchmove", handleDragMove);
            window.addEventListener("touchend", handleDragEnd);
        }

        return () => {
            window.removeEventListener("mousemove", handleDragMove);
            window.removeEventListener("mouseup", handleDragEnd);
            window.removeEventListener("touchmove", handleDragMove);
            window.removeEventListener("touchend", handleDragEnd);
        };
    }, [dragStartX, dragOffset]);

    return (
        <div
            className={`min-h-screen bg-white font-sans overflow-hidden select-none cursor-${dragStartX !== null ? "grabbing" : "grab"}`}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
        >
            <Head title="Welcome to Landas" />

            {/* Fixed Brand Logo */}
            <div className="fixed top-6 left-6 md:top-12 md:left-12 z-50 flex items-center gap-3 md:gap-4 group">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-200 group-hover:rotate-12 transition-transform duration-500">
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-white rounded-md md:rounded-lg"></div>
                </div>
                <span
                    className={`text-xl md:text-2xl font-black tracking-tighter uppercase tracking-[0.3em] transition-colors duration-1000 ${currentSlide === 3 ? "text-white" : "text-slate-800"}`}
                >
                    Landas<span className="text-emerald-500">.</span>
                </span>
            </div>

            {/* Slides Container - Draggable Content */}
            <div
                className="relative h-screen flex items-center transition-transform duration-300 ease-out"
                style={{ transform: `translateX(${dragOffset}px)` }}
            >
                {slides.map((slide, index) => {
                    const isActive = index === currentSlide;

                    // Custom styles per section
                    const sectionConfigs = [
                        {
                            layout: "split", // Standard 60/40
                            heading: "text-slate-800",
                            accent: "text-emerald-500",
                            font: "font-[900] tracking-tighter leading-[0.85]",
                            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2000",
                        },
                        {
                            layout: "reverse", // 40/60 Reverse
                            heading: "text-slate-900",
                            accent: "text-emerald-500",
                            font: "font-black tracking-tight leading-[0.9]",
                            image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&q=80&w=2000",
                        },
                        {
                            layout: "center", // Focused Centered
                            heading: "text-slate-900",
                            accent: "text-emerald-500",
                            font: "font-extrabold tracking-tighter leading-none",
                            image: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=2000",
                        },
                        {
                            layout: "bento", // Balanced final screen
                            heading: "text-white",
                            accent: "text-emerald-400",
                            font: "font-black uppercase tracking-tighter leading-[0.8]",
                            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000",
                        },
                    ];

                    const config = sectionConfigs[index];

                    return (
                        <div
                            key={index}
                            className={`absolute inset-0 flex transition-all duration-1000 ease-in-out ${
                                isActive
                                    ? "opacity-100 translate-x-0 z-10"
                                    : index < currentSlide
                                      ? "opacity-0 -translate-x-full z-0"
                                      : "opacity-0 translate-x-full z-0"
                            }`}
                        >
                            {config.layout === "split" && (
                                <div className="w-full h-full flex flex-col md:flex-row bg-white overflow-y-auto md:overflow-hidden">
                                    <div className="w-full md:w-[60%] flex flex-col justify-center p-8 pt-28 md:p-16 lg:p-24 xl:p-32">
                                        <SlideContent
                                            slide={slide}
                                            config={config}
                                            isActive={isActive}
                                        />
                                    </div>
                                    <div className="w-full md:w-[40%] flex items-center justify-center p-8 md:p-12 lg:p-20 relative min-h-[450px] md:min-h-0 select-none">
                                        {index === 0 ? (
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    y: 100,
                                                    scale: 1.1,
                                                    rotate: -5,
                                                }}
                                                animate={
                                                    isActive
                                                        ? {
                                                              opacity: 1,
                                                              y: 0,
                                                              scale: 1.4,
                                                              rotate: 0,
                                                          }
                                                        : {}
                                                }
                                                transition={{
                                                    duration: 1.5,
                                                    ease: [0.16, 1, 0.3, 1],
                                                    delay: 0.2,
                                                }}
                                                className="relative z-20 w-full max-w-2xl md:-ml-12 lg:-ml-24 pointer-events-none"
                                            >
                                                {/* Floating Dynamic Shadow (Grounding) */}
                                                <div className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 w-2/3 h-12 bg-emerald-900/5 blur-3xl rounded-full"></div>

                                                <img
                                                    src="/images/welcome-doodle-transparent.png"
                                                    draggable="false"
                                                    className="w-full h-auto mix-blend-multiply drop-shadow-[0_20px_40px_rgba(16,185,129,0.08)] select-none pointer-events-none"
                                                    alt="Welcome Character"
                                                />
                                            </motion.div>
                                        ) : (
                                            <AppMockup3D isActive={isActive} />
                                        )}
                                    </div>
                                </div>
                            )}

                            {config.layout === "reverse" && (
                                <div className="w-full h-full flex flex-col md:flex-row-reverse bg-white overflow-y-auto md:overflow-hidden">
                                    <div className="w-full md:w-[60%] flex flex-col justify-center p-8 pt-28 md:p-16 lg:p-24 xl:p-32">
                                        <SlideContent
                                            slide={slide}
                                            config={config}
                                            isActive={isActive}
                                        />
                                    </div>
                                    <div className="w-full md:w-[40%] flex items-center justify-center p-8 md:p-12 lg:p-20 overflow-hidden relative min-h-[300px] md:min-h-0">
                                        <AppMockup3D
                                            isActive={isActive}
                                            type="emerald"
                                        />
                                    </div>
                                </div>
                            )}

                            {config.layout === "center" && (
                                <div className="w-full h-full flex items-center justify-center bg-white p-8 pt-28 md:p-16 lg:p-32 relative overflow-hidden">
                                    <div className="max-w-5xl text-center relative z-10 px-6 md:px-12">
                                        <SlideContent
                                            slide={slide}
                                            config={config}
                                            isActive={isActive}
                                            centered
                                        />
                                    </div>
                                </div>
                            )}

                            {config.layout === "bento" && (
                                <div className="w-full h-full flex flex-col md:flex-row bg-slate-900 overflow-y-auto md:overflow-hidden">
                                    <div className="w-full md:w-[50%] flex flex-col justify-center p-8 pt-28 md:p-16 lg:p-24 xl:p-32">
                                        <SlideContent
                                            slide={slide}
                                            config={config}
                                            isActive={isActive}
                                        />
                                    </div>
                                    <div className="w-full md:w-[50%] flex flex-col items-center justify-center p-12 md:p-16 lg:p-24 xl:p-32 relative min-h-[400px] md:min-h-0">
                                        <div className="absolute inset-0 opacity-20">
                                            <img
                                                src={config.image}
                                                className="w-full h-full object-cover"
                                                alt="bg"
                                            />
                                        </div>
                                        <div className="relative z-10 flex flex-col gap-4 md:gap-6 w-full max-w-xs md:max-w-sm">
                                            <Link
                                                href={route("register")}
                                                className="px-10 py-6 md:px-12 md:py-8 bg-emerald-500 text-white rounded-[2rem] md:rounded-[2.5rem] text-xs md:text-sm font-black uppercase tracking-[0.2em] hover:scale-105 transition-all text-center"
                                            >
                                                Create Account
                                            </Link>
                                            <Link
                                                href={route("login")}
                                                className="px-10 py-6 md:px-12 md:py-8 bg-white/5 backdrop-blur-xl border-2 border-white/10 text-white rounded-[2rem] md:rounded-[2.5rem] text-xs md:text-sm font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all text-center"
                                            >
                                                Sign In
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Progress Indicators - True Bottom Center */}
            <div
                className={`fixed bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-3 z-[100] backdrop-blur-xl px-6 py-4 md:px-8 md:py-5 rounded-full border-2 transition-all duration-1000 ${
                    currentSlide === 3
                        ? "bg-white/10 border-white/20 shadow-none"
                        : "bg-white/40 border-white/50 shadow-2xl"
                }`}
            >
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            setDirection(i > currentSlide ? 1 : -1);
                            setCurrentSlide(i);
                        }}
                        className={`h-2 md:h-2.5 rounded-full transition-all duration-700 ${
                            i === currentSlide
                                ? "w-10 md:w-16 bg-emerald-500"
                                : currentSlide === 3
                                  ? "w-2 md:w-3 bg-white/20"
                                  : "w-2 md:w-3 bg-slate-200"
                        }`}
                    />
                ))}
            </div>

            {/* Left/Right Controls - Hidden on mobile, Flex on md+ */}
            <div className="hidden md:flex fixed inset-y-0 left-4 md:left-10 items-center z-[100]">
                <button
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className={`w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                        currentSlide === 0
                            ? "opacity-0 scale-50 pointer-events-none"
                            : currentSlide === 3
                              ? "bg-transparent text-white/30 border-2 border-transparent hover:bg-white/10 hover:text-white hover:border-white/20 hover:backdrop-blur-xl"
                              : "bg-transparent text-slate-300 border-2 border-transparent hover:bg-white hover:text-slate-800 hover:shadow-2xl hover:border-slate-50 active:scale-90"
                    }`}
                >
                    <svg
                        className="w-6 h-6 md:w-8 md:h-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>
            </div>

            <div className="hidden md:flex fixed inset-y-0 right-4 md:right-10 items-center z-[100]">
                <button
                    onClick={nextSlide}
                    disabled={currentSlide === slides.length - 1}
                    className={`w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                        currentSlide === slides.length - 1
                            ? "opacity-0 scale-50 pointer-events-none"
                            : currentSlide === 3
                              ? "bg-transparent text-white/30 border-2 border-transparent hover:bg-white/10 hover:text-white hover:border-white/20 hover:backdrop-blur-xl"
                              : "bg-transparent text-slate-300 border-2 border-transparent hover:bg-white hover:text-slate-800 hover:shadow-2xl hover:border-slate-50 active:scale-90"
                    }`}
                >
                    <svg
                        className="w-6 h-6 md:w-8 md:h-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}
