"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// ── Constants ────────────────────────────────────────
const LETTERS = ["W", "E", "L", "C", "O", "M", "E", " ", "I", "T", "Z", "F", "I", "Z", "Z"];
const STATS = [
    { id: "box1", value: "58%", label: "Increase in pick-up point use", bg: "bg-[#def54f]", text: "text-[#111]", pos: "top-[5%] right-[30%]" },
    { id: "box2", value: "23%", label: "Decrease in customer phone calls", bg: "bg-[#6ac9ff]", text: "text-[#111]", pos: "bottom-[5%] right-[35%]" },
    { id: "box3", value: "27%", label: "Increase in delivery speed", bg: "bg-[#333]", text: "text-white", pos: "top-[5%] right-[10%]" },
    { id: "box4", value: "40%", label: "Decrease in support tickets", bg: "bg-[#fa7328]", text: "text-[#111]", pos: "bottom-[5%] right-[12%]" },
];

export default function HeroSection() {
    const sectionRef = useRef(null);
    const trackRef = useRef(null);
    const carRef = useRef(null);
    const trailRef = useRef(null);
    const brandRef = useRef(null);
    const scrollHintRef = useRef(null);
    const letterRefs = useRef([]);
    const letterOffsets = useRef([]);

    /** Measure each letter's left edge in viewport coordinates */
    const measureLetters = () => {
        letterOffsets.current = letterRefs.current.map(
            (el) => el?.getBoundingClientRect().left ?? 0
        );
    };

    useEffect(() => {
        const car = carRef.current;
        const trail = trailRef.current;
        const brand = brandRef.current;
        const hint = scrollHintRef.current;
        const letters = letterRefs.current.filter(Boolean);

        // ── Sizes ──────────────────────────────────────────
        const CAR_W = car.offsetWidth || 150;
        const vpW = window.innerWidth;
        const startX = -CAR_W;
        const endX = vpW;

        gsap.set(car, { x: startX });

        // ── Load Timeline ──────────────────────────────────
        const tl = gsap.timeline({
            delay: 0.15,
            onComplete() {
                measureLetters();
                gsap.set(letters, { opacity: 0 });
            },
        });

        tl.to(brand, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
        tl.to(
            letters,
            { opacity: 1, y: 0, duration: 0.55, stagger: 0.04, ease: "power3.out" },
            "-=0.35"
        );
        tl.to(hint, { opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.1");

        // ── Scroll-Driven Car ──────────────────────────────
        gsap.to(car, {
            x: endX,
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "bottom top",
                scrub: 1,
                pin: trackRef.current,
                onUpdate(self) {
                    const progress = self.progress;
                    const carLeft = startX + (endX - startX) * progress;
                    const carFrontX = carLeft + CAR_W;

                    // Trail
                    gsap.set(trail, { width: Math.max(0, carFrontX) });

                    // Letter reveal
                    if (letterOffsets.current.length) {
                        letters.forEach((el, i) => {
                            el.style.opacity = carFrontX >= letterOffsets.current[i] ? "1" : "0";
                        });
                    }

                    // Hide scroll hint
                    if (progress > 0.02) gsap.set(hint, { opacity: 0 });
                },
            },
        });

        // ── Stat Boxes ─────────────────────────────────────
        const boxes = [
            { id: "#box1", start: "top+=300 top", end: "top+=550 top" },
            { id: "#box2", start: "top+=500 top", end: "top+=750 top" },
            { id: "#box3", start: "top+=700 top", end: "top+=950 top" },
            { id: "#box4", start: "top+=900 top", end: "top+=1150 top" },
        ];
        boxes.forEach(({ id, start, end }) => {
            gsap.to(id, {
                opacity: 1,
                y: 0,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start,
                    end,
                    scrub: true,
                },
            });
        });

        // ── Resize ──────────────────────────────────────────
        const onResize = () => {
            measureLetters();
            ScrollTrigger.refresh();
        };
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
            ScrollTrigger.getAll().forEach((st) => st.kill());
        };
    }, []);

    return (
        <>
            {/* ── Hero Section (200vh scroll space) ── */}
            <div ref={sectionRef} className="relative" style={{ height: "200vh", background: "var(--bg)" }}>

                {/* Sticky Track */}
                <div
                    ref={trackRef}
                    className="sticky top-0 w-full overflow-hidden"
                    style={{ height: "100vh", background: "var(--track-bg)" }}
                >
                    {/* Brand Strip */}
                    <div
                        ref={brandRef}
                        className="absolute top-8 left-0 right-0 flex justify-start items-center px-12 z-20"
                        style={{ opacity: 0, transform: "translateY(-16px)" }}
                    >
                        <span className="text-[#111] font-black tracking-[0.18em] uppercase text-lg">
                            ITZFIZZ
                        </span>
                    </div>

                    {/* Road */}
                    <div
                        className="road absolute left-0 w-screen overflow-hidden"
                        style={{
                            height: "300px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "var(--road-bg)",
                            borderTop: "2px solid #2c2c30",
                            borderBottom: "2px solid #2c2c30",
                            boxShadow: "inset 0 8px 30px rgba(0,0,0,0.5), inset 0 -8px 30px rgba(0,0,0,0.5)",
                        }}
                    >
                        {/* Headline – lives inside the road */}
                        <div
                            className="absolute pointer-events-none flex items-center justify-between z-[5]"
                            style={{ top: "50%", left: 0, right: 0, transform: "translateY(-50%)", padding: "0 2vw" }}
                        >
                            {LETTERS.map((ch, i) => (
                                <span
                                    key={i}
                                    ref={(el) => (letterRefs.current[i] = el)}
                                    className="font-black leading-none"
                                    style={{
                                        fontSize: "clamp(2.5rem, 5.5vw, 7rem)",
                                        color: "#d1d1d1",
                                        opacity: 0,
                                        flex: 1,
                                        textAlign: "center",
                                        textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                                        display: "inline-block",
                                        whiteSpace: "pre",
                                    }}
                                >
                                    {ch}
                                </span>
                            ))}
                        </div>

                        {/* Car */}
                        <Image
                            ref={carRef}
                            src="/car.png"
                            alt="McLaren top view"
                            width={270}
                            height={270}
                            className="absolute z-10"
                            style={{
                                top: "50%",
                                left: 0,
                                transform: "translateY(-50%)",
                                filter: "drop-shadow(0 0 18px rgba(69,219,125,0.35))",
                                willChange: "transform",
                                height: "270px",
                                width: "auto",
                            }}
                            priority
                        />

                        {/* Trail */}
                        <div
                            ref={trailRef}
                            className="trail absolute top-0 left-0 z-[1] pointer-events-none"
                            style={{
                                height: "100%",
                                width: 0,
                                background:
                                    "linear-gradient(to right, rgba(69,219,125,0.2), rgba(69,219,125,0.55))",
                            }}
                        />
                    </div>

                    {/* Stat Boxes */}
                    {STATS.map(({ id, value, label, bg, text, pos }) => (
                        <div
                            key={id}
                            id={id}
                            className={`absolute z-[15] flex flex-col gap-1.5 rounded-2xl ${bg} ${text} ${pos}`}
                            style={{
                                padding: "1.4rem 1.8rem",
                                opacity: 0,
                                transform: "translateY(12px)",
                                minWidth: "190px",
                            }}
                        >
                            <span className="text-[3.4rem] font-black leading-none tracking-tight">{value}</span>
                            <span className="text-xs font-semibold uppercase tracking-wide opacity-85 max-w-[155px] leading-snug">
                                {label}
                            </span>
                        </div>
                    ))}

                    {/* Scroll Hint */}
                    <div
                        ref={scrollHintRef}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
                        style={{ opacity: 0, color: "#555", fontSize: "0.7rem", letterSpacing: "0.15em" }}
                    >
                        <div
                            className="flex justify-center"
                            style={{
                                width: 22,
                                height: 35,
                                border: "2px solid #555",
                                borderRadius: 11,
                                paddingTop: 5,
                            }}
                        >
                            <div
                                className="mouse-dot rounded-sm"
                                style={{ width: 3, height: 7, background: "#555" }}
                            />
                        </div>
                        <span className="uppercase tracking-widest text-[0.7rem]">Scroll</span>
                    </div>
                </div>
            </div>

            {/* ── Below Fold ── */}
            <div
                className="flex flex-col items-center justify-center text-center gap-4 py-24 px-8 min-h-[60vh]"
                style={{ background: "linear-gradient(to bottom, var(--bg), #0a0a0c)" }}
            >
                <h2
                    className="font-black tracking-tight"
                    style={{
                        fontSize: "clamp(2rem, 4vw, 3.5rem)",
                        background: "linear-gradient(135deg, #def54f, #45db7d)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}
                >
                    Drive the Future of Delivery
                </h2>
                <p className="max-w-lg leading-relaxed" style={{ color: "var(--text-dim)" }}>
                    ITZFIZZ reimagines last-mile logistics with real-time intelligence,
                    customer transparency, and blazing-fast routes.
                </p>
            </div>
        </>
    );
}
