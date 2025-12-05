import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Smartphone, Laptop, Tablet, Watch } from 'lucide-react';
import { HashLink } from 'react-router-hash-link'; 
import CustomSelect from '../CustomSelect';
import SmoothScroll from 'smooth-scroll';

// --- Komponenter för knappar ---
const DeviceTypeButton = ({ icon, label, onClick }) => (
  <button className="device-type-btn" onClick={onClick}>
    {icon}
    <span>{label}</span>
  </button>
);
const DeviceTypeSecondaryButton = ({ label, onClick }) => (
    <button className="device-type-btn-secondary" onClick={onClick}>{label}</button>
);
const ConditionButton = ({ label, isActive, onClick }) => (
    <button className={`condition-btn ${isActive ? 'active' : ''}`} onClick={onClick}>
      {label}
    </button>
);

// --- Hjälpfunktioner för databearbetning ---
const deviceTypeMap = {
  'Mobil': 'smartphone',
  'Dator': 'dator',
  'Surfplatta': 'surfplatta',
  'Klocka': 'smartklocka',
};

const processValuationSheet = (csvText, brand, existingData) => {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length < 2) return;

    const headers = lines[0].split(',').map(h => h.trim());
    const modelIndex = headers.indexOf('Modell');
    const deviceTypeIndex = headers.indexOf('Enhetstyp');
    
    const valueMap = {
        baseValue: headers.indexOf('Basvärde (kr)'),
        screenScratched: headers.indexOf('Avdrag - Repig skärm'),
        screenCracked: headers.indexOf('Avdrag - Sprucken skärm'),
        notWorking: headers.indexOf('Avdrag - Ej fungerande'),
        doesNotStart: headers.indexOf('Avdrag - Startar ej'),
    };

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const deviceTypeName = values[deviceTypeIndex];
        const model = values[modelIndex];
        const internalDeviceType = deviceTypeMap[deviceTypeName];

        if (!internalDeviceType || !model) continue;

        if (!existingData[internalDeviceType]) {
            existingData[internalDeviceType] = {};
        }
        if (!existingData[internalDeviceType][brand]) {
            existingData[internalDeviceType][brand] = {};
        }

        existingData[internalDeviceType][brand][model] = {
            baseValue: parseInt(values[valueMap.baseValue], 10) || 0,
            deductions: {
                screenScratched: parseInt(values[valueMap.screenScratched], 10) || 0,
                screenCracked: parseInt(values[valueMap.screenCracked], 10) || 0,
                notWorking: parseInt(values[valueMap.notWorking], 10) || 0,
                doesNotStart: parseInt(values[valueMap.doesNotStart], 10) || 0,
            }
        };
    }
};


