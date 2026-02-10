import { useContext, useRef, useState, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { callApi } from "../../utils/Utils";
import LoadApi from "../Loading/LoadApi";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import IconDeposit from "/src/assets/svg/deposit.svg";
import IconRetiro from "/src/assets/svg/retiro.svg";
import IconClose from "/src/assets/svg/close.svg";

const HistoryModal = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [pagination, setPagination] = useState({
        start: 0,
        length: 10,
        totalRecords: 0,
        currentPage: 1,
    });

    const { contextData } = useContext(AppContext);
    const swiperRef = useRef(null);
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    if (!isOpen) return null;

    const formatBalance = (value) => {
        const num = parseFloat(value);
        if (isNaN(num)) return "0.00";
        return num.toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const handlePrevClick = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slidePrev();
        }
    };

    const handleNextClick = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideNext();
        }
    };

    const fetchHistory = () => {
        setLoading(true);

        let queryParams = new URLSearchParams({
            start: pagination.start,
            length: pagination.length,
        }).toString();

        let apiEndpoint = `/get-transactions?${queryParams}`;

        callApi(
            contextData,
            "GET",
            apiEndpoint,
            (response) => {
                if (response.status === "0" || response.status === 0) {
                    setTransactions(response.data || []);
                    setPagination((prev) => ({
                        ...prev,
                        totalRecords: response.recordsTotal || 0,
                    }));
                } else {
                    setTransactions([]);
                    console.error("API error:", response);
                }
                setLoading(false);
            },
            null
        );
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <div className="sc-eZfbsf dkrway cy-right-drawer open">
            <div
                id="RG_CONTROL_CENTER_FULL_b30d7c37_b6e8_4765_837e_20ba6897c121"
                className="sc-bgHAhq qxkZi"
                style={{ backgroundColor: "rgb(35, 35, 35)" }}
            >
                <div
                    id="sz-fulldashboard-wrapper"
                    className="FullDashboard__FulldashboardWrapper-safeZone__sc-110bd5c-0 dbKkqU sz-brand0 sz-subbrand0 fulldashboard-wrapper sz-brand0 sz-subbrand0"
                    lang="SPA"
                >
                    <div
                        className="HeaderFullDashboard__HeaderBox-safeZone__sc-12jr7j1-0 BtcJD fd-header"
                    >
                        <div
                            className="click__spacer right__spacer"
                            onClick={onClose}
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                src={IconClose}
                                style={{ width: 18, height: 18 }}
                                className="Icons-safeZone__sc-1ygnqgu-0 IconsList__Svg-safeZone__sc-1oy48qt-0 fRNbHj hxSYDr close__icon"
                            />
                        </div>
                        <h2>Centro de control</h2>
                    </div>
                    <div className="fulldashboard__content">
                        <div>
                            {
                                loading ? <LoadApi /> :
                                    <div
                                        className="Activity__ActivityCardsStyle-safeZone__sc-139hfv-0 dOEknw activity__cards activity__cards"
                                    >
                                        <h3 className="control__titles">Actividad</h3>
                                        <div id="carousel-activity" className="cards__content">
                                            <div
                                                className="CarouselControls__CarouselNav-safeZone__sc-83dil-0 kafnTt carousel__controls"
                                            >
                                                <div
                                                    className="prev__control"
                                                    ref={prevRef}
                                                    onClick={handlePrevClick}
                                                    style={{ cursor: 'pointer' }}
                                                ></div>
                                                <div
                                                    className="next__control"
                                                    ref={nextRef}
                                                    onClick={handleNextClick}
                                                    style={{ cursor: 'pointer' }}
                                                ></div>
                                            </div>

                                            {
                                                transactions.length < 3 ? <>
                                                    {transactions.map((tx) => (
                                                        <div
                                                            className="Card__CardBox-safeZone__sc-1d0u3ie-0 jnHIfK card"
                                                            key={tx.id}
                                                            id={`activity-card-${tx.id}`}
                                                        >
                                                            <div className="card__wrapper">
                                                                <h3 className="card__title title__left">
                                                                    <img src={tx.type === 'add' ? IconDeposit : IconRetiro} className="Icons-safeZone__sc-1ygnqgu-0 IconsList__Svg-safeZone__sc-1oy48qt-0 fRNbHj hxSYDr" />
                                                                    <span>{tx.type === 'add' ? 'Depósitos' : 'Retiro'}</span>
                                                                </h3>
                                                                <div className="card__body">${formatBalance(tx.amount)}</div>
                                                                <div>
                                                                    <div
                                                                        className="Tooltip__TooltipIcon-safeZone__sc-1fw0itd-0 jINSfy tooltipIcon"
                                                                    >
                                                                        <span className="tooltip__span">i</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))} </> : <>
                                                    {transactions.map((tx) => (
                                                        <Swiper
                                                            ref={swiperRef}
                                                            modules={[Navigation, Pagination]}
                                                            spaceBetween={10}
                                                            slidesPerView={2.2}
                                                            breakpoints={{
                                                                320: { slidesPerView: 2.2 }
                                                            }}
                                                            navigation={{
                                                                prevEl: prevRef.current,
                                                                nextEl: nextRef.current,
                                                            }}
                                                            pagination={{
                                                                clickable: true,
                                                                el: '.swiper-pagination',
                                                            }}
                                                            loop={false}
                                                            onSwiper={(swiper) => {
                                                                setTimeout(() => {
                                                                    if (prevRef.current && nextRef.current) {
                                                                        swiper.params.navigation.prevEl = prevRef.current;
                                                                        swiper.params.navigation.nextEl = nextRef.current;
                                                                        swiper.navigation.init();
                                                                        swiper.navigation.update();
                                                                    }
                                                                });
                                                            }}
                                                            className="swiper-container"
                                                        >
                                                            {transactions.map((tx) => (
                                                                <SwiperSlide
                                                                    key={tx.id}
                                                                    id={`activity-card-${tx.id}`}
                                                                >
                                                                    <div
                                                                        className="Card__CardBox-safeZone__sc-1d0u3ie-0 jnHIfK card"
                                                                    >
                                                                        <div className="card__wrapper">
                                                                            <h3 className="card__title title__left">
                                                                                <img src={tx.type === 'add' ? IconDeposit : IconRetiro} className="Icons-safeZone__sc-1ygnqgu-0 IconsList__Svg-safeZone__sc-1oy48qt-0 fRNbHj hxSYDr" />
                                                                                <span>{tx.type === 'add' ? 'Depósitos' : 'Retiro'}</span>
                                                                            </h3>
                                                                            <div className="card__body">${formatBalance(tx.amount)}</div>
                                                                            <div>
                                                                                <div
                                                                                    className="Tooltip__TooltipIcon-safeZone__sc-1fw0itd-0 jINSfy tooltipIcon"
                                                                                >
                                                                                    <span className="tooltip__span">i</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </SwiperSlide>
                                                            ))}
                                                        </Swiper>
                                                    ))}
                                                </>
                                            }

                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoryModal;