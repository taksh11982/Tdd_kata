import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const useInView = (options) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.15, ...options });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isInView];
};

const useCounter = (end, duration, start) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [start, end, duration]);

  return count;
};

const floatingOrbs = [
  { size: 500, color: 'from-blue-600/20 to-indigo-600/10', left: '-10%', top: '-10%', delay: '0s', duration: '8s' },
  { size: 400, color: 'from-purple-600/15 to-pink-600/5', right: '-5%', top: '20%', delay: '2s', duration: '10s' },
  { size: 300, color: 'from-emerald-600/10 to-teal-600/5', left: '30%', bottom: '0%', delay: '4s', duration: '12s' },
];

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Lightning Fast',
    desc: 'Instant search and real-time inventory updates across your entire dealership.',
    gradient: 'from-blue-500 to-indigo-600',
    shadow: 'shadow-blue-500/20',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Secure & Reliable',
    desc: 'JWT authentication with role-based access control keeps your data safe.',
    gradient: 'from-emerald-500 to-teal-600',
    shadow: 'shadow-emerald-500/20',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: 'Smart Analytics',
    desc: 'Real-time stats, stock levels, and category breakdowns at a glance.',
    gradient: 'from-purple-500 to-pink-600',
    shadow: 'shadow-purple-500/20',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    title: 'Role-Based Access',
    desc: 'Admin and user roles with granular permissions for team management.',
    gradient: 'from-amber-500 to-orange-600',
    shadow: 'shadow-amber-500/20',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    title: 'Advanced Search',
    desc: 'Filter by make, model, category, and price range instantly.',
    gradient: 'from-cyan-500 to-blue-600',
    shadow: 'shadow-cyan-500/20',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
      </svg>
    ),
    title: 'Easy Restocking',
    desc: 'One-click restock with real-time quantity tracking and low-stock alerts.',
    gradient: 'from-rose-500 to-red-600',
    shadow: 'shadow-rose-500/20',
  },
];

const stats = [
  { value: 10, suffix: '+', label: 'Vehicles Seeded' },
  { value: 20, suffix: '', label: 'Unit Tests' },
  { value: 30, suffix: '+', label: 'Frontend Tests' },
  { value: 12, suffix: '', label: 'API Endpoints' },
];

