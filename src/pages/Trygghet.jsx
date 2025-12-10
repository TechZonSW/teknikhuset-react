import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Bag, MagnifyingGlass, LockKey, Scales, ArrowRight, EnvelopeSimple, User } from 'phosphor-react';
import './Trygghet.css';

const Trygghet = () => {
  return (
    <>
      <Helmet>
        <title>Trygghet & Transparens | Teknikhuset Kalmar</title>
        <meta name="description" content="Läs om våra garantier, bytesrätt, dataintegritet och kostnadsfria felsökning. Din trygghet är vår standard." />
      </Helmet>

      <main className="trygghet-page">
        <section className="page-title-section">
          <div className="container">
            <h1>Din Trygghet är Vår Standard</h1>
            <p className="page-intro">
              Hos Teknikhuset är transparens och kvalitet grunden i allt vi gör. 
              För att din upplevelse ska vara så sömlös och förutsägbar som möjligt 
              har vi samlat våra garantier och riktlinjer här.
            </p>
          </div>
        </section>

        <section className="container">
          <div className="hub-grid">
            
            {/* Kort 1: Garanti */}
            <Link to="/krav/garanti" className="hub-card">
              <div className="hub-icon"><ShieldCheck weight="duotone" /></div>
              <h3>Vår Servicegaranti</h3>
              <p>Läs om vår 3-månaders garanti som täcker både arbete och reservdelar. Vi står bakom varje reparation.</p>
              <span className="read-more">Läs villkor <ArrowRight weight="bold" /></span>
            </Link>

            {/* Kort 2: Bytesrätt */}
            <Link to="/krav/bytesratt" className="hub-card">
              <div className="hub-icon"><Bag weight="duotone" /></div>
              <h3>Öppet Köp & Bytesrätt</h3>
              <p>Villkor för 14 dagars öppet köp på tillbehör och produkter, inklusive krav på obruten förpackning.</p>
              <span className="read-more">Läs mer <ArrowRight weight="bold" /></span>
            </Link>

            {/* Kort 3: Felsökning */}
            <Link to="/krav/felsokning" className="hub-card">
              <div className="hub-icon"><MagnifyingGlass weight="duotone" /></div>
              <h3>Kostnadsfri Felsökning</h3>
              <p>Vi felsöker alltid gratis och ger dig ett kostnadsförslag utan förpliktelser innan vi påbörjar något arbete.</p>
              <span className="read-more">Läs mer <ArrowRight weight="bold" /></span>
            </Link>

            {/* Kort 4: Data */}
            <Link to="/krav/data-integritet" className="hub-card">
              <div className="hub-icon"><LockKey weight="duotone" /></div>
              <h3>Data & Integritet</h3>
              <p>Hur vi hanterar din enhet med respekt för din integritet, samt information om säkerhetskopiering.</p>
              <span className="read-more">Läs mer <ArrowRight weight="bold" /></span>
            </Link>

            {/* Kort 5: Reklamation */}
            <Link to="/krav/reklamation" className="hub-card">
              <div className="hub-icon"><Scales weight="duotone" /></div>
              <h3>Reklamation & Rättigheter</h3>
              <p>En tydlig guide för vad som gäller om något mot förmodan inte skulle leva upp till dina förväntningar.</p>
              <span className="read-more">Läs mer <ArrowRight weight="bold" /></span>
            </Link>

            {/* Kort 6: Medlemskap & Villkor */}
            <Link to="/krav/MedlemskapPolicy" className="hub-card">
              <div className="hub-icon"><User weight="duotone" /></div>
              <h3>Medlemskap & Villkor</h3>
              <p>Läs om våra medlemskapsavtal, dataskydd, och hur vi hanterar dina personuppgifter enligt GDPR.</p>
              <span className="read-more">Läs villkor <ArrowRight weight="bold" /></span>
            </Link>

            {/* Kort 7: Kontakt */}
            <HashLink 
              to="/kontakt#kontakt-formular" 
              className="hub-card" 
              style={{ borderColor: 'var(--prem-primary)' }}
              smooth
            >
              <div className="hub-icon" style={{ color: 'var(--prem-primary)' }}>
                <EnvelopeSimple weight="bold" /> 
              </div>
              <h3 style={{ color: 'var(--prem-primary)' }}>Har du fler frågor?</h3>
              <p>Hittar du inte det du söker? Kontakta vår kundtjänst så hjälper vi dig direkt.</p>
              <span className="read-more">Kontakta oss <ArrowRight weight="bold" /></span>
            </HashLink>

          </div>
        </section>
      </main>
    </>
  );
};

export default Trygghet;