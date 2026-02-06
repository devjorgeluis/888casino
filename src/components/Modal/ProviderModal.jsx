import IconClose from "/src/assets/svg/close.svg";

const ProviderModal = ({
    isOpen,
    onClose,
    onSelectProvider,
    categories = [],
}) => {
    if (!isOpen) return null;

    return (
        <div className="sc-eZfbsf dLcuaa cy-right-drawer open">
            <div id="0629074e-9884-446c-843f-ad65d099db79" className="sc-bgHAhq qxkZi">
                <div className="sc-kHnTiV gQWRFm cy-advanced-filters">
                    <div className="sc-dOOUYo jbbHxq">
                        <div className="sc-dGRuPc ebEyDd">Filtrar por</div>
                        <div className="cy-close-advanced-filters-x-button" onClick={onClose}>
                            <img src={IconClose} style={{ width: "2.4rem", height: "2.4rem" }} />
                        </div>
                    </div>
                    <div className="sc-gSXHT iEojAo">
                        <div className="sc-jEwLBR iikbvB">
                            {categories.map((p, idx) => {
                                return (
                                    <div
                                        className="sc-dRQQXa koQBPX cy-games-filter-category"
                                        key={p.id || idx}
                                        onClick={() => {
                                            onSelectProvider && onSelectProvider(p);
                                        }}
                                    >
                                        <div className="sc-beDqNP ioNcnr">
                                            <div className="sc-PMMLq gEtmsM">{p.name}</div>
                                            <span className="sc-iAA-Duq hLHgHW">()</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default ProviderModal;