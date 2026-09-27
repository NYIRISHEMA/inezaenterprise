import { useEffect, useState } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CarFront,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Compass,
  HeartHandshake,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Pause,
  Phone,
  Play,
  Send,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
  X,
} from 'lucide-react'
import './App.css'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Contact', path: '/contact' },
]

const contactEmails = [
  'annoncebosch@gmail.com',
  'enquiries@inezaenterprise.com',
  'info@inezaenterprise.com',
]

const travelOptions = [
  ['City car', 'Comfortable, efficient travel for Kigali meetings and everyday journeys.'],
  ['SUV & 4×4', 'Extra space and confidence for countryside routes and changing road conditions.'],
  ['Family van', 'Room for your group and luggage, with a relaxed ride from pickup to drop-off.'],
  ['Airport transfer', 'A pre-arranged Kigali International Airport pickup, drop-off, or both.'],
  ['Self-drive or chauffeur', 'Choose the independence of driving yourself or the ease of a local driver.'],
  ['Day trips & longer tours', 'Flexible transport for Kigali outings, intercity travel, and multi-day itineraries.'],
]

const homeSlides = [
  { image: '/south-web.jpg', title: 'Southern Rwanda', alt: 'Travel scenery in southern Rwanda' },
  { image: '/north-web.jpg', title: 'Northern Rwanda', alt: 'Travel scenery in northern Rwanda' },
  { image: '/cardisplay.jpg', title: 'A car for your journey', alt: 'Ineza Enterprise rental car ready for a trip' },
  { image: '/lodge.jpg', title: 'Stay a little longer', alt: 'A lodge destination in Rwanda' },
  { image: '/887A2704-web.jpg', title: 'Catering for your occasion', alt: 'Real event setup catered by Ineza Enterprise' },
  { image: '/887A2712-web.jpg', title: 'A table ready to welcome you', alt: 'Real catering and hospitality at an Ineza Enterprise event' },
]

function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <Link className="wordmark" to="/" aria-label="Ineza Enterprise home">
            <img className="brand-logo" src="/inezalogo.png" alt="Ineza Enterprise Ltd" />
          </Link>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                {item.label}
              </NavLink>
            ))}
            <Link className="header-cta" to="/contact" onClick={() => setMenuOpen(false)}>
              Plan your visit <ArrowUpRight size={16} />
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

function SectionLabel({ children, light = false }) {
  return <p className={`section-label${light ? ' section-label-light' : ''}`}>{children}</p>
}

