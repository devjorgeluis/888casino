const GameCard = (props) => {
  return (
    <div className="sc-gSkVGw sc-lbNtLv evQOJh bdSJRm cy-single-game-regular-template game-box swiper-mode game-group-videoslot game-category-slots game-company-games-global">
      <div className="sc-clcPwD gAMnwT cy-game-image-container game-image-container" onClick={props.onGameClick}>
        <div className="sc-lltiPY fetLmC">
          <div className="sc-iJfeOL iEEUQU">
            <img
              className="sc-ivDtld kQdJxW cy-game-image single-game-image"
              src={props.imageSrc}
              alt={props.title}
              loading="lazy"
              fetchPriority="high"
              style={{ width: "100%", height: 270 }}
            />
          </div>
        </div>

        <button  className="sc-hjcAab sc-lbyFfZ dDsQeo dVMOeZ cy-play-real-game-button"></button>
      </div>

      <div className="sc-jdENQA isEobv cy-game-details-container">
        <div className="sc-khkubr ywxlO cy-game-info-section">
          <div className="sc-jIJgEx kuqDGV cy-game-title two-lines-title multiple-lines-title">
            {props.title}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;