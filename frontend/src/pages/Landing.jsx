import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Map,
  ThermometerSun,
  Waves,
  Users,
  Sprout,
  ArrowRight,
  Database,
  BrainCircuit,
  Globe,
} from "lucide-react";
import Button from "../components/common/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/common/Card";
import Threads from "../components/common/Threads";

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  const heroGlowRef = useRef(null);
  const scrollContainerRef = useRef(null);

  
  useEffect(() => {
    const ctx = gsap.context(() => {
      
      if (heroGlowRef.current) {
        gsap.to(heroGlowRef.current, {
          scale: 0.3,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: heroGlowRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      
      gsap.utils.toArray(".gsap-section").forEach((section) => {
        gsap.fromTo(
          section,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      });
    }, scrollContainerRef);

    return () => ctx.revert();
  }, []);

  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  return (
    <div
      ref={scrollContainerRef}
      className="bg-base-950 min-h-screen text-white overflow-hidden selection:bg-primary-500/30"
    >
      
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 flex flex-col items-center justify-center min-h-[90vh]">
        
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
          <Threads
            amplitude={0.9}
            speed={0.4}
            threadCount={25}
            color="99,102,241"
            className=""
          />
          <div
            ref={heroGlowRef}
            className="absolute w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-[120px] opacity-50 mix-blend-screen"
          />
        </div>

        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center space-y-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeIn}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-medium text-primary-400 mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            UrbanInsight AI v2.0 — Live
          </motion.div>

          <motion.h1
            variants={fadeIn}
            className="text-5xl md:text-7xl font-semibold tracking-tight leading-tight"
          >
            Urban planning, <br className="hidden md:block" />
            <span className="font-heading italic font-normal text-base-300">
              but smarter.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeIn}
            className="text-lg md:text-xl text-base-400 font-body max-w-2xl mx-auto leading-relaxed"
          >
            A prescriptive WebGIS platform powered by Geospatial AI and
            Reinforcement Learning. We don't just predict urban heat and
            floods—we tell you exactly where to act.
          </motion.p>

          <motion.div
            variants={fadeIn}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link to="/map">
              <Button size="lg" leftIcon={Map} className="shadow-primary/20">
                Launch Map Explorer
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="secondary" size="lg" className="group">
                Read Methodology
                <ArrowRight className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      
      <section className="gsap-section py-24 px-6 border-y border-white/5 bg-base-900/50 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-3xl font-semibold">
              Conventional tools are descriptive.
              <br />{" "}
              <span className="text-base-300">
                UrbanInsight is{" "}
                <span className="font-heading italic font-normal text-primary-400">
                  prescriptive.
                </span>
              </span>
            </h2>
            <p className="text-base-400 max-w-2xl mx-auto">
              Indonesian cities face extreme climate pressures. Visualizing the
              problem is no longer enough; we need actionable intelligence.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {[
              {
                title: "Urban Heat Islands",
                desc: "Surface temperatures rising 1-7°C in concrete-heavy areas with low vegetation.",
                icon: ThermometerSun,
                color: "text-red-400",
              },
              {
                title: "Flood Risks",
                desc: "Extreme rainfall combining with poor drainage and high imperviousness.",
                icon: Waves,
                color: "text-blue-400",
              },
              {
                title: "Green Deserts",
                desc: "Unequal access to green spaces, disproportionately affecting dense neighborhoods.",
                icon: Users,
                color: "text-emerald-400",
              },
            ].map((problem, i) => (
              <motion.div key={i} variants={fadeIn} className="h-full">
                <Card className="h-full flex flex-col items-start text-left">
                  <CardHeader>
                    <div
                      className={`p-3 rounded-lg bg-white/5 border border-white/5 mb-4 w-fit ${problem.color}`}
                    >
                      <problem.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{problem.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm leading-relaxed">
                      {problem.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      
      <section className="gsap-section py-32 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="space-y-4"
          >
            <h2 className="text-3xl font-semibold">The Four Pillars</h2>
            <p className="text-base-400 max-w-xl">
              Combining high-resolution geospatial data with AI-powered tree
              placement optimization.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="md:col-span-2">
              <Card className="h-full min-h-[180px]">
                <CardContent className="flex flex-col p-8">
                  <ThermometerSun className="w-7 h-7 text-red-500 mb-4" />
                  <CardTitle className="text-xl mb-2">Urban Heat Prediction</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    Computing Land Surface Temperature (LST) per grid cell
                    using Open-Meteo weather, GHSL building data, and ESA WorldCover.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="h-full min-h-[180px]">
                <CardContent className="flex flex-col p-8">
                  <Waves className="w-7 h-7 text-blue-500 mb-4" />
                  <CardTitle className="text-xl mb-2">Flood Risk Modeling</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    Composite scoring based on building density, water proximity,
                    and real-time weather data from Open-Meteo.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="h-full min-h-[180px]">
                <CardContent className="flex flex-col p-8">
                  <Users className="w-7 h-7 text-emerald-500 mb-4" />
                  <CardTitle className="text-xl mb-2">Green Equity Index</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    Measuring spatial inequality of urban green space access
                    per grid cell across the city.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn} className="md:col-span-2">
              <Card className="h-full min-h-[200px] relative group overflow-hidden border-primary-500/30 bg-primary-950/20">
                <div className="absolute inset-0 bg-linear-to-br from-primary-600/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <CardContent className="flex flex-col p-8 relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Sprout className="w-8 h-8 text-primary-400" />
                    <span className="px-2 py-1 text-[10px] uppercase tracking-wider font-semibold bg-primary-500/20 text-primary-300 rounded-sm border border-primary-500/30">
                      Core Innovation
                    </span>
                  </div>
                  <CardTitle className="text-2xl mb-3">RL Optimal Tree Placement</CardTitle>
                  <CardDescription className="text-base max-w-lg text-base-300 leading-relaxed">
                    A Greedy RL Agent that recommends optimal planting locations
                    to simultaneously reduce heat (−0.5–1.5°C), mitigate floods
                    (3–11%), and improve green equity (+2–8 pts) under budget constraints.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      
      <section className="py-24 px-6 border-t border-white/5 bg-base-900/30">
        <div className="max-w-5xl mx-auto text-center space-y-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-semibold mb-4">How It Works</h2>
            <p className="text-base-400">
              A seamless 3-tier pipeline transforming raw geospatial data into
              actionable recommendations.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0" />

            {[
              {
                icon: Database,
                title: "Data Ingestion",
                desc: "Open-Meteo, WorldPop, GHSL, ESA WorldCover",
              },
              {
                icon: BrainCircuit,
                title: "Geospatial AI",
                desc: "Microclimate Synthesis & RL Engine",
              },
              {
                icon: Globe,
                title: "Prescriptive WebGIS",
                desc: "Interactive Simulation & Maps",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="relative z-10 flex-1 w-full"
              >
                <Card className="h-full bg-base-950 hover:bg-base-900 transition-colors">
                  <CardContent className="flex flex-col items-center p-6">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                      <step.icon className="w-5 h-5 text-base-300" />
                    </div>
                    <CardTitle className="mb-2 text-center text-lg">
                      {step.title}
                    </CardTitle>
                    <CardDescription className="text-center">
                      {step.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      
      <section className="gsap-section py-24 px-6 bg-base-900/30 border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-primary-900/10 mask-[radial-gradient(ellipse_at_top,#000_10%,transparent_70%)]" />
        <motion.div
          className="relative z-10 max-w-3xl mx-auto text-center space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-4xl md:text-5xl font-semibold">
            Don't just see the problem.
            <br />
            <span className="text-primary-400 italic font-heading font-normal">
              Solve it.
            </span>
          </h2>
          <p className="text-base-400 text-lg">
            Start exploring the intelligence layer for sustainable cities.
          </p>
          <Link to="/map" className="inline-block pt-4">
            <Button size="lg" variant="primary" leftIcon={Map}>
              Enter UrbanInsight Platform
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
