import { useContext } from "react";
import { LayoutContext } from "./Layout/LayoutContext";
import IconSearch from "/src/assets/svg/search.svg";

const SearchInput = ({
    txtSearch,
    setTxtSearch,
    searchRef,
    search,
    isMobile
}) => {
    const { setShowMobileSearch } = useContext(LayoutContext);

    const handleChange = (event) => {
        if (!isMobile) {
            const value = event.target.value;
            setTxtSearch(value);
            search({ target: { value }, key: event.key, keyCode: event.keyCode });
        }
    };

    const handleFocus = () => {
        if (isMobile) {
            setShowMobileSearch(true);
        }
    };

    return (
        <div className="sc-dnaMGt cselLF cy-game-search-box">
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
        </div>
    );
};

export default SearchInput;