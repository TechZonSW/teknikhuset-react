import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'phosphor-react';
import './Policy.css';

const DataIntegritet = () => {
  return (
    <>
      <Helmet>
        <title>Data & Integritet | Teknikhuset Kalmar</title>
      </Helmet>
      <div className="policy-container">
        <div className="policy-content">
          <Link to="/trygghet" className="back-btn-icon-only" aria-label="Tillbaka">
              <ArrowLeft size={24} weight="bold" />
            </Link>
          
          <h1>Data & Integritet</h1>
          
          <p className="intro">Din smartphone, dator eller surfplatta är mer än bara teknik – den är ditt digitala hjärta, en behållare för dina viktigaste minnen, kontakter och arbetsdokument. Ditt förtroende när du lämnar den i våra händer är vår högsta prioritet.</p>

          <div className="highlight-box">
            <h3>Vårt löfte om integritet</h3>
            <p>Vi hanterar din enhet med den största respekt och enligt en strikt "need-to-know"-princip. Våra tekniker navigerar endast till de systemfunktioner som är absolut nödvändiga för att kunna utföra och kvalitetstesta en reparation. Vi utforskar aldrig ditt personliga innehåll, så som foton, meddelanden eller filer. Hela processen sker i vår öppna och säkra verkstadsmiljö.</p>
          </div>

          <h2>En stark rekommendation för din sinnesro</h2>
          <p>Ett tekniskt ingrepp, oavsett hur professionellt utfört, medför alltid en teoretisk risk för dataförlust. För att helt eliminera denna risk och garantera säkerheten för dina oersättliga filer, rekommenderar vi starkt att du genomför en fullständig säkerhetskopia av din enhet innan du lämnar in den.</p>
          <p>Är du osäker på hur du gör? Fråga oss i butiken. Vi tar oss gärna tid att guida dig genom processen – det är en del av vår service på premium-nivå.</p>
        </div>
      </div>
    </>
  );
};

export default DataIntegritet;