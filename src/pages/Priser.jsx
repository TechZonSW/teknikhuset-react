import React from 'react';
import PriceCalculator from '../components/priser/PriceCalculator'; // Importera den nya, rena komponenten
import './Priser.css'; // Importera stilarna

// Detta är nu en ren "sid-komponent"
const Priser = () => {
  return (
    <section id="pris" className="content-section" style={{ padding: '120px 0' }}>
      <div className="container">
        <div className="small-container">
          <h2>Vad kostar din reparation?</h2>
          <p className="section-intro-text">Få ett prisförslag direkt. Börja med att välja typ av enhet nedan.</p>
        </div>
        <PriceCalculator />
      </div>
    </section>
  );
};

export default Priser;