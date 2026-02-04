import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import Footer from "../../components/Layout/Footer";
import LoadApi from "../../components/Loading/LoadApi";

const ProfileTransaction = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { contextData } = useContext(AppContext);
    const { isMobile } = useOutletContext();

    const getDefaultDates = () => {
        const now = new Date();
        const currentMonthFirst = new Date(now.getFullYear(), now.getMonth(), 1);
        const nextMonthFirst = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        return { 
            dateFrom: formatDateForInput(currentMonthFirst), 
            dateTo: formatDateForInput(nextMonthFirst) 
        };
    };

    const formatDateForInput = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [filters, setFilters] = useState(getDefaultDates());
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

    const formatOperation = (operation) => {
        return operation === "change_balance" ? "change balance" : operation;
    };

    const handleDateChange = (e, name) => {
        setFilters((prev) => ({ 
            ...prev, 
            [name]: e.target.value 
        }));
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
            length: pagination.length,
            ...(filters.dateFrom && { date_from: filters.dateFrom }),
            ...(filters.dateTo && { date_to: filters.dateTo })
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
    }, [filters.dateFrom, filters.dateTo]);

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
        <div className="container py-10 pb-6 sm:pb-12 sm:pt-16">
            <div className="grid grid-cols-1 [grid-template-areas:'heading'_'filters'_'content']">
                <h1 className="mb-6 text-center text-5xl font-bold -tracking-[0.72px] text-white sm:mb-12 sm:-tracking-[0.96px]">
                    Historial de transacciones
                </h1>
                
                <div className="mb-6 grid w-full grid-cols-12 gap-2 [grid-area:filters] sm:mb-12 lg:flex lg:flex-row lg:justify-between lg:gap-4">
                    <div className="first-of-type:col-span-12 col-span-12">
                        <div className="flex gap-2">
                            <div className="col-span-12 group flex-grow min-w-0 text-base mb-1.5 data-[disabled]:select-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none formkit-outer filter-date !-mb-1.5 lg:min-w-[12.25rem]" 
                                 data-family="text" data-type="date" data-suffix-icon="true" data-floating-label="true">
                                <div className="mb-2 flex flex-col items-start justify-start mb-1.5 formkit-wrapper">
                                    <div className="text-base relative w-full h-12 rounded-lg bg-dark-grey-950/50 flex items-stretch border border-theme-secondary/10 focus-within:ring-2 [&_svg]:text-dark-grey-50/20 [&_svg]:focus-within:text-dark-grey-50/50 group-data-[disabled]:!cursor-not-allowed group-data-[invalid]:border-theme-status-error/20 group-data-[invalid]:bg-theme-status-error/5 [.bg-dark-grey-700_&]:bg-dark-grey-600 text-dark-grey-50 formkit-inner">
                                        <input 
                                            className="peer appearance-none outline-none [color-scheme:light] placeholder:text-dark-grey-50/50 text-base text-dark-grey-50 font-medium min-h-5 bg-transparent grow w-full h-12 border-none p-3 py-4 focus:ring-0 focus:text-dark-grey-50 data-[placeholder]:max-w-full data-[placeholder]:text-ellipsis data-[placeholder]:overflow-hidden group-data-[invalid]:text-theme-status-error group-data-[empty]:text-dark-grey-50 group-data-[prefix-icon]:!pl-12 [&::selection]:bg-primary-800 !min-h-12 [&::-webkit-inner-spin-button]:hidden [&::-webkit-date-and-time-value]:text-left [&::-webkit-calendar-picker-indicator]:h-[100%] [&::-webkit-calendar-picker-indicator]:w-[70%] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 formkit-input" 
                                            type="date" 
                                            name="startDate" 
                                            id="input_30" 
                                            value={filters.dateFrom}
                                            onChange={(e) => handleDateChange(e, 'dateFrom')}
                                        />
                                        <label className="block text-white text-base lg:text-sm !leading-5 mb-2 formkit-label" htmlFor="input_30"
                                            style={{
                                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                                left: "calc(-0.25em + 12px)",
                                            }}
                                        >
                                            Fecha de inicio
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-12 group flex-grow min-w-0 text-base mb-1.5 data-[disabled]:select-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none formkit-outer !-mb-1.5 data-[disabled]:!opacity-100 lg:min-w-[12.25rem]" 
                                 data-family="text" data-type="date" data-suffix-icon="true" data-floating-label="true">
                                <div className="mb-2 flex flex-col items-start justify-start mb-1.5 formkit-wrapper">
                                    <div className="text-base relative w-full h-12 rounded-lg bg-dark-grey-950/50 flex items-stretch border border-theme-secondary/10 focus-within:ring-2 [&_svg]:text-dark-grey-50/20 [&_svg]:focus-within:text-dark-grey-50/50 group-data-[disabled]:!cursor-not-allowed group-data-[invalid]:border-theme-status-error/20 group-data-[invalid]:bg-theme-status-error/5 [.bg-dark-grey-700_&]:bg-dark-grey-600 text-dark-grey-50 formkit-inner">
                                        <input 
                                            className="peer appearance-none outline-none [color-scheme:light] placeholder:text-dark-grey-50/50 text-base text-dark-grey-50 font-medium min-h-5 bg-transparent grow w-full h-12 border-none p-3 py-4 focus:ring-0 focus:text-dark-grey-50 data-[placeholder]:max-w-full data-[placeholder]:text-ellipsis data-[placeholder]:overflow-hidden group-data-[invalid]:text-theme-status-error group-data-[empty]:text-dark-grey-50 group-data-[prefix-icon]:!pl-12 [&::selection]:bg-primary-800 !min-h-12 [&::-webkit-inner-spin-button]:hidden [&::-webkit-date-and-time-value]:text-left [&::-webkit-calendar-picker-indicator]:h-[100%] [&::-webkit-calendar-picker-indicator]:w-[70%] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 formkit-input" 
                                            type="date" 
                                            name="endDate" 
                                            id="input_31" 
                                            value={filters.dateTo}
                                            onChange={(e) => handleDateChange(e, 'dateTo')}
                                        />
                                        <label className="block text-white text-base lg:text-sm !leading-5 mb-2 formkit-label" htmlFor="input_31" 
                                            style={{
                                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                                left: "calc(-0.25em + 12px)",
                                            }}
                                        >
                                            Fecha final
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="[grid-area:content]">
                    {loading ? (
                        <div className="flex justify-center items-center py-10">
                            <LoadApi />
                        </div>
                    ) : (
                        <div className="border-dark-grey-700 rounded-md border">
                            <div className="relative overflow-x-auto">
                                <table className="min-w-full table-fixed dark:divide-gray-700 divide-dark-grey-700 divide-y">
                                    <thead className="relative">
                                        <tr>
                                            <th scope="col" className="rtl:text-right text-left whitespace-nowrap py-3.5 pl-4 pr-3.5 text-base font-normal !leading-normal first-of-type:pr-4 last-of-type:pr-4 lg:text-sm lg:font-bold [&_button]:m-0 [&_button]:gap-2 [&_button]:p-0 [&_button]:font-normal [&_button]:!leading-normal [&_button]:!text-white [&_button]:hover:bg-transparent [&_button]:lg:text-sm [&_button]:lg:font-bold [&_svg]:h-4 [&_svg]:w-4 px-4 py-3.5 text-white font-bold text-sm !leading-tight">
                                                <span>Fecha</span>
                                            </th>
                                            <th scope="col" className="rtl:text-right text-left whitespace-nowrap py-3.5 pl-4 pr-3.5 text-base font-normal !leading-normal first-of-type:pr-4 last-of-type:pr-4 lg:text-sm lg:font-bold [&_button]:m-0 [&_button]:gap-2 [&_button]:p-0 [&_button]:font-normal [&_button]:!leading-normal [&_button]:!text-white [&_button]:hover:bg-transparent [&_button]:lg:text-sm [&_button]:lg:font-bold [&_svg]:h-4 [&_svg]:w-4 px-4 py-3.5 text-white font-bold text-sm !leading-tight">
                                                <span>Operación</span>
                                            </th>
                                            <th scope="col" className="rtl:text-right text-left whitespace-nowrap py-3.5 pl-4 pr-3.5 text-base font-normal !leading-normal first-of-type:pr-4 last-of-type:pr-4 lg:text-sm lg:font-bold [&_button]:m-0 [&_button]:gap-2 [&_button]:p-0 [&_button]:font-normal [&_button]:!leading-normal [&_button]:!text-white [&_button]:hover:bg-transparent [&_button]:lg:text-sm [&_button]:lg:font-bold [&_svg]:h-4 [&_svg]:w-4 px-4 py-3.5 text-white font-bold text-sm !leading-tight">
                                                <span>Monto</span>
                                            </th>
                                            <th scope="col" className="rtl:text-right text-left whitespace-nowrap py-3.5 pl-4 pr-3.5 text-base font-normal !leading-normal first-of-type:pr-4 last-of-type:pr-4 lg:text-sm lg:font-bold [&_button]:m-0 [&_button]:gap-2 [&_button]:p-0 [&_button]:font-normal [&_button]:!leading-normal [&_button]:!text-white [&_button]:hover:bg-transparent [&_button]:lg:text-sm [&_button]:lg:font-bold [&_svg]:h-4 [&_svg]:w-4 px-4 py-3.5 text-white font-bold text-sm !leading-tight">
                                                <span>Balance Previo</span>
                                            </th>
                                            <th scope="col" className="rtl:text-right text-left whitespace-nowrap py-3.5 pl-4 pr-3.5 text-base font-normal !leading-normal first-of-type:pr-4 last-of-type:pr-4 lg:text-sm lg:font-bold [&_button]:m-0 [&_button]:gap-2 [&_button]:p-0 [&_button]:font-normal [&_button]:!leading-normal [&_button]:!text-white [&_button]:hover:bg-transparent [&_button]:lg:text-sm [&_button]:lg:font-bold [&_svg]:h-4 [&_svg]:w-4 px-4 py-3.5 text-white font-bold text-sm !leading-tight">
                                                <span>Balance Posterior</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="dark:divide-gray-800 divide-dark-grey-800 divide-y">
                                        {transactions.length > 0 ? (
                                            transactions.map((transaction, index) => (
                                                <tr key={index} className="hover:bg-dark-grey-900/50">
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3.5 text-sm !leading-tight first-of-type:pr-4 last-of-type:pr-4 lg:pl-6 text-white">
                                                        {formatDateDisplay(transaction.created_at)}
                                                    </td>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3.5 text-sm !leading-tight first-of-type:pr-4 last-of-type:pr-4 lg:pl-6 text-white">
                                                        {transaction.type}
                                                    </td>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3.5 text-sm !leading-tight first-of-type:pr-4 last-of-type:pr-4 lg:pl-6 text-white">
                                                        {formatBalance(transaction.value || transaction.amount || 0)}
                                                    </td>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3.5 text-sm !leading-tight first-of-type:pr-4 last-of-type:pr-4 lg:pl-6 text-white">
                                                        {formatBalance(transaction.to_current_balance) || 0}
                                                    </td>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3.5 text-sm !leading-tight first-of-type:pr-4 last-of-type:pr-4 lg:pl-6 text-white">
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
                                                        <p className="dark:text-white text-center text-sm !leading-tight text-white">
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
                                <div className="flex items-center justify-between border-t border-dark-grey-700 px-4 py-3 sm:px-6">
                                    <div className="flex flex-1 justify-between sm:hidden">
                                        <button
                                            onClick={handlePrevPage}
                                            disabled={pagination.currentPage === 1}
                                            className="relative inline-flex items-center rounded-md border border-dark-grey-700 bg-dark-grey-900 px-4 py-2 text-sm font-medium text-white hover:bg-dark-grey-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Anterior
                                        </button>
                                        <button
                                            onClick={handleNextPage}
                                            disabled={pagination.currentPage === totalPages}
                                            className="relative ml-3 inline-flex items-center rounded-md border border-dark-grey-700 bg-dark-grey-900 px-4 py-2 text-sm font-medium text-white hover:bg-dark-grey-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Siguiente
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-white">
                                                Mostrando <span className="font-medium">{pagination.start + 1}</span> a{' '}
                                                <span className="font-medium">
                                                    {Math.min(pagination.start + pagination.length, pagination.totalRecords)}
                                                </span>{' '}
                                                de <span className="font-medium">{pagination.totalRecords}</span> resultados
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                                <button
                                                    onClick={handleFirstPage}
                                                    disabled={pagination.currentPage === 1}
                                                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-white ring-1 ring-inset ring-dark-grey-700 hover:bg-dark-grey-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <span className="sr-only">Primera</span>
                                                    «
                                                </button>
                                                <button
                                                    onClick={handlePrevPage}
                                                    disabled={pagination.currentPage === 1}
                                                    className="relative inline-flex items-center px-2 py-2 text-white ring-1 ring-inset ring-dark-grey-700 hover:bg-dark-grey-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <span className="sr-only">Anterior</span>
                                                    ‹
                                                </button>
                                                
                                                {visiblePages.map((page) => (
                                                    <button
                                                        key={page}
                                                        onClick={() => handlePageChange(page)}
                                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-dark-grey-700 focus:z-20 focus:outline-offset-0 ${
                                                            pagination.currentPage === page
                                                                ? 'bg-theme-secondary-500 text-white'
                                                                : 'text-white hover:bg-dark-grey-800'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}
                                                
                                                <button
                                                    onClick={handleNextPage}
                                                    disabled={pagination.currentPage === totalPages}
                                                    className="relative inline-flex items-center px-2 py-2 text-white ring-1 ring-inset ring-dark-grey-700 hover:bg-dark-grey-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <span className="sr-only">Siguiente</span>
                                                    ›
                                                </button>
                                                <button
                                                    onClick={handleLastPage}
                                                    disabled={pagination.currentPage === totalPages}
                                                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-white ring-1 ring-inset ring-dark-grey-700 hover:bg-dark-grey-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <span className="sr-only">Última</span>
                                                    »
                                                </button>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProfileTransaction;