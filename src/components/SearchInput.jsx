import { useState, useContext, useEffect, useRef } from "react";
import { LayoutContext } from "./Layout/LayoutContext";
import { AppContext } from "../AppContext";
import LoadApi from "./Loading/LoadApi";
import LoginModal from "./Modal/LoginModal";
import IconSearch from "/src/assets/svg/search.svg";

const SearchInput = ({
    txtSearch,
    setTxtSearch,
    searchRef,
    search,
    isMobile,
    games,
    isLoadingGames
}) => {
    const { contextData } = useContext(AppContext);
    const { setShowMobileSearch, isLogin, launchGameFromSearch } = useContext(LayoutContext);
    const [showLoginModal, setShowLoginModal] = useState(false);
    
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    
    const searchContainerRef = useRef(null);

    useEffect(() => {
        const hasResultsOrLoading = 
            (games?.length > 0 || isLoadingGames) || 
            (txtSearch.trim() !== "" && !isLoadingGames);

        setIsDropdownVisible(txtSearch.trim() !== "" && hasResultsOrLoading);
    }, [txtSearch, games, isLoadingGames]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsDropdownVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleChange = (event) => {
        const value = event.target.value;
        setTxtSearch(value);
        search({ target: { value }, key: event.key, keyCode: event.keyCode });
    };

    const handleFocus = () => {
        if (isMobile) {
            setShowMobileSearch(true);
        }
        // Re-show dropdown if there's already content
        if (txtSearch.trim() !== "") {
            setIsDropdownVisible(true);
        }
    };

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleLoginConfirm = () => {
        setShowLoginModal(false);
    };

    return (
        <>
            {showLoginModal && (
                <LoginModal
                    isOpen={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                    onConfirm={handleLoginConfirm}
                />
            )}

            <div className="sc-dnaMGt cselLF cy-game-search-box" ref={searchContainerRef}>
                <div className="sc-gMYlev cIiZKd">
                    <input
                        className="sc-jVmTQF sc-gcPsFQ bZmhbt knmrV cy-game-search-input"
                        type="text"
                        autoComplete="off"
                        placeholder="Juegos, temas y desarrolladores"
                        ref={searchRef}
                        value={txtSearch}
                        onChange={handleChange}
                        onKeyUp={search}
                        onFocus={handleFocus}
                    />
                    <i className="sc-bLaSkX keApjc">
                        <img src={IconSearch} className="sc-bqOBqt kKmHiP" />
                    </i>
                </div>

                {isDropdownVisible && (
                    <>
                        {(games?.length > 0 || isLoadingGames) && (
                            <div className="sc-cuSlJX sc-dkOAfx bcBPEw dzWWGI mainSearchContainer">
                                <div className="sc-hcRkXe dQmZHI">
                                    <span className="cy-suggested-links-suggested-games">
                                        {isLoadingGames ? (
                                            <div className="sc-gNBmQW ioZMAg cy-search-title-box">
                                                <LoadApi />
                                            </div>
                                        ) : (
                                            <>
                                                <div className="sc-gNBmQW ioZMAg cy-search-title-box">
                                                    <span className="cy-search-title-text">
                                                        {games.length} JUEGOS ENCONTRADOS
                                                    </span>
                                                </div>
                                                <div className="sc-bEuwGr ioiopX cy-found-games-list-box">
                                                    {games.map((game, index) => (
                                                        <div
                                                            key={game.id || index}
                                                            className="sc-LkGDY iPJEWf cy-search-game-item"
                                                            onClick={() => {
                                                                if (isLogin) {
                                                                    launchGameFromSearch(game, "slot", "modal");
                                                                } else {
                                                                    handleLoginClick();
                                                                }
                                                                // Optional: hide dropdown after selection
                                                                setIsDropdownVisible(false);
                                                            }}
                                                        >
                                                            {/* ... game item content ... */}
                                                            <div className="sc-kASIiu bSamOm">
                                                                <div className="sc-lltiPY fetLmC">
                                                                    <div className="sc-iJfeOL iEEUQU">
                                                                        <img
                                                                            className="sc-ivDtld kQdJxW cy-game-image single-game-image"
                                                                            style={{ height: "100%" }}
                                                                            alt={game.name || "Game"}
                                                                            src={
                                                                                game.image_local !== null
                                                                                    ? contextData.cdnUrl + game.image_local
                                                                                    : game.image_url
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="sc-gIPXqN dfxiZL">
                                                                {game.title || game.name || "Unnamed Game"}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </span>
                                </div>
                            </div>
                        )}

                        {(txtSearch.trim() !== "" && games?.length === 0 && !isLoadingGames) && (
                            <div className="sc-cuSlJX sc-dkOAfx bcBPEw dzWWGI">
                                <div className="sc-hcRkXe dQmZHI">
                                    <div className="cy-search-results">
                                        <div className="sc-gNBmQW ioZMAg cy-search-title-box">
                                            <span className="cy-search-title-text">PRINCIPALES RESULTADOS DE BÚSQUEDA</span>
                                            <span className="sc-gWkPsy tZjYL cy-search-results-number">(0)</span>
                                        </div>
                                        <a className="sc-ciMfCw ja-dRuB sc-kdziFn sc-doWNTf kMYqxK bNhBBD cy-no-found-games-box">
                                            No se han encontrado resultados de búsqueda...
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default SearchInput;