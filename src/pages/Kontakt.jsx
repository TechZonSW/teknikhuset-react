import React, { useState } from 'react';
import { ShieldCheck, Eye, Leaf, Coffee, MapPin, Instagram, AlertCircle, CheckCircle, Facebook } from 'lucide-react';
import './Kontakt.css';

// Egen TikTok-ikonkomponent (oförändrad)
const TikTokIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.84-.95-6.43-2.8-1.59-1.87-2.32-4.35-2.2-6.87.15-2.86 1.79-5.45 4.15-6.73 1.05-.57 2.24-.89 3.48-.96.02 1.48-.04 2.96-.04 4.44-.99.32-2.15.52-3.02.97-1.07.55-1.95 1.36-2.52 2.37-.58 1.02-.85 2.22-.81 3.43.04 1.09.36 2.15.93 3.07.62.98 1.54 1.72 2.63 2.15.97.38 2.04.46 3.08.22.99-.22 1.93-.74 2.63-1.44.7-.71 1.1-1.65 1.18-2.69.03-1.18.01-2.37.01-3.55v-7.68c-.69.02-1.38.05-2.07.09-1.48.1-2.93.38-4.32.96v-4.04c1.51-.41 3.03-.7 4.56-.78.05-.22.1-.43.14-.64.13-1.05.31-2.1.48-3.15.17-.99.36-1.99.53-2.98.02-.12.03-.23.05-.35z" /></svg>
);

const storeFeatures = [
  { id: 'lounge', title: 'Kundlounge', description: 'Arbeta i lugn och ro med en kopp kaffe medan vi tar hand om din enhet.', videoSrc: '/videos/butik-lounge.mp4' },
  { id: 'workshop', title: 'Öppen Verkstad', description: 'Följ arbetet och se vår expertis med egna ögon – vi har inget att dölja.', videoSrc: '/videos/butik-verkstad.mp4' },
  { id: 'assortment', title: 'Noga Utvalt Sortiment', description: 'Varje produkt på våra hyllor är rigoröst testad och utvald för sin kvalitet och prestanda.', videoSrc: '/videos/butik-sortiment.mp4' }
];

