const LiveCasinoGameCard = (props) => {
  return (
    <div className="sc-bXnuev bSVwbU cy-live-casino-grid-item">
      <div className="sc-brMyAr jVuEJZ cy-live-casino-grid-item-inner-wrapper item-wrapper-box">
        <div className="sc-gshygS iVtHBJ cy-live-casino-grid-item-thumbnail" onClick={props.onClick}>
          <img
            className="sc-eGmkjz dIDGaS cy-live-casino-grid-item-thumbnail-image"
            src={props.imageSrc}
            alt={props.title}
            loading="lazy"
          />
          <div className="sc-HjLFp hyDoTT cy-live-casino-grid-item-thumbnail-overlay"></div>
        </div>
        <div className="sc-vpDUq iEoNvU cy-live-casino-grid-item-title">
          <span>{props.title}</span>
        </div>
      </div>
    </div>
  );
};

export default LiveCasinoGameCard;