// --- Huvudkomponenten ---
export const ValuationTool = () => {
    const [valuationData, setValuationData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deviceType, setDeviceType] = useState(null);
    const [brand, setBrand] = useState(null);
    const [model, setModel] = useState('');
    const [conditions, setConditions] = useState({ starts: null, screen: null, functional: null });

    const questionsRef = useRef(null);

    // useEffect för att hämta all data
    useEffect(() => {
        const masterSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRvuovYmwBolzi5Gnwi5L9GZ8AkGM5mkYmJkBoSSaP2H-MZ0B_GGAjrn5BCmJ3IowvGM_9OkN-KMWov/pub?gid=0&single=true&output=csv';
        const cacheKey = 'valuationPriceDataCache';
        const cacheDuration = 3600 * 1000;

        const fetchAllData = async () => {
            try {
                const cachedItem = localStorage.getItem(cacheKey);
                if (cachedItem) {
                    const { timestamp, data } = JSON.parse(cachedItem);
                    if (Date.now() - timestamp < cacheDuration) {
                        setValuationData(data);
                        setIsLoading(false);
                        return;
                    }
                }
            } catch (e) { console.error("Kunde inte läsa från cache.", e); }

            try {
                const masterResponse = await fetch(masterSheetUrl);
                if (!masterResponse.ok) throw new Error('Kunde inte hämta länk-filen.');
                
                const masterCsvText = await masterResponse.text();
                const sources = masterCsvText.trim().split(/\r?\n/).slice(1).map(line => {
                    const [_, brand, url] = line.split(',').map(s => s.trim());
                    return { brand, url };
                }).filter(source => source && source.url);

                const fetchPromises = sources.map(source =>
                    fetch(source.url)
                        .then(res => res.ok ? res.text() : Promise.reject(`Nätverksfel`))
                        .then(csvText => ({ ...source, csvText }))
                );

                const results = await Promise.all(fetchPromises);
                const structuredData = {};
                results.forEach(({ csvText, brand }) => {
                    processValuationSheet(csvText, brand, structuredData);
                });

                setValuationData(structuredData);

                try {
                    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: structuredData }));
                } catch (e) { console.error("Kunde inte spara till cache.", e); }

            } catch (e) {
                console.error("Kunde inte hämta värderingsdata:", e);
                setError("Kunde inte ladda värderingslistan. Försök igen senare.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // Beräkna det uppskattade värdet
    const estimatedValue = useMemo(() => {
        const deviceData = valuationData[deviceType]?.[brand]?.[model];
        if (!deviceData || !conditions.starts || !conditions.screen || !conditions.functional) return null;

        let finalValue = deviceData.baseValue;
        const deductions = deviceData.deductions;

        if (conditions.starts === 'no') {
            finalValue -= deductions.doesNotStart;
        } else {
            if (conditions.screen === 'scratched') finalValue -= deductions.screenScratched;
            if (conditions.screen === 'cracked') finalValue -= deductions.screenCracked;
            if (conditions.functional === 'no') finalValue -= deductions.notWorking;
        }
        return Math.max(0, finalValue);
    }, [model, conditions, deviceType, brand, valuationData]);

    // Hanteringsfunktioner för val
    const handleDeviceTypeSelect = (type) => {
        setDeviceType(type);
        setBrand(null);
        setModel('');
        setConditions({ starts: null, screen: null, functional: null });
    };

    const handleBrandSelect = (selectedBrand) => {
        setBrand(selectedBrand);
        setModel('');
        setConditions({ starts: null, screen: null, functional: null });
    };

    const handleConditionChange = (question, value) => {
      setConditions(prev => ({ ...prev, [question]: value }));
    };
    
    // Logik för att avgöra när formuläret är klart
    const isFormComplete = estimatedValue !== null;

    // Logik för att fylla dropdowns dynamiskt
    const availableBrands = deviceType && valuationData[deviceType] ? Object.keys(valuationData[deviceType]) : [];
    const modelOptions = (deviceType && brand && valuationData[deviceType]?.[brand]
        ? Object.keys(valuationData[deviceType][brand]).map(m => ({ value: m, label: m }))
        : []) || [];

    // useEffect för att hantera skroll när en modell väljs
    useEffect(() => {
        if (model && questionsRef.current) {
            const scroll = new SmoothScroll();
            scroll.animateScroll(questionsRef.current, null, {
                speed: 800,
                easing: 'easeInOutCubic',
                offset: 250 
            });
        }
    }, [model]);

    // Funktion för att rendera formulärstegen
    const renderFormContent = () => {
        if (isLoading) {
            return <h4>Laddar värderingsdata...</h4>;
        }
        if (error) {
            return <p style={{color: 'red', textAlign: 'center'}}>{error}</p>;
        }
        if (!deviceType) {
            return (
                <div className="valuation-step">
                    <h4>Steg 1: Välj enhetstyp</h4>
                    <div className="device-type-selection">
                        <DeviceTypeButton icon={<Smartphone size={32} />} label="Mobil" onClick={() => handleDeviceTypeSelect('smartphone')} />
                        <DeviceTypeButton icon={<Laptop size={32} />} label="Dator" onClick={() => handleDeviceTypeSelect('dator')} />
                    </div>
                    <div className="secondary-device-types">
                        <DeviceTypeSecondaryButton label="Surfplatta" onClick={() => handleDeviceTypeSelect('surfplatta')} />
                        <DeviceTypeSecondaryButton label="Smartklocka" onClick={() => handleDeviceTypeSelect('smartklocka')} />
                    </div>
                </div>
            );
        }
        if (!brand) {
            return (
                <div className="valuation-step">
                    <h4>Steg 2: Välj märke</h4>
                    <div className="brand-selection">
                        {availableBrands.map(b => (
                            <ConditionButton key={b} label={b} isActive={brand === b} onClick={() => handleBrandSelect(b)} />
                        ))}
                    </div>
                </div>
            );
        }
        return (
            <div className="valuation-step">
                <h4>Steg 3: Välj modell & skick</h4>
                <div className="valuation-form-step">
                    <CustomSelect
                        options={modelOptions}
                        value={modelOptions.find(opt => opt.value === model)}
                        onChange={(option) => option && setModel(option.value)}
                        placeholder="Välj modell..."
                    />
                    {model && (
                        <div className="condition-questions" ref={questionsRef}>
                            <div className="question-group">
                                <label className="question-label">Startar enheten normalt?</label>
                                <div className="condition-buttons">
                                    <ConditionButton label="Ja" isActive={conditions.starts === 'yes'} onClick={() => handleConditionChange('starts', 'yes')} />
                                    <ConditionButton label="Nej" isActive={conditions.starts === 'no'} onClick={() => handleConditionChange('starts', 'no')} />
                                </div>
                            </div>
                            <div className="question-group">
                                <label className="question-label">Är skärmen hel?</label>
                                <div className="condition-buttons">
                                    <ConditionButton label="Ja, felfri" isActive={conditions.screen === 'perfect'} onClick={() => handleConditionChange('screen', 'perfect')} />
                                    <ConditionButton label="Ja, med repor" isActive={conditions.screen === 'scratched'} onClick={() => handleConditionChange('screen', 'scratched')} />
                                    <ConditionButton label="Nej, sprucken" isActive={conditions.screen === 'cracked'} onClick={() => handleConditionChange('screen', 'cracked')} />
                                </div>
                            </div>
                            <div className="question-group">
                                <label className="question-label">Är allt annat fullt fungerande?</label>
                                <div className="condition-buttons">
                                    <ConditionButton label="Ja" isActive={conditions.functional === 'yes'} onClick={() => handleConditionChange('functional', 'yes')} />
                                    <ConditionButton label="Nej" isActive={conditions.functional === 'no'} onClick={() => handleConditionChange('functional', 'no')} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="valuation-tool-content">
            <div className={`valuation-form-wrapper ${isFormComplete ? 'is-exiting' : ''}`}>
                {renderFormContent()}
            </div>

            <div className={`valuation-result-wrapper ${isFormComplete ? 'is-showing' : ''}`}>
                <div className="valuation-result">
                    <h3>Uppskattat värde</h3>
                    <div className="price-amount">{estimatedValue?.toLocaleString('sv-SE') ?? 0} kr</div>
                    <p className="disclaimer">Detta är en preliminär onlinevärdering. Slutgiltigt erbjudande ges efter inspektion i butik.</p>
                    <div className="result-buttons" style={{marginTop: '30px'}}>
                        <HashLink to="/kontakt#hitta-oss" className="cta-button secondary">Hitta till Oss</HashLink>
                    </div>
                </div>
            </div>
        </div>
    );
};