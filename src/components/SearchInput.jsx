import { useContext } from "react";
import { LayoutContext } from "./Layout/LayoutContext";

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
        <div className="col-span-12 group flex-grow min-w-0 text-base mb-1.5 formkit-outer !mb-0">
            <div className="mb-2 flex flex-col items-start justify-start mb-1.5 formkit-wrapper">
                <div className="text-base relative w-full h-12 rounded-lg bg-dark-grey-950/50 flex items-stretch border border-theme-secondary/10 focus-within:ring-2 [&_svg]:text-dark-grey-50/20 [&_svg]:focus-within:text-dark-grey-50/50 group-data-[disabled]:!cursor-not-allowed group-data-[invalid]:border-theme-status-error/20 group-data-[invalid]:bg-theme-status-error/5 formkit-inner">
                    <label
                        htmlFor="search-input"
                        className="absolute left-3 top-1/2 -translate-y-1/2 flex shrink-0 items-center h-6 w-6 text-dark-grey-50/20 peer-focus:text-dark-grey-50/50 formkit-prefixIcon formkit-icon"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 16" className="w-full h-full">
                            <path
                                d="M6.5,13.02c-1.41,0-2.82-.54-3.89-1.61-1.04-1.04-1.61-2.42-1.61-3.89s.57-2.85,1.61-3.89c2.14-2.14,5.63-2.14,7.78,0,1.04,1.04,1.61,2.42,1.61,3.89s-.57,2.85-1.61,3.89c-1.07,1.07-2.48,1.61-3.89,1.61Zm0-10c-1.15,0-2.3,.44-3.18,1.32-.85,.85-1.32,1.98-1.32,3.18s.47,2.33,1.32,3.18c1.75,1.75,4.61,1.75,6.36,0,.85-.85,1.32-1.98,1.32-3.18s-.47-2.33-1.32-3.18c-.88-.88-2.03-1.32-3.18-1.32Z"
                                fill="currentColor"
                            />
                            <path
                                d="M13.5,15c-.13,0-.26-.05-.35-.15l-3.38-3.38c-.2-.2-.2-.51,0-.71,.2-.2,.51-.2,.71,0l3.38,3.38c.2,.2,.2,.51,0,.71-.1,.1-.23,.15-.35,.15Z"
                                fill="currentColor"
                            />
                        </svg>
                    </label>

                    <input
                        id="search-input"
                        type="text"
                        placeholder="Buscar"
                        className="peer appearance-none outline-none bg-transparent grow w-full h-12 px-3 py-4 pl-12 text-base text-dark-grey-50 font-medium placeholder:text-dark-grey-50/50 focus:ring-0 [&::selection]:bg-primary-800 formkit-input"
                        aria-label="Buscar juegos"
                        ref={searchRef}
                        value={txtSearch}
                        onChange={handleChange}
                        onKeyUp={search}
                        onFocus={handleFocus}
                    />

                    <label
                        htmlFor="search-input"
                        className="block text-white text-base lg:text-sm !leading-5 mb-2 formkit-label hidden md:invisible md:block"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', left: 'calc(-0.25em + 48px)' }}
                    >
                        Filtrar juegos
                    </label>
                </div>
            </div>
        </div>
    );
};

export default SearchInput;