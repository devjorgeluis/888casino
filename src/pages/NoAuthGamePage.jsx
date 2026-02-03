import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import LoginModal from "../components/Modal/LoginModal";

const NoAuthGamePage = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const gameName = searchParams.get('gameName');
    const gameImg = searchParams.get('gameImg');

    const handleLoginConfirm = () => {
        setShowLoginModal(false);
        navigate(-1);
    };

    return (
        <>
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onConfirm={handleLoginConfirm}
            />
            <div className="container login-to-play-container">
                <div className="row casino-game-login-row">
                    <div className="casino-game">
                        <div className="game-box">
                            <div className="content">
                                <div className="content-overlay"></div>
                                <div className="thumbnail thumb-bg" style={{ backgroundImage: `url(${gameImg})` }}>
                                    <div className="play-now">
                                        <div className="game-description">
                                            <div className="game-text-container">
                                                <div className="content game-name">{gameName}</div>
                                                <div className="meta"><div className="provider"></div></div>
                                            </div>
                                            <div className="favourite-container">
                                                <a className="favourite"><i className="material-icons favourite-icon">favorite_border</i></a>
                                            </div>
                                        </div>
                                        <div className="game-play-button">
                                            <span className="click-to-play"><i className="material-icons">play_circle_filled</i></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row games-list casino-game-login-row">
                    <div className="casino-game-login">
                        <h1 className="title">{gameName}</h1>
                        <p>Inicia sesión o regístrate para jugar</p>
                        <button className="btn btn-cta full-width" onClick={() => setShowLoginModal(true)}>
                            Inicia sesión para jugar
                        </button>
                        <a className="btn btn-primary back-to-lobby" onClick={() => navigate(-1)}>
                            Volver a la página principal
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NoAuthGamePage