const Landing = () => {
  const [heroRef, heroInView] = useInView();
  const [featuresRef, featuresInView] = useInView();
  const [statsRef, statsInView] = useInView();
  const [ctaRef, ctaInView] = useInView();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gray-950 text-white">

      {/* Floating Orbs */}
      {floatingOrbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-3xl opacity-60 pointer-events-none"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color.includes('blue') ? 'rgba(59,130,246,0.15)' : orb.color.includes('purple') ? 'rgba(168,85,247,0.12)' : 'rgba(16,185,129,0.1)'}, transparent)`,
            left: orb.left,
            right: orb.right,
            top: orb.top,
            bottom: orb.bottom,
            animation: `float ${orb.duration} ease-in-out infinite`,
            animationDelay: orb.delay,
          }}
        />
      ))}

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-5xl mx-auto text-center">

          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 bg-gray-800/60 border border-gray-700/50 rounded-full px-5 py-2 mb-8 backdrop-blur-sm transition-all duration-700 ${
              heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-sm text-gray-300">Built with TDD &middot; Spring Boot + React</span>
          </div>

          {/* Title */}
          <h1
            className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] transition-all duration-1000 delay-200 ${
              heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="block">Manage Your</span>
            <span className="block mt-2">
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Dealership
              </span>{' '}
              Inventory
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`mt-8 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${
              heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            A premium inventory management system built with enterprise-grade security,
            real-time analytics, and a beautiful interface your team will love.
          </p>

          {/* CTA Buttons */}
          <div
            className={`mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-[600ms] ${
              heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <Link
              to="/register"
              className="group relative px-8 py-4 rounded-2xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:from-blue-500 group-hover:to-indigo-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                Get Started Free
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </Link>
            <Link
              to="/login"
              className="group px-8 py-4 rounded-2xl font-semibold text-gray-300 border border-gray-700 hover:border-gray-500 hover:text-white hover:bg-gray-800/50 backdrop-blur-sm transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                Sign In
              </span>
            </Link>
          </div>

          {/* Scroll indicator */}
          <div
            className={`mt-20 transition-all duration-1000 delay-[1000ms] ${
              heroInView ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll to explore</span>
              <div className="w-6 h-10 rounded-full border-2 border-gray-700 flex items-start justify-center p-1.5">
                <div className="w-1.5 h-2.5 bg-gray-500 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-bold transition-all duration-700 ${
                featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                manage inventory
              </span>
            </h2>
            <p
              className={`mt-4 text-gray-400 text-lg max-w-xl mx-auto transition-all duration-700 delay-200 ${
                featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              From purchasing to restocking, CarDesk handles it all with style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <div
                key={i}
                className={`group relative bg-gray-900/50 border border-gray-800/80 rounded-2xl p-7 hover:border-gray-700 transition-all duration-500 hover:-translate-y-1 ${
                  featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: featuresInView ? `${200 + i * 100}ms` : '0ms' }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-5 shadow-lg ${feat.shadow} group-hover:scale-110 transition-transform duration-300`}>
                  {feat.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feat.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="relative py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} start={statsInView} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className={`text-3xl sm:text-4xl font-bold transition-all duration-700 ${
              featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Built with modern tech
          </h2>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
            {[
              { name: 'Spring Boot', color: 'from-green-500 to-emerald-600' },
              { name: 'React', color: 'from-cyan-400 to-blue-500' },
              { name: 'Tailwind CSS', color: 'from-sky-400 to-cyan-500' },
              { name: 'Java 21', color: 'from-orange-500 to-red-500' },
              { name: 'JWT Auth', color: 'from-purple-500 to-pink-500' },
              { name: 'Vitest', color: 'from-lime-400 to-green-500' },
            ].map((tech, i) => (
              <div
                key={i}
                className="px-5 py-2.5 rounded-xl border border-gray-800 bg-gray-900/50 text-sm text-gray-300 hover:border-gray-600 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
              >
                <span className={`bg-gradient-to-r ${tech.color} bg-clip-text text-transparent font-medium`}>
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="relative py-32 px-6">
        <div
          className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${
            ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="relative bg-gray-900/80 border border-gray-800 rounded-3xl p-12 sm:p-16 backdrop-blur-sm overflow-hidden">
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

            <h2 className="relative text-3xl sm:text-4xl font-bold mb-4">
              Ready to{' '}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                get started?
              </span>
            </h2>
            <p className="relative text-gray-400 text-lg mb-10 max-w-lg mx-auto">
              Join CarDesk today and take full control of your dealership inventory with a modern, powerful interface.
            </p>
            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="group relative px-8 py-4 rounded-2xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-blue-500 group-hover:to-indigo-500 transition-all duration-300" />
                <span className="relative flex items-center gap-2">
                  Create Free Account
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 rounded-2xl font-semibold text-gray-400 hover:text-white transition-colors duration-300"
              >
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-semibold text-white">CarDesk</span>
          </div>
          <p className="text-sm text-gray-500">
            Car Dealership Inventory System &middot; Built with TDD
          </p>
        </div>
      </footer>
    </div>
  );
};

const StatCard = ({ value, suffix, label, start, index }) => {
  const count = useCounter(value, 1500, start);
  return (
    <div
      className={`text-center transition-all duration-700 ${
        start ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: start ? `${index * 150}ms` : '0ms' }}
    >
      <div className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
        {count}{suffix}
      </div>
      <div className="mt-2 text-sm text-gray-500">{label}</div>
    </div>
  );
};

export default Landing;
