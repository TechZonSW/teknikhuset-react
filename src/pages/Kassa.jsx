import './Kassa.css';

const Kassa = () => {
  return (
    <div className="kassa-wrapper">
      <div className="kassa-content">
        <h1 className="kassa-title">Kassa</h1>
        <p className="kassa-text">
          Vi bygger just nu något riktigt speciellt åt dig. 
          Snart kan du uppleva en smidig, elegant och helt ny kassaupplevelse, 
          optimerad för enkelhet och trygghet. 
        </p>
        <p className="kassa-text highlight">
          Håll utkik… nästa release är på väg och den kommer vara värd att vänta på.
        </p>

        <div className="kassa-loader"></div>
      </div>
    </div>
  );
};

export default Kassa;
