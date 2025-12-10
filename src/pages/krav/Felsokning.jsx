import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'phosphor-react';
import './Policy.css';

const Felsokning = () => {
  return (
    <>
      <Helmet>
        <title>Kostnadsfri Felsökning | Teknikhuset Kalmar</title>
      </Helmet>
      <div className="policy-container">
        <div className="policy-content">
          <Link to="/trygghet" className="back-btn-icon-only" aria-label="Tillbaka">
              <ArrowLeft size={24} weight="bold" />
            </Link>
          
          <h1>Kostnadsfri Felsökning</h1>
          
          <p className="intro">Vi tror på radikal transparens som en grundpelare i vår relation med dig. Att ta betalt för att enbart identifiera ett problem strider mot denna filosofi. Därför är en professionell felsökning och diagnos av din enhet alltid kostnadsfri hos oss.</p>

          <h2>Vår transparenta process:</h2>
          
          <h3>Dialog & Inlämning</h3>
          <p>Processen börjar med att vi lyssnar på dig. Du beskriver problemet och vi ställer följdfrågor för att förstå situationen fullt ut.</p>

          <h3>Expertanalys</h3>
          <p>Våra certifierade tekniker genomför en systematisk och grundlig undersökning för att identifiera felets rot och omfattning. Vi nöjer oss inte med gissningar; vi fastställer fakta.</p>

          <div className="highlight-box">
            <h3>Tydligt Kostnadsförslag</h3>
            <p>Baserat på vår analys presenterar vi ett detaljerat och fast kostnadsförslag. Vi förklarar exakt vad som behöver göras, varför, och vad det kommer att kosta.</p>
          </div>
          
          <p>Detta ger dig fullständig kontroll och ett komplett underlag för att fatta ett informerat beslut. Du kan välja att gå vidare med reparationen eller avböja, helt utan förpliktelser, dolda avgifter eller överraskningar.</p>
        </div>
      </div>
    </>
  );
};

export default Felsokning;