const Kontakt = () => {
  const [activeTab, setActiveTab] = useState(storeFeatures[0].id);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState(null); // 'loading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  
  const activeFeature = storeFeatures.find(feature => feature.id === activeTab);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/.netlify/functions/sendContactForm', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Något gick fel');
      }

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      // Göm meddelandet efter 5 sekunder
      setTimeout(() => setStatus(null), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <section className="om-oss-hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="om-oss-hero-content">
            <h1>Mer än en butik. En ny standard för teknik.</h1>
            <p>Vi startade Teknikhuset för att vi var trötta på en teknikvärld fylld av kompromisser. Vår mission är att vara Kalmars trygga hamn för allt som rör din digitala vardag – byggd på ärlighet, bevisad expertis och en service som sätter dig i centrum.</p>
          </div>
        </div>
      </section>

      <section id="filosofi" className="content-section light-bg-section">
        <div className="container">
          <div className="small-container"><h2>Våra Fyra Hörnstenar</h2></div>
          <div className="pillars-grid">
            <div className="pillar-card"><div className="pillar-card-content"><ShieldCheck size={48} className="pillar-icon" /><h3>Kompromisslös Kvalitet</h3><p>Grunden i allt vi gör. Som civilingenjörer bygger vi på systematik, inte gissningar. Från Apple Original-delar till vårt handplockade sortiment – om vi erbjuder det, kan du lita på det.</p></div></div>
            <div className="pillar-card"><div className="pillar-card-content"><Eye size={48} className="pillar-icon" /><h3>Radikal Transparens</h3><p>Vi tror du förtjänar att veta. Därför är vår felsökning alltid gratis och vår verkstad öppen för insyn. Inga dolda avgifter, ingen teknisk jargong. Bara ärliga råd så du kan fatta rätt beslut.</p></div></div>
            <div className="pillar-card"><div className="pillar-card-content"><Leaf size={48} className="pillar-icon" /><h3>Hållbarhet som Kärnvärde</h3><p>I en värld av "slit och släng" står vi för ett smartare val. Genom expertreparationer och rekonditionerade enheter förlänger vi livet på tekniken. Bra för din plånbok, och för vår planet.</p></div></div>
            <div className="pillar-card"><div className="pillar-card-content"><Coffee size={48} className="pillar-icon" /><h3>Personlig Service</h3><p>Vi är inte en anonym webbshop. Vi är dina lokala teknikexperter. Kom in, ta en kaffe i vår lounge och låt oss lösa dina problem i lugn och ro. Vi tar oss tid att förklara och hjälpa.</p></div></div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <div className="small-container">
            <h2>Välkommen in till Teknikhuset</h2>
            <p className="section-intro">Vi har designat vår lokal för att vara en välkomnande och inspirerande miljö. Här möts avancerad teknik och personlig service i en atmosfär av lugn och professionalitet.</p>
          </div>
          <div className="interactive-store-view">
            <div className="store-tabs">{storeFeatures.map((feature) => (<button key={feature.id} className={`tab-button ${activeTab === feature.id ? 'active' : ''}`} onClick={() => setActiveTab(feature.id)}>{feature.title}</button>))}</div>
            <div className="store-content">
              <div className="store-image-container">
                <video
                  key={activeFeature.videoSrc}
                  className="store-media"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src={activeFeature.videoSrc} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="store-text-container"><p>{activeFeature.description}</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section premium-neutral-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-column">
              <h2 id="hitta-oss">Hitta till oss</h2>
              <p className="contact-intro">Besök vår butik och lounge på Norra Långgatan i Kalmar. Vi ser fram emot att träffa dig.</p>
              <div className="map-container"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2179.991617415416!2d16.36383617743915!3d56.66318617351662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465661a1a3610c49%3A0x6a2e3e5de17f1543!2sNorra%20L%C3%A5nggatan%2011B%2C%20392%2032%20Kalmar!5e0!3m2!1ssv!2sse!4v1721065842101!5m2!1ssv!2sse" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Karta till Teknikhuset"></iframe></div>
              <div className="address-details">
                <p><MapPin size={16} /> Norra Långgatan 11 b, 392 32 Kalmar</p>
                <h4>Öppettider</h4>
                <p>Mån - Fre: 09:00 - 20:00</p>
                <p>Lör - Sön: 10:00 - 18:00</p>
              </div>
            </div>
            <div className="contact-column" id="kontakt-formular">
              <h2>Ta Kontakt</h2>
              <p className="contact-intro">Frågor eller specifika ärenden? Fyll i formuläret så återkommer vi. Du kan också nå oss på <a href="mailto:team@teknikhusetkalmar.se">team@teknikhusetkalmar.se</a> eller på telefon <a href="tel:+46761723014">076-172 30 14</a>.</p>
              
              {status === 'success' && (
                <div className="form-alert success">
                  <CheckCircle size={20} />
                  <div>
                    <strong>Tack!</strong>
                    <p>Din förfrågan har skickats. Vi återkommer inom kort.</p>
                  </div>
                </div>
              )}
              
              {status === 'error' && (
                <div className="form-alert error">
                  <AlertCircle size={20} />
                  <div>
                    <strong>Något gick fel</strong>
                    <p>{errorMessage}</p>
                  </div>
                </div>
              )}

              <form className="contact-form" onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Ditt Namn</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                    disabled={status === 'loading'}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Din E-post</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                    disabled={status === 'loading'}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Telefonnummer (valfritt)</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={status === 'loading'}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Meddelande</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="5" 
                    value={formData.message}
                    onChange={handleInputChange}
                    required 
                    disabled={status === 'loading'}
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="cta-button secondary"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Skickar...' : 'Skicka Meddelande'}
                </button>
              </form>
              <div className="social-follow">
                <h4>Följ vår resa</h4>
                <div className="social-icons">
                  <a href="https://instagram.com/teknikhuset.kalmar" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram /></a>
                  <a href="https://tiktok.com/@teknikhuset.kalmar" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><TikTokIcon /></a>
                  <a href="https://www.facebook.com/people/Teknikhuset-Kalmar/61584528936727/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Kontakt;