import IconFilter from "/src/assets/svg/filter.svg";

const ProviderContainer = ({
    onOpenProviders
}) => {

    return (
        <div className="sc-lgGbPx dMMndc cy-lobby-header">
            <div className="sc-kIJQPJ fwLZFs">
                <h1 className="sc-kLzfdg sc-sAqkl hbjpRY hXxZyG cy-lobby-header-title">
                    <span>Ver todos</span>
                    <div className="sc-igrwpl bBEpim cy-applied-advanced-filters-indicator">
                        <span className="sc-IYxHW bRikFa"></span>
                        <a
                            className="sc-bKhVx kBwCyY cy-open-filters-button"
                            onClick={(e) => { e.preventDefault(); if (onOpenProviders) onOpenProviders(); }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (onOpenProviders) onOpenProviders(); } }}
                        >
                            <img src={IconFilter} className="sc-bqOBqt PBviZ cy-filter-icon" style={{ width: "1.6rem", height: "1.6rem" }} />
                        </a>
                    </div>
                </h1>
            </div>
        </div>
    );
};

export default ProviderContainer;