function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isCarouselPaused, setIsCarouselPaused] = useState(false)
  const [isCarouselHovered, setIsCarouselHovered] = useState(false)
  const [isCarouselFocused, setIsCarouselFocused] = useState(false)
  const [isInteractionPauseDismissed, setIsInteractionPauseDismissed] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  const pauseForFocus = (event) => {
    const carousel = event.currentTarget.closest('.hero-photo')
    setIsCarouselFocused(true)
    if (!carousel?.contains(event.relatedTarget) && !isCarouselHovered) {
      setIsInteractionPauseDismissed(false)
    }
  }

  const resumeAfterFocus = (event) => {
    const carousel = event.currentTarget.closest('.hero-photo')
    if (!carousel?.contains(event.relatedTarget)) {
      setIsCarouselFocused(false)
      if (!isCarouselHovered) setIsInteractionPauseDismissed(false)
    }
  }

  const toggleCarouselPause = () => {
    if (isCarouselPaused) {
      setIsCarouselPaused(false)
      if (isCarouselHovered || isCarouselFocused) setIsInteractionPauseDismissed(true)
    } else {
      setIsCarouselPaused(true)
    }
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = (event) => setPrefersReducedMotion(event.matches)
    mediaQuery.addEventListener('change', updatePreference)

    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    const isPausedByInteraction = (isCarouselHovered || isCarouselFocused) && !isInteractionPauseDismissed
    if (isCarouselPaused || isPausedByInteraction || prefersReducedMotion) return undefined

    const timer = window.setTimeout(() => {
      setActiveSlide((current) => (current + 1) % homeSlides.length)
    }, 5500)

    return () => window.clearTimeout(timer)
  }, [activeSlide, isCarouselPaused, isCarouselHovered, isCarouselFocused, isInteractionPauseDismissed, prefersReducedMotion])

  const showSlide = (direction) => {
    setActiveSlide((current) => (current + direction + homeSlides.length) % homeSlides.length)
  }

  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <SectionLabel light>BASED IN KIGALI · MADE FOR THE JOURNEY</SectionLabel>
          <h1>Go further.<br />Gather <em>better.</em></h1>
          <p className="hero-intro">Thoughtful travel and warm, generous catering for the moments that bring people together in Rwanda.</p>
          <div className="hero-actions">
            <Link className="button button-coral" to="/services">Explore our services <ArrowRight size={17} /></Link>
            <Link className="text-link text-link-light" to="/about">Get to know us <ArrowDownRight size={17} /></Link>
          </div>
          <div className="hero-location"><MapPin size={15} /> Kigali, Rwanda <span className="location-rule" /> Serving across Rwanda</div>
        </div>
        <div
          className="hero-photo"
          onMouseEnter={() => {
            setIsCarouselHovered(true)
            if (!isCarouselFocused) setIsInteractionPauseDismissed(false)
          }}
          onMouseLeave={() => {
            setIsCarouselHovered(false)
            if (!isCarouselFocused) setIsInteractionPauseDismissed(false)
          }}
        >
          <img
            key={homeSlides[activeSlide].image}
            className="hero-slide-image"
            src={homeSlides[activeSlide].image}
            alt={homeSlides[activeSlide].alt}
            fetchPriority={activeSlide === 0 ? 'high' : 'auto'}
          />
          <div className="photo-caption" aria-live={isCarouselPaused || ((isCarouselHovered || isCarouselFocused) && !isInteractionPauseDismissed) ? 'polite' : 'off'}>
            <span>{String(activeSlide + 1).padStart(2, '0')} / {String(homeSlides.length).padStart(2, '0')}</span>
            <span>{homeSlides[activeSlide].title}</span>
          </div>
          <div className="hero-carousel-controls" aria-label="Homepage photo carousel controls">
            <button type="button" className="carousel-arrow" aria-label="Previous photo" onFocus={pauseForFocus} onBlur={resumeAfterFocus} onClick={() => showSlide(-1)}><ChevronLeft size={21} /></button>
            <div className="carousel-dots" role="group" aria-label="Choose a photo">
              {homeSlides.map((slide, index) => (
                <button
                  key={slide.image}
                  type="button"
                  className={`carousel-dot${index === activeSlide ? ' is-active' : ''}`}
                  aria-label={`Show photo ${index + 1}: ${slide.title}`}
                  aria-current={index === activeSlide ? 'true' : undefined}
                  onFocus={pauseForFocus}
                  onBlur={resumeAfterFocus}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
            <button
              type="button"
              className="carousel-arrow carousel-toggle"
              aria-label={isCarouselPaused ? 'Resume automatic slides' : 'Pause automatic slides'}
              aria-pressed={isCarouselPaused}
              onFocus={pauseForFocus}
              onBlur={resumeAfterFocus}
              onClick={toggleCarouselPause}
            >
              {isCarouselPaused ? <Play size={16} /> : <Pause size={16} />}
            </button>
            <button type="button" className="carousel-arrow" aria-label="Next photo" onFocus={pauseForFocus} onBlur={resumeAfterFocus} onClick={() => showSlide(1)}><ChevronRight size={21} /></button>
          </div>
        </div>
        <div className="hero-stamp"><Compass size={19} /><span>Rooted here.<br />Ready to roam.</span></div>
      </section>

      <section className="promise-strip" aria-label="Our promise">
        <div><CarFront size={20} /><span>Dependable rides</span></div>
        <span className="promise-divider" />
        <div><UtensilsCrossed size={19} /><span>Considered catering</span></div>
        <span className="promise-divider" />
        <div><HeartHandshake size={20} /><span>Care in every detail</span></div>
      </section>

      <section className="home-services section-wrap">
        <div className="section-heading">
          <div><SectionLabel>WHAT WE DO</SectionLabel><h2>Good journeys.<br />Good company.</h2></div>
          <p>From the moment you land to the last plate cleared, we make the details feel easy and the experience feel like yours.</p>
        </div>
        <div className="service-feature-grid">
          <article className="service-feature service-feature-travel">
            <div className="feature-photo travel-photo" role="img" aria-label="A comfortable car ready for a Rwanda road trip"><span className="feature-number">01</span></div>
            <div className="feature-copy">
              <div className="feature-icon"><CarFront size={21} /></div>
              <SectionLabel>TRAVEL & TOURS</SectionLabel>
              <h3>Your Rwanda,<br />at your own pace.</h3>
              <p>Well-kept cars, flexible options, and local know-how for city rides, airport pickups, and journeys beyond Kigali.</p>
              <Link className="text-link" to="/services">See travel options <ArrowRight size={16} /></Link>
            </div>
          </article>
          <article className="service-feature service-feature-catering">
            <div className="feature-photo catering-photo" role="img" aria-label="Catering and event hosting by Ineza Enterprise"><span className="feature-number">02</span></div>
            <div className="feature-copy">
              <div className="feature-icon feature-icon-coral"><UtensilsCrossed size={20} /></div>
              <SectionLabel>EVENT CATERING</SectionLabel>
              <h3>Make room<br />for one more.</h3>
              <p>Freshly prepared food and attentive service for intimate in-house gatherings and celebrations at your venue.</p>
              <Link className="text-link" to="/services">Explore catering <ArrowRight size={16} /></Link>
            </div>
          </article>
        </div>
      </section>

      <section className="home-note">
        <div className="note-image" role="img" aria-label="A winding road across Rwanda's green countryside" />
        <div className="note-copy"><SectionLabel light>A LOCAL POINT OF VIEW</SectionLabel><h2>Hospitality is how we move through the world.</h2><p>We are a Kigali-based team who believe great service begins with listening. Tell us what the day needs, and we’ll help bring it together.</p><Link className="button button-outline-light" to="/about">More about Ineza <ArrowUpRight size={16} /></Link></div>
      </section>

      <Callout />
    </>
  )
}

function PageIntro({ eyebrow, title, description, imageClass }) {
  return (
    <section className={`page-intro ${imageClass || ''}`}>
      <div className="page-intro-copy"><SectionLabel>{eyebrow}</SectionLabel><h1>{title}</h1><p>{description}</p></div>
      <div className="page-intro-mark"><ArrowDownRight size={34} strokeWidth={1.2} /></div>
    </section>
  )
}

function NotFoundPage() {
  return (
    <section className="not-found section-wrap">
      <SectionLabel>404 / PAGE NOT FOUND</SectionLabel>
      <h1>This page isn’t here.</h1>
      <p>The address may have changed, or the page may no longer be available.</p>
      <Link className="button button-green" to="/">Back to home <ArrowRight size={17} /></Link>
    </section>
  )
}

function AboutPage() {
  const values = [
    { icon: <HeartHandshake size={20} />, title: 'Genuine care', text: 'We listen closely, communicate clearly, and treat every guest and occasion with respect.' },
    { icon: <ShieldCheck size={20} />, title: 'Reliability', text: 'We plan with care, show up prepared, and take responsibility for the details.' },
    { icon: <Leaf size={20} />, title: 'Local connection', text: 'We are proud of Kigali and Rwanda, and bring a thoughtful local perspective to every service.' },
    { icon: <Sparkles size={20} />, title: 'Quality in the details', text: 'From a clean vehicle to a well-set table, the small things shape the whole experience.' },
  ]

  return (
    <>
      <PageIntro eyebrow="A LITTLE ABOUT US" title={<>Kigali roots.<br /><em>Open roads.</em></>} description="Ineza Enterprise brings travel and catering together under one simple idea: people deserve to feel looked after." imageClass="about-intro" />
      <section className="about-story section-wrap">
        <div className="story-aside"><SectionLabel>OUR STORY</SectionLabel><span className="story-aside-number">01 <span>/ OUR APPROACH</span></span></div>
        <div className="story-main"><h2>We make the practical feel personal.</h2><p>Ineza Enterprise is a Kigali-based hospitality company serving residents, visitors, teams, and event hosts across Rwanda. We bring together two services people rely on: comfortable transport and considered food service.</p><p>Whether you need a car for a few hours, a vehicle for a wider tour, lunch for a team, or catering for a celebration, our role is to make planning clear and the experience feel effortless. We build each service around your schedule, your guests, and the way you want the day to feel.</p><Link className="text-link" to="/services">See how we can help <ArrowRight size={16} /></Link></div>
      </section>
      <section className="scope-section">
        <div className="scope-inner section-wrap"><div className="scope-heading"><SectionLabel light>OUR SCOPE</SectionLabel><h2>Two services,<br />one attentive team.</h2></div><div className="scope-list"><div><span>01</span><div><h3>Travel & tours</h3><p>Vehicle rental with flexible arrangements for city travel, airport transfers, business needs, and leisure journeys in Rwanda.</p></div><CarFront size={22} /></div><div><span>02</span><div><h3>In-house & outside catering</h3><p>Food preparation and service for in-house and external gatherings, with menus shaped to your occasion.</p></div><UtensilsCrossed size={21} /></div></div></div>
      </section>
      <section className="values-section section-wrap"><div className="values-intro"><SectionLabel>WHAT GUIDES US</SectionLabel><h2>Our core values</h2><p>Good hospitality is built on trust. These are the principles behind how we work.</p></div><div className="values-list">{values.map((value, index) => <article className="value-row" key={value.title}><span className="value-index">0{index + 1}</span><span className="value-icon">{value.icon}</span><div><h3>{value.title}</h3><p>{value.text}</p></div></article>)}</div></section>
      <section className="quality-band"><div className="quality-inner section-wrap"><div><SectionLabel light>OUR QUALITY OBJECTIVES</SectionLabel><h2>Consistency you can count on.</h2></div><div className="quality-points"><p><Check size={17} /> Respond clearly and promptly to every enquiry.</p><p><Check size={17} /> Keep vehicles clean, road-ready, and suited to the booking.</p><p><Check size={17} /> Prepare and serve food with care, hygiene, and attention.</p><p><Check size={17} /> Review feedback and keep improving our service.</p></div></div></section>
      <Callout />
    </>
  )
}

function ServicesPage() {
  const [activeTravelOption, setActiveTravelOption] = useState(0)
  const showTravelOption = (direction) => {
    setActiveTravelOption((current) => (current + direction + travelOptions.length) % travelOptions.length)
  }

  return (
    <>
      <PageIntro eyebrow="OUR SERVICES" title={<>The details are<br /><em>our business.</em></>} description="Choose the support you need, then let us take care of the moving parts. Every booking starts with a conversation." imageClass="services-intro" />
      <section className="travel-section section-wrap">
        <div className="service-section-heading"><div><SectionLabel>01 / GETTING AROUND</SectionLabel><h2>Travel & tours</h2></div><p>A car that fits the trip, with arrangements that fit your plans. We’ll help you choose the right option and confirm availability for your dates.</p></div>
        <div className="travel-showcase">
          <div className="travel-showcase-photo"><img src="/cardisplay.jpg" alt="Rental car available from Ineza Enterprise" /></div>
          <div className="travel-slide-copy" aria-live="polite">
            <span className="travel-slide-count">{String(activeTravelOption + 1).padStart(2, '0')} <span>/ {String(travelOptions.length).padStart(2, '0')}</span></span>
            <SectionLabel>TRAVEL OPTIONS</SectionLabel>
            <h3>{travelOptions[activeTravelOption][0]}</h3>
            <p>{travelOptions[activeTravelOption][1]}</p>
            <div className="travel-slider-controls" aria-label="Travel options slider controls">
              <button type="button" className="travel-slider-arrow" aria-label="Previous travel option" onClick={() => showTravelOption(-1)}><ChevronLeft size={19} /></button>
              <div className="travel-slider-dots" role="group" aria-label="Choose a travel option">
                {travelOptions.map(([title], index) => <button key={title} type="button" className={`travel-slider-dot${activeTravelOption === index ? ' is-active' : ''}`} aria-label={`Show ${title}`} aria-current={activeTravelOption === index ? 'true' : undefined} onClick={() => setActiveTravelOption(index)} />)}
              </div>
              <button type="button" className="travel-slider-arrow" aria-label="Next travel option" onClick={() => showTravelOption(1)}><ChevronRight size={19} /></button>
            </div>
          </div>
        </div>
        <div className="service-footnote"><Clock3 size={17} /><p>Tell us your dates, passenger count, route, and whether you prefer self-drive or a chauffeur. We’ll confirm the best fit and a tailored quote.</p><Link className="text-link" to="/contact">Ask about a car <ArrowRight size={16} /></Link></div>
      </section>
      <section className="catering-section">
        <div className="catering-gallery" aria-label="In-house hosting and catering photographs">
          <img className="catering-gallery-feature" src="/887A2704-web.jpg" alt="Ineza Enterprise in-house catering event" loading="lazy" decoding="async" />
          <img src="/887A2712-web.jpg" alt="Catering and hospitality at an Ineza Enterprise event" loading="lazy" decoding="async" />
          <img src="/887A2715-web.jpg" alt="Food service for an Ineza Enterprise gathering" loading="lazy" decoding="async" />
          <img src="/887A2738-web.jpg" alt="An event catered by Ineza Enterprise" loading="lazy" decoding="async" />
          <img src="/887A2741-web.jpg" alt="In-house catering and hosting by Ineza Enterprise" loading="lazy" decoding="async" />
          <img src="/887A2752-web.jpg" alt="Outside catering service by Ineza Enterprise" loading="lazy" decoding="async" />
        </div>
        <div className="catering-content"><SectionLabel>02 / AROUND THE TABLE</SectionLabel><h2>In-house & outside catering</h2><p className="catering-lede">A good gathering deserves food that feels considered and service that lets you be present.</p><div className="catering-details"><div><h3>In-house functions</h3><p>Catering for gatherings hosted within your home, office, or organization, planned around your guests and timing.</p></div><div><h3>Outside events</h3><p>We bring catering to your chosen venue, with setup and service planned around the occasion.</p></div></div><div className="catering-tags"><span>Corporate & team meals</span><span>Private celebrations</span><span>Weddings & receptions</span><span>Buffet or plated service</span><span>Menu planning</span></div><p className="catering-note">Menu, guest count, dietary needs, service style, and venue can all be discussed when you enquire.</p><Link className="button button-green" to="/contact">Plan an event <ArrowRight size={17} /></Link></div>
      </section>
      <Callout />
    </>
  )
}

function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const subject = `Service enquiry: ${formData.get('service')}`
    const message = [
      `Name: ${formData.get('name')}`,
      `Email: ${formData.get('email')}`,
      `Phone: ${formData.get('phone') || 'Not provided'}`,
      `Service: ${formData.get('service')}`,
      `Preferred date: ${formData.get('date') || 'Flexible'}`,
      '',
      formData.get('message'),
    ].join('\n')
    window.location.href = `mailto:${contactEmails.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
    setSubmitted(true)
  }

  return (
    <>
      <PageIntro eyebrow="LET'S TALK" title={<>Tell us what<br /><em>you have in mind.</em></>} description="A trip, a table, or something still taking shape. Send us a note and we’ll help you plan the next step." imageClass="contact-intro" />
      <section className="contact-layout section-wrap">
        <div className="contact-details"><SectionLabel>FIND YOUR WAY TO US</SectionLabel><h2>We’re right here in Kigali.</h2><p className="contact-lede">Reach out directly or send an enquiry. We’ll get back to you to talk through the details.</p>
          <a className="contact-channel" href="tel:+250782025134"><span className="channel-icon"><Phone size={19} /></span><span><small>PHONE</small><strong>+250 782 025 134</strong></span><ArrowUpRight size={17} /></a>
          {contactEmails.map((email, index) => <a className="contact-channel" href={`mailto:${email}`} key={email}><span className={`channel-icon${index ? '' : ' channel-icon-coral'}`}><Mail size={19} /></span><span><small>{index === 0 ? 'EMAIL' : 'ALSO EMAIL'}</small><strong>{email}</strong></span><ArrowUpRight size={17} /></a>)}
          <div className="contact-location"><MapPin size={19} /><div><small>VISIT US</small><strong>KG 51ST, Kimironko, Kigali, Rwanda</strong></div></div>
        </div>
        <div className="contact-form-wrap"><div className="form-heading"><div><SectionLabel>YOUR ENQUIRY</SectionLabel><h2>How can we help?</h2></div><span className="form-step">01 <span>/ 01</span></span></div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row"><label>Your name<input name="name" autoComplete="name" placeholder="Name" required /></label><label>Email address<input type="email" name="email" autoComplete="email" placeholder="you@example.com" required /></label></div>
            <div className="form-row"><label>Phone number <span className="field-optional">OPTIONAL</span><input type="tel" name="phone" autoComplete="tel" placeholder="+250" /></label><label>I'm interested in<select name="service" defaultValue="Travel & tours"><option>Travel & tours</option><option>In-house catering</option><option>Outside event catering</option><option>Something else</option></select></label></div>
            <label>Preferred date <span className="field-optional">OPTIONAL</span><span className="input-with-icon"><input type="date" name="date" /><CalendarDays size={17} /></span></label>
            <label>Tell us a little more<textarea name="message" rows="4" placeholder="Dates, group size, route, occasion, or anything else that would help us plan..." required /></label>
            <div className="form-submit-row"><p>Submitting opens your email app with the details ready to send.</p><button className="button button-green" type="submit">Prepare enquiry <Send size={16} /></button></div>
            {submitted && <p className="form-status" role="status">Your email app should open with the enquiry details. You can also email enquiries@inezaenterprise.com directly.</p>}
          </form>
        </div>
      </section>
      <div className="contact-bottom-line"><span>INEZA ENTERPRISE</span><span>GOOD JOURNEYS. GOOD COMPANY.</span><MapPin size={15} /><span>KIGALI, RWANDA</span></div>
    </>
  )
}

function Callout() {
  return <section className="closing-cta"><div><SectionLabel light>YOUR NEXT GOOD DAY STARTS HERE</SectionLabel><h2>What can we help you plan?</h2></div><Link className="button button-coral" to="/contact">Let’s talk <ArrowRight size={17} /></Link></section>
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link className="wordmark wordmark-footer" to="/" aria-label="Ineza Enterprise home"><img className="brand-logo" src="/inezalogo.png" alt="Ineza Enterprise Ltd" /></Link>
          <p>Thoughtful travel and warm hospitality, from Kigali across Rwanda.</p>
          <span className="footer-location"><MapPin size={15} /> Kigali, Rwanda</span>
        </div>
        <div className="footer-links">
          <span className="footer-heading">EXPLORE</span>
          {navItems.map((item) => <Link key={item.path} to={item.path}>{item.label}</Link>)}
        </div>
        <div className="footer-links footer-contact">
          <span className="footer-heading">GET IN TOUCH</span>
          <a href="tel:+250782025134">+250 782 025 134</a>
          {contactEmails.map((email) => <a href={`mailto:${email}`} key={email}>{email}</a>)}
          <Link to="/contact">Send an enquiry <ArrowUpRight size={14} /></Link>
        </div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Ineza Enterprise</span><span>Made with care in Kigali</span></div>
    </footer>
  )
}

function App() {
  return <BrowserRouter><SiteLayout /></BrowserRouter>
}

export default App
