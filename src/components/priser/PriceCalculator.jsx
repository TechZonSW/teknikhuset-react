import React, { useState, useEffect, useRef } from 'react';
import { HashLink } from 'react-router-hash-link';
import { Smartphone, Laptop, Watch, Tablet, Info } from 'lucide-react';
import CustomSelect from '../CustomSelect';
import '../../pages/Priser.css';

// Karta för att översätta enhetstyper från sheet till interna nycklar
const deviceTypeInfo = {
  'Mobil': { key: 'smartphones', label: 'Smartphone' },
  'Dator': { key: 'datorer', label: 'Dator' },
  'Surfplatta': { key: 'surfplattor', label: 'Surfplatta' },
  'Klocka': { key: 'klockor', label: 'Klocka' },
};

// Bearbetningsfunktionen för en enskild data-fil
const processSingleSheet = (csvText, brand, existingData) => {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return;

  const headers = lines[0].split(',').map(h => h.trim());
  const modelIndex = headers.indexOf('Modell');
  const deviceTypeIndex = headers.indexOf('Enhetstyp');
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const deviceTypeName = values[deviceTypeIndex];
    const model = values[modelIndex];

    const info = deviceTypeInfo[deviceTypeName];
    if (!info || !model) continue;

    const { key: internalDeviceType, label } = info;

    if (!existingData[internalDeviceType]) {
      existingData[internalDeviceType] = { label, brands: {} };
    }
    if (!existingData[internalDeviceType].brands[brand]) {
      existingData[internalDeviceType].brands[brand] = { models: {} };
    }

    const modelRepairs = {};
    for (let j = 0; j < headers.length; j++) {
      if (j === modelIndex || j === deviceTypeIndex) continue;
      const repairName = headers[j];
      const price = parseInt(values[j], 10);
      if (repairName && !isNaN(price)) {
        modelRepairs[repairName] = price;
      }
    }
    existingData[internalDeviceType].brands[brand].models[model] = modelRepairs;
  }
};


const PriceCalculator = () => {
  const [repairData, setRepairData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deviceType, setDeviceType] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [repair, setRepair] = useState('');
  const [price, setPrice] = useState(null);

  const brandRef = useRef(null);
  const modelRef = useRef(null);
  const repairRef = useRef(null);
  const priceDisplayRef = useRef(null);


  useEffect(() => {
    const masterSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQc8aAsGaa0n_aQiBI0WUkmmFdchyJLHMGRMBOaNZ_CPmGGq2g1LnmfrpG3K9AHbI3qRCAuc3OCL-Bc/pub?gid=0&single=true&output=csv';
    const cacheKey = 'repairPriceDataCache';
    const cacheDuration = 3600 * 1000;

    const fetchAllData = async () => {
      try {
        const cachedItem = localStorage.getItem(cacheKey);
        if (cachedItem) {
          const { timestamp, data } = JSON.parse(cachedItem);
          if (Date.now() - timestamp < cacheDuration) {
            console.log("Läser prislista från snabb cache.");
            setRepairData(data);
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error("Kunde inte läsa från cache, hämtar från nätverket.", e);
      }

      try {
        console.log("Hämtar färsk prislista från Google Sheets.");
        const masterResponse = await fetch(masterSheetUrl);
        if (!masterResponse.ok) {
          throw new Error('Kunde inte hämta huvudlistan med länkar.');
        }
        
        const masterCsvText = await masterResponse.text();
        const lines = masterCsvText.trim().split(/\r?\n/);
        
        const sources = lines.slice(1).map(line => {
          const [enhetstyp, brand, url] = line.split(',').map(s => s.trim());
          return { brand, url };
        }).filter(source => source && source.url);

        const fetchPromises = sources.map(source =>
          fetch(source.url)
            .then(res => {
              if (!res.ok) throw new Error(`Nätverksfel för ${source.brand}`);
              return res.text();
            })
            .then(csvText => ({ ...source, csvText }))
        );

        const results = await Promise.all(fetchPromises);
        
        const structuredData = {};
        results.forEach(({ csvText, brand }) => {
          processSingleSheet(csvText, brand, structuredData);
        });

        setRepairData(structuredData);

        try {
          const cachePayload = {
            timestamp: Date.now(),
            data: structuredData
          };
          localStorage.setItem(cacheKey, JSON.stringify(cachePayload));
        } catch (e) {
          console.error("Kunde inte spara data till cache.", e);
        }

      } catch (e) {
        console.error("Kunde inte hämta eller bearbeta prislistan:", e);
        setError("Det gick inte att ladda prislistan just nu. Försök igen senare.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);
  
  useEffect(() => { setBrand(''); setModel(''); setRepair(''); setPrice(null); }, [deviceType]);
  useEffect(() => { setModel(''); setRepair(''); setPrice(null); }, [brand]);
  useEffect(() => { setRepair(''); setPrice(null); }, [model]);
  useEffect(() => {
    if (deviceType && brand && model && repair) {
      const calculatedPrice = repairData[deviceType]?.brands?.[brand]?.models?.[model]?.[repair];
      setPrice(calculatedPrice ?? null);
    } else {
      setPrice(null);
    }
  }, [repair, model, brand, deviceType, repairData]);
  
  // === UPPDATERAD SKROLL-LOGIK ===
  useEffect(() => { if (deviceType && brandRef.current) brandRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, [deviceType]);
  
  // Skrollar modell-steget till toppen
  useEffect(() => { if (brand && modelRef.current) modelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [brand]);
  
  // Skrollar reparations-steget till toppen
  useEffect(() => { if (model && repairRef.current) repairRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [model]);
  
  // Skrollar priset till mitten för fokus
  useEffect(() => { if (price !== null && priceDisplayRef.current) priceDisplayRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, [price]);

  const availableBrands = Object.keys(repairData[deviceType]?.brands || {});
  const availableModels = Object.keys(repairData[deviceType]?.brands?.[brand]?.models || {});
  const availableRepairs = Object.keys(repairData[deviceType]?.brands?.[brand]?.models?.[model] || {});
  
  const memberPrice = price ? Math.round(price * 0.9) : null;

  if (isLoading) {
    return (
      <div className="price-tool-container" style={{ textAlign: 'center' }}>
        <h4>Laddar prislista...</h4>
      </div>
    );
  }

  if (error) {
    return (
      <div className="price-tool-container fallback-text">
        <h4>Ett fel uppstod</h4>
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className="price-tool-container">
      <div className="price-step">
        <h4>Steg 1: Välj enhetstyp</h4>
        <div className="device-selection">
          <button className={`device-btn ${deviceType === 'smartphones' ? 'active' : ''}`} onClick={() => setDeviceType('smartphones')}>
            <Smartphone size={32} />
            <span>Mobil</span>
          </button>
          <button className={`device-btn ${deviceType === 'datorer' ? 'active' : ''}`} onClick={() => setDeviceType('datorer')}>
            <Laptop size={32} />
            <span>Dator</span>
          </button>
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
        <div className="price-display" ref={priceDisplayRef}>
          <p className="price-label">Ditt medlemspris<span className="tooltip-container"><Info size={16} /><span className="tooltip-text">Spara 10 % på din reparation – bli medlem gratis vid köpet, utan bindningstid!</span></span></p>
          <div className="price-container">
            <p className="price-amount">{memberPrice} kr</p>
            <p className="original-price">{price} kr</p>
          </div>
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