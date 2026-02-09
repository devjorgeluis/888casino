import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import LoadApi from "../../components/Loading/LoadApi";
import ImgArrowLeft from "/src/assets/svg/arrow-left.svg";
import ImgArrowRight from "/src/assets/svg/arrow-right.svg";

const ProfileTransaction = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { contextData } = useContext(AppContext);

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        start: 0,
        length: 10,
        totalRecords: 0,
        currentPage: 1,
    });

    const formatDateDisplay = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "-";

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    };

    const formatBalance = (value) => {
        const num = parseFloat(value);
        return num.toLocaleString('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const handlePageChange = (page) => {
        setPagination((prev) => ({
            ...prev,
            start: (page - 1) * prev.length,
            currentPage: page,
        }));
    };

    const fetchHistory = () => {
        setLoading(true);

        let queryParams = new URLSearchParams({
            start: pagination.start,
            length: pagination.length
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
        if (!contextData?.session) {
            navigate("/");
        }
    }, [contextData?.session, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        fetchHistory();
    }, [pagination.start, pagination.length]);

    useEffect(() => {
        setPagination(prev => ({
            ...prev,
            start: 0,
            currentPage: 1
        }));
    }, []);

    const totalPages = Math.ceil(pagination.totalRecords / pagination.length);

    const getVisiblePages = () => {
        const delta = 1;
        const visiblePages = [];
        let startPage = Math.max(1, pagination.currentPage - delta);
        let endPage = Math.min(totalPages, pagination.currentPage + delta);

        if (endPage - startPage + 1 < 2 * delta + 1) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + 2 * delta);
            } else {
                startPage = Math.max(1, endPage - 2 * delta);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            visiblePages.push(i);
        }

        return { visiblePages, startPage, endPage };
    };

    const { visiblePages } = getVisiblePages();

    const handleFirstPage = () => handlePageChange(1);
    const handlePrevPage = () => handlePageChange(Math.max(1, pagination.currentPage - 1));
    const handleNextPage = () => handlePageChange(Math.min(totalPages, pagination.currentPage + 1));
    const handleLastPage = () => handlePageChange(totalPages);

    return (
        <div className="gaming-history-page">
            <div className="sc-hHBkOz sc-EHppF dTlmsD cvyYUQ">
                <div className="sc-hFHyhq sc-dxlFKz gnweDQ kacfn cy-top-banner">
                    <img className="sc-gVQeIq WsXOD cy-top-banner-image" alt="" src="https://cgp-cdn.safe-iplay.com/cgp-assets/full/skins/888casino/defaults/images/history_bg_title.png" />
                </div>
                <div className="sc-lgGbPx dMMndc cy-lobby-header">
                    <div className="sc-kIJQPJ fwLZFs">
                        <h1 className="sc-kLzfdg sc-sAqkl hbjpRY hXxZyG cy-lobby-header-title"><span>Historial de juego</span></h1>
                    </div>
                    <div className="sc-ijKvfC sc-jghpLD gUbcNA bqtyIy"></div>
                </div>

                <div className="table-history-container">
                    {loading ? (
                        <div className="flex justify-center items-center mt-5">
                            <LoadApi />
                        </div>
                    ) : (
                        <div className="border-dark-grey-700 rounded-md border">
                            <div className="relative overflow-x-auto">
                                <table className="min-w-full table-fixed dark:divide-gray-700 divide-dark-grey-700 divide-y">
                                    <thead className="relative">
                                        <tr>
                                            <th scope="col" className="rtl:text-right text-center whitespace-nowrap py-3.5 pl-4 pr-3.5 text-md font-normal !leading-normal first-of-type:pr-4 last-of-type:pr-4 lg:text-md lg:font-bold [&_button]:m-0 [&_button]:gap-2 [&_button]:p-0 [&_button]:font-normal [&_button]:!leading-normal [&_button]:!text-white [&_button]:hover:bg-transparent [&_button]:lg:text-md [&_button]:lg:font-bold [&_svg]:h-4 [&_svg]:w-4 px-4 py-3.5 text-white font-bold text-md !leading-tight">
                                                <span>Fecha</span>
                                            </th>
                                            <th scope="col" className="rtl:text-right text-center whitespace-nowrap py-3.5 pl-4 pr-3.5 text-md font-normal !leading-normal first-of-type:pr-4 last-of-type:pr-4 lg:text-md lg:font-bold [&_button]:m-0 [&_button]:gap-2 [&_button]:p-0 [&_button]:font-normal [&_button]:!leading-normal [&_button]:!text-white [&_button]:hover:bg-transparent [&_button]:lg:text-md [&_button]:lg:font-bold [&_svg]:h-4 [&_svg]:w-4 px-4 py-3.5 text-white font-bold text-md !leading-tight">
                                                <span>Monto</span>
                                            </th>
                                            <th scope="col" className="rtl:text-right text-center whitespace-nowrap py-3.5 pl-4 pr-3.5 text-md font-normal !leading-normal first-of-type:pr-4 last-of-type:pr-4 lg:text-md lg:font-bold [&_button]:m-0 [&_button]:gap-2 [&_button]:p-0 [&_button]:font-normal [&_button]:!leading-normal [&_button]:!text-white [&_button]:hover:bg-transparent [&_button]:lg:text-md [&_button]:lg:font-bold [&_svg]:h-4 [&_svg]:w-4 px-4 py-3.5 text-white font-bold text-md !leading-tight">
                                                <span>Balance Previo</span>
                                            </th>
                                            <th scope="col" className="rtl:text-right text-center whitespace-nowrap py-3.5 pl-4 pr-3.5 text-md font-normal !leading-normal first-of-type:pr-4 last-of-type:pr-4 lg:text-md lg:font-bold [&_button]:m-0 [&_button]:gap-2 [&_button]:p-0 [&_button]:font-normal [&_button]:!leading-normal [&_button]:!text-white [&_button]:hover:bg-transparent [&_button]:lg:text-md [&_button]:lg:font-bold [&_svg]:h-4 [&_svg]:w-4 px-4 py-3.5 text-white font-bold text-md !leading-tight">
                                                <span>Balance Posterior</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="dark:divide-gray-800 divide-dark-grey-800 divide-y">
                                        {transactions.length > 0 ? (
                                            transactions.map((transaction, index) => (
                                                <tr key={index} className="hover:bg-dark-grey-900/50">
                                                    <td className="text-center whitespace-nowrap py-4 pl-4 pr-3.5 text-md !leading-tight first-of-type:pr-4 last-of-type:pr-4 lg:pl-6 text-white">
                                                        {formatDateDisplay(transaction.created_at)}
                                                    </td>
                                                    <td className="text-center whitespace-nowrap py-4 pl-4 pr-3.5 text-md !leading-tight first-of-type:pr-4 last-of-type:pr-4 lg:pl-6 text-white">
                                                        {formatBalance(transaction.value || transaction.amount || 0)}
                                                    </td>
                                                    <td className="text-center whitespace-nowrap py-4 pl-4 pr-3.5 text-md !leading-tight first-of-type:pr-4 last-of-type:pr-4 lg:pl-6 text-white">
                                                        {formatBalance(transaction.to_current_balance) || 0}
                                                    </td>
                                                    <td className="text-center whitespace-nowrap py-4 pl-4 pr-3.5 text-md !leading-tight first-of-type:pr-4 last-of-type:pr-4 lg:pl-6 text-white">
                                                        {formatBalance(transaction.to_new_balance) || 0}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5">
                                                    <div className="flex flex-1 flex-col items-center justify-center px-6 py-14 sm:px-14">
                                                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="iconify iconify--tabler dark:text-gray-500 mx-auto mb-4 h-5 w-5 text-white" width="1em" height="1em" viewBox="0 0 24 24">
                                                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4L4 8l8 4l8-4zm-8 8l8 4l8-4M4 16l8 4l8-4"></path>
                                                        </svg>
                                                        <p className="dark:text-white text-center text-md !leading-tight text-white">
                                                            No hay transacciones disponibles.
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {transactions.length > 0 && totalPages > 1 && (
                                <div className="flex items-center justify-between border-t border-dark-grey-700 px-4 py-3 text-md-center">
                                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-md text-white text-center">
                                                Mostrando <span className="font-medium">{pagination.start + 1}</span> a{' '}
                                                <span className="font-medium">
                                                    {Math.min(pagination.start + pagination.length, pagination.totalRecords)}
                                                </span>{' '}
                                                de <span className="font-medium">{pagination.totalRecords}</span> resultados
                                            </p>
                                        </div>
                                        <nav className="text-center" aria-label="Pagination">
                                            <button
                                                onClick={handlePrevPage}
                                                disabled={pagination.currentPage === 1}
                                                className="page-link"
                                            >
                                                <img src={ImgArrowLeft} />
                                            </button>

                                            {visiblePages.map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`page-item ${pagination.currentPage === page ? "active" : ""}`}
                                                >
                                                    {page}
                                                </button>
                                            ))}

                                            <button
                                                onClick={handleNextPage}
                                                disabled={pagination.currentPage === totalPages}
                                                className="page-link"
                                            >
                                                <img src={ImgArrowRight} />
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {
                    !loading && transactions.length === 0 && (
                        <div className="sc-cQvPqr klLChX">
                            <div className="sc-gwtVfY kfAfmA">
                                <div className="sc-VJtBb cfvLht">No se han encontrado más registros de historial.No hemos podido ubicar ningún registro de historial de tus juegos</div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default ProfileTransaction;