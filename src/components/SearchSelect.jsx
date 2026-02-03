import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SearchSelect = ({
    categories,
    setSelectedProvider,
    onProviderSelect,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isLiveCasino = location.pathname === "/livecasino";

    const [selectedValue, setSelectedValue] = useState("_ALL_");

    const handleChange = (e) => {
        const value = e.target.value;
        const provider = categories.find((cat) => cat.id?.toString() === value || cat.code === value);

        if (provider) {
            console.log(provider);
            
            setSelectedProvider(provider);
            onProviderSelect(provider);
            setSelectedValue(value);

            if (isLiveCasino && provider.code) {
                navigate(`#${provider.code}`);
            }
        }
    };

    return (
        <div className="col-span-12 group flex-grow min-w-0 text-base mb-1.5 formkit-outer !-mb-1.5 lg:min-w-[12.25rem] lg:max-w-[12.25rem]">
            <div className="mb-1.5 formkit-wrapper">
                <div className="relative rounded-lg bg-black/50 flex h-12 items-center border border-theme-secondary/10 focus-within:ring-2 group-data-[disabled]:!cursor-not-allowed formkit-inner">
                    <select
                        id="studio-select"
                        value={selectedValue}
                        onChange={handleChange}
                        className="appearance-none grow py-3 pl-3 pr-12 h-12 text-base text-dark-grey-50 outline-none bg-transparent rounded-lg border-none focus:ring-0 cursor-pointer text-ellipsis max-w-full overflow-hidden formkit-input"
                        aria-label="Seleccionar estudio de juegos"
                    >
                        {categories.map((provider) => (
                            <option
                                className="text-black group-data-[multiple]:text-sm group-data-[multiple]:outline-none group-data-[multiple]:border-none group-data-[multiple]:py-1.5 group-data-[multiple]:px-2 formkit-option"
                                key={provider.id || provider.code}
                                value={provider.id || provider.code}
                            >
                                {provider.name}
                            </option>
                        ))}
                    </select>

                    <span className="absolute w-6 text-theme-secondary pointer-events-none right-5 top-1/2 -translate-y-1/2 formkit-selectIcon formkit-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12.3977 15.203C12.178 15.4226 11.8219 15.4226 11.6022 15.203L5.86739 9.46808C5.64772 9.24841 5.64772 8.89231 5.86739 8.67263L6.13256 8.40743C6.35222 8.18776 6.70838 8.18776 6.92805 8.40743L12 13.4794L17.0719 8.40743C17.2916 8.18776 17.6477 8.18776 17.8674 8.40743L18.1326 8.67263C18.3522 8.89231 18.3522 9.24841 18.1326 9.46808L12.3977 15.203Z"
                                fill="currentColor"
                            />
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SearchSelect;