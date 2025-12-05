import React, { useState, useEffect, useRef } from 'react';
import { HashLink } from 'react-router-hash-link';
import { Smartphone, Laptop, Watch, Tablet, Info } from 'lucide-react'; // Importerar Tablet-ikonen
import CustomSelect from '../CustomSelect';
import { repairData } from '../../data/repairPricelist';
import '../../pages/Priser.css';

const PriceCalculator = () => {
  const [deviceType, setDeviceType] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [repair, setRepair] = useState('');
  const [price, setPrice] = useState(null);

  const brandRef = useRef(null);
  const modelRef = useRef(null);
  const repairRef = useRef(null);
  const priceDisplayRef = useRef(null); // Ref för pris-sektionen för auto-scroll

  // Nollställer valen i stegen när ett tidigare steg ändras
  useEffect(() => {
    setBrand(''); setModel(''); setRepair(''); setPrice(null);
  }, [deviceType]);

  useEffect(() => {
    setModel(''); setRepair(''); setPrice(null);
  }, [brand]);
  
  useEffect(() => {
    setRepair(''); setPrice(null);
  }, [model]);

  // Beräknar priset när alla val är gjorda
  useEffect(() => {
    if (deviceType && brand && model && repair) {
      const calculatedPrice = repairData[deviceType]?.brands?.[brand]?.models?.[model]?.[repair];
      setPrice(calculatedPrice ?? null);
    } else {
      setPrice(null);
    }
  }, [repair, model, brand, deviceType]);

  // Hanterar smidig scroll till nästa steg
  useEffect(() => { if (deviceType && brandRef.current) brandRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, [deviceType]);
  useEffect(() => { if (brand && modelRef.current) modelRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, [brand]);
  useEffect(() => { if (model && repairRef.current) repairRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, [model]);

  // NYTT: Hanterar auto-scroll till priset när det visas
  useEffect(() => {
    // Kör bara om priset just har beräknats och sektionen finns
    if (price !== null && priceDisplayRef.current) {
      priceDisplayRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [price]); // Denna effekt körs varje gång 'price' ändras

  // Hämtar tillgängliga val baserat på tidigare steg
  const availableBrands = Object.keys(repairData[deviceType]?.brands || {});
  const availableModels = Object.keys(repairData[deviceType]?.brands?.[brand]?.models || {});
  const availableRepairs = Object.keys(repairData[deviceType]?.brands?.[brand]?.models?.[model] || {});
  
  const memberPrice = price ? Math.round(price * 0.9) : null;

  return (
    <div className="price-tool-container">
      <div className="price-step">
        <h4>Steg 1: Välj enhetstyp</h4>
        
        {/* === NY KNAPP-LAYOUT === */}
        <div className="device-selection">
          <button className={`device-btn ${deviceType === 'smartphones' ? 'active' : ''}`} onClick={() => setDeviceType('smartphones')}><Smartphone size={32} /><span>Mobil</span></button>
          <button className={`device-btn ${deviceType === 'datorer' ? 'active' : ''}`} onClick={() => setDeviceType('datorer')}><Laptop size={32} /><span>Dator</span></button>
        </div>
        <div className="secondary-device-types">
            <button className={`device-type-btn-secondary ${deviceType === 'surfplattor' ? 'active' : ''}`} onClick={() => setDeviceType('surfplattor')}>
                <Tablet size={20} /> Surfplatta
            </button>
            <button className={`device-type-btn-secondary ${deviceType === 'klockor' ? 'active' : ''}`} onClick={() => setDeviceType('klockor')}>
                <Watch size={20} /> Smartklocka
            </button>
        </div>
      </div>

      {!!availableBrands.length && (
        <div className="price-step scroll-target" ref={brandRef}>
          <h4>Steg 2: Välj märke</h4>
          <div className="brand-selection">
            {availableBrands.map(brandKey => (
              <button key={brandKey} className={`brand-btn ${brand === brandKey ? 'active' : ''}`} onClick={() => setBrand(brandKey)}>
                {brandKey}
              </button>
            ))}
          </div>
        </div>
      )}

      {!!availableModels.length && (
        <div className="price-step scroll-target" ref={modelRef}>
           <h4>Steg 3: Välj Modell</h4>
           <CustomSelect
              placeholder={`Välj din ${repairData[deviceType]?.label?.toLowerCase()}-modell...`}
              options={availableModels}
              value={model}
              onChange={setModel}
           />
        </div>
      )}

      {!!availableRepairs.length && (
        <div className="price-step scroll-target" ref={repairRef}>
          <h4>Steg 4: Välj Reparation</h4>
          <CustomSelect
              placeholder="Välj tjänst..."
              options={availableRepairs}
              value={repair}
              onChange={setRepair}
           />
        </div>
      )}
      
      {price !== null && (
        // Lägger till ref på denna div för att möjliggöra auto-scroll
        <div className="price-display" ref={priceDisplayRef}>
          <p className="price-label">Ditt medlemspris<span className="tooltip-container"><Info size={16} /><span className="tooltip-text">Spara 10 % på din reparation – bli medlem gratis vid köpet, utan bindningstid!</span></span></p>
          <div className="price-container"><p className="price-amount">{memberPrice} kr</p><p className="original-price">{price} kr</p></div>
          <p className="price-includes">Inkluderar arbete, reservdel och garanti.</p>
          <button className="cta-button">Boka Reparation</button>
        </div>
      )}
      
      <div className="fallback-text">
        <h4>Hittar du inte din enhet?</h4>
        <p>Listan är bara ett urval av våra vanligaste reparationer. Vi älskar en utmaning och kan lösa det mesta. <HashLink to="/kontakt#kontakt-formular">Kontakta oss</HashLink> för personlig hjälp och ett kostnadsförslag.</p>
      </div>
    </div>
  );
};

export default PriceCalculator;