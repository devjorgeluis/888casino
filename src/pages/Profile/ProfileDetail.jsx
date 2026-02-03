import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../AppContext";
import Footer from "../../components/Layout/Footer";

const ProfileDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { contextData } = useContext(AppContext);

    const formatDateDisplay = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "-";

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    };

    useEffect(() => {
        if (!contextData?.session) {
            navigate("/");
        }
    }, [contextData?.session, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <>
            <div className="container flex h-full flex-col items-center justify-center gap-6 pb-6 pt-10 sm:pb-12 sm:pt-16">
                <h1 className="text-center text-5xl font-bold tracking-tight text-white">
                    Ajustes de la cuenta
                </h1>

                <div className="w-full max-w-[calc(100vw-1.5rem)] overflow-hidden sm:mb-12">
                    <div className="flex cursor-grab select-none items-center gap-2 overflow-x-auto [scrollbar-width:none] lg:justify-center [&::-webkit-scrollbar]:hidden">
                        <button
                            onClick={() => navigate("/profile/transaction")}
                            className="aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 disabled:cursor-not-allowed max-w-full flex-shrink-0 text-ellipsis ring-0 focus:outline-none focus-visible:outline-0 gap-3 disabled:text-theme-secondary-500 disabled:opacity-30 focus:text-theme-secondary-600 hover:text-theme-secondary-600 inline-flex items-center justify-center !border-b-theme-secondary/20 z-1 relative top-px rounded-none !border-b-[0.13rem] bg-transparent p-2 text-center text-base font-bold !leading-normal text-white hover:!border-b-theme-secondary hover:bg-none lg:p-4 lg:text-sm"
                        >
                            <span>Historial de transacciones</span>
                        </button>
                        <button
                            onClick={() => navigate("/profile/detail")}
                            className="aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 disabled:cursor-not-allowed max-w-full flex-shrink-0 text-ellipsis ring-0 focus:outline-none focus-visible:outline-0 gap-3 disabled:text-theme-secondary-500 disabled:opacity-30 focus:text-theme-secondary-600 hover:text-theme-secondary-600 inline-flex items-center justify-center !border-b-theme-secondary/20 z-1 relative top-px rounded-none !border-b-[0.13rem] bg-transparent p-2 text-center text-base font-bold !leading-normal text-white hover:!border-b-theme-secondary hover:bg-none lg:p-4 lg:text-sm !border-b-theme-secondary !text-theme-secondary h-full !border-b-[0.225rem] [&:not(.link)]:!border-b-theme-secondary"
                        >
                            <span>Mis Detalles</span>
                        </button>
                        <button
                            onClick={() => navigate("/profile/history")}
                            className="aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 disabled:cursor-not-allowed max-w-full flex-shrink-0 text-ellipsis ring-0 focus:outline-none focus-visible:outline-0 gap-3 disabled:text-theme-secondary-500 disabled:opacity-30 focus:text-theme-secondary-600 hover:text-theme-secondary-600 inline-flex items-center justify-center !border-b-theme-secondary/20 z-1 relative top-px rounded-none !border-b-[0.13rem] bg-transparent p-2 text-center text-base font-bold !leading-normal text-white hover:!border-b-theme-secondary hover:bg-none lg:p-4 lg:text-sm"
                        >
                            <span>Historial de Casino</span>
                        </button>
                    </div>
                </div>

                <form
                    className="grid grid-cols-12 gap-x-4 formkit-form gap-y-4 pb-6 sm:gap-y-12 lg:gap-x-12 lg:gap-y-0 lg:px-14 [&amp;_.formkit-outer:last-of-type]:!mb-0"
                    id="input_74"
                    name="form_18"
                >
                    <div className="col-span-12 flex flex-col gap-6 lg:col-span-6">
                        <div className="grid grid-cols-12">
                            <div
                                className="col-span-12 group flex-grow min-w-0 text-base mb-1.5 data-[disabled]:select-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none formkit-outer mb-6"
                                data-family="text"
                                data-type="text"
                                data-disabled="true"
                                data-floating-label="true"
                                data-complete="true"
                            >
                                <div className="mb-2 flex flex-col items-start justify-start mb-1.5 formkit-wrapper !mb-0">
                                    <div className="text-base relative w-full h-12 rounded-lg bg-dark-grey-950/50 flex items-stretch border border-theme-secondary/10 focus-within:ring-2 [&amp;_svg]:text-dark-grey-50/20 [&amp;_svg]:focus-within:text-dark-grey-50/50 group-data-[disabled]:!cursor-not-allowed group-data-[invalid]:border-theme-status-error/20 group-data-[invalid]:bg-theme-status-error/5 [.bg-dark-grey-700_&amp;]:bg-dark-grey-600  formkit-inner">
                                        <input
                                            autoComplete="email"
                                            className="peer appearance-none outline-none [color-scheme:light] placeholder:text-dark-grey-50/50 text-base text-dark-grey-50 font-medium min-h-5 bg-transparent grow w-full h-12 border-none p-3 py-4 focus:ring-0 focus:text-dark-grey-50 data-[placeholder]:max-w-full data-[placeholder]:text-ellipsis data-[placeholder]:overflow-hidden group-data-[invalid]:text-theme-status-error group-data-[empty]:text-dark-grey-50 group-data-[prefix-icon]:!pl-12 [&amp;::selection]:bg-primary-800  formkit-input"
                                            type="text"
                                            disabled=""
                                            name="email"
                                            id="input_75"
                                            aria-required="true"
                                            defaultValue={contextData?.session?.user?.email || "-"}
                                        />
                                        <label
                                            className="block text-white text-base lg:text-sm !leading-5 mb-2 formkit-label !leading-normal"
                                            htmlFor="input_75"
                                            style={{
                                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                                left: "calc(-0.25em + 12px)",
                                            }}
                                        >
                                            Correo electrónico
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="col-span-12 group flex-grow min-w-0 text-base mb-1.5 data-[disabled]:select-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none formkit-outer mb-6"
                                data-family="text"
                                data-type="text"
                                data-disabled="true"
                                data-floating-label="true"
                                data-complete="true"
                            >
                                <div className="mb-2 flex flex-col items-start justify-start mb-1.5 formkit-wrapper !mb-0">
                                    <div className="text-base relative w-full h-12 rounded-lg bg-dark-grey-950/50 flex items-stretch border border-theme-secondary/10 focus-within:ring-2 [&amp;_svg]:text-dark-grey-50/20 [&amp;_svg]:focus-within:text-dark-grey-50/50 group-data-[disabled]:!cursor-not-allowed group-data-[invalid]:border-theme-status-error/20 group-data-[invalid]:bg-theme-status-error/5 [.bg-dark-grey-700_&amp;]:bg-dark-grey-600  formkit-inner">
                                        <input
                                            className="peer appearance-none outline-none [color-scheme:light] placeholder:text-dark-grey-50/50 text-base text-dark-grey-50 font-medium min-h-5 bg-transparent grow w-full h-12 border-none p-3 py-4 focus:ring-0 focus:text-dark-grey-50 data-[placeholder]:max-w-full data-[placeholder]:text-ellipsis data-[placeholder]:overflow-hidden group-data-[invalid]:text-theme-status-error group-data-[empty]:text-dark-grey-50 group-data-[prefix-icon]:!pl-12 [&amp;::selection]:bg-primary-800  formkit-input"
                                            type="text"
                                            disabled=""
                                            name="firstName"
                                            id="input_76"
                                            aria-required="true"
                                            defaultValue={contextData?.session?.user?.username || "-"}
                                        />
                                        <label
                                            className="block text-white text-base lg:text-sm !leading-5 mb-2 formkit-label !leading-normal"
                                            htmlFor="input_76"
                                            style={{
                                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                                left: "calc(-0.25em + 12px)",
                                            }}
                                        >
                                            Nombre
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="col-span-12 group flex-grow min-w-0 text-base mb-1.5 data-[disabled]:select-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none formkit-outer mb-6"
                                data-family="text"
                                data-type="text"
                                data-disabled="true"
                                data-floating-label="true"
                                data-complete="true"
                            >
                                <div className="mb-2 flex flex-col items-start justify-start mb-1.5 formkit-wrapper !mb-0">
                                    <div className="text-base relative w-full h-12 rounded-lg bg-dark-grey-950/50 flex items-stretch border border-theme-secondary/10 focus-within:ring-2 [&amp;_svg]:text-dark-grey-50/20 [&amp;_svg]:focus-within:text-dark-grey-50/50 group-data-[disabled]:!cursor-not-allowed group-data-[invalid]:border-theme-status-error/20 group-data-[invalid]:bg-theme-status-error/5 [.bg-dark-grey-700_&amp;]:bg-dark-grey-600  formkit-inner">
                                        <input
                                            className="peer appearance-none outline-none [color-scheme:light] placeholder:text-dark-grey-50/50 text-base text-dark-grey-50 font-medium min-h-5 bg-transparent grow w-full h-12 border-none p-3 py-4 focus:ring-0 focus:text-dark-grey-50 data-[placeholder]:max-w-full data-[placeholder]:text-ellipsis data-[placeholder]:overflow-hidden group-data-[invalid]:text-theme-status-error group-data-[empty]:text-dark-grey-50 group-data-[prefix-icon]:!pl-12 [&amp;::selection]:bg-primary-800  formkit-input"
                                            type="text"
                                            disabled=""
                                            name="lastName"
                                            id="input_77"
                                            aria-required="true"
                                            defaultValue={contextData?.session?.user?.last_name || "-"}
                                        />
                                        <label
                                            className="block text-white text-base lg:text-sm !leading-5 mb-2 formkit-label !leading-normal"
                                            htmlFor="input_77"
                                            style={{
                                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                                left: "calc(-0.25em + 12px)",
                                            }}
                                        >
                                            Apellido
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="col-span-12 group flex-grow min-w-0 text-base mb-1.5 data-[disabled]:select-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none mb-4 formkit-outer mb-6"
                                data-family="text"
                                data-type="datepicker"
                                data-disabled="true"
                                data-floating-label="true"
                                data-complete="true"
                            >
                                <div className="mb-2 flex flex-col items-start justify-start mb-1.5 formkit-wrapper !mb-0">
                                    <div className="text-base relative w-full h-12 rounded-lg bg-dark-grey-950/50 flex items-stretch border border-theme-secondary/10 focus-within:ring-2 [&amp;_svg]:text-dark-grey-50/20 [&amp;_svg]:focus-within:text-dark-grey-50/50 group-data-[disabled]:!cursor-not-allowed group-data-[invalid]:border-theme-status-error/20 group-data-[invalid]:bg-theme-status-error/5 [.bg-dark-grey-700_&amp;]:bg-dark-grey-600 pl-0 formkit-inner">
                                        <div
                                            className="dp__main dp__theme_light"
                                            data-datepicker-instance=""
                                        >
                                            <div>
                                                <div className="dp__input_wrap">
                                                    <input
                                                        className="dp__pointer dp__input_readonly dp__input dp__input_icon_pad dp__input_reg"
                                                        defaultValue={
                                                            formatDateDisplay(
                                                                contextData?.session?.user?.created_at
                                                            ) || "-"
                                                        }
                                                    />
                                                    <div>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 32 32"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                            className="dp__input_icon dp__input_icons"
                                                            role="img"
                                                            aria-label="Calendar icon"
                                                        >
                                                            <path d="M29.333 8c0-2.208-1.792-4-4-4h-18.667c-2.208 0-4 1.792-4 4v18.667c0 2.208 1.792 4 4 4h18.667c2.208 0 4-1.792 4-4v-18.667zM26.667 8v18.667c0 0.736-0.597 1.333-1.333 1.333 0 0-18.667 0-18.667 0-0.736 0-1.333-0.597-1.333-1.333 0 0 0-18.667 0-18.667 0-0.736 0.597-1.333 1.333-1.333 0 0 18.667 0 18.667 0 0.736 0 1.333 0.597 1.333 1.333z"></path>
                                                            <path d="M20 2.667v5.333c0 0.736 0.597 1.333 1.333 1.333s1.333-0.597 1.333-1.333v-5.333c0-0.736-0.597-1.333-1.333-1.333s-1.333 0.597-1.333 1.333z"></path>
                                                            <path d="M9.333 2.667v5.333c0 0.736 0.597 1.333 1.333 1.333s1.333-0.597 1.333-1.333v-5.333c0-0.736-0.597-1.333-1.333-1.333s-1.333 0.597-1.333 1.333z"></path>
                                                            <path d="M4 14.667h24c0.736 0 1.333-0.597 1.333-1.333s-0.597-1.333-1.333-1.333h-24c-0.736 0-1.333 0.597-1.333 1.333s0.597 1.333 1.333 1.333z"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <label
                                            className="block text-white text-base lg:text-sm !leading-5 mb-2 formkit-label !leading-normal"
                                            htmlFor="input_79"
                                        >
                                            Fecha de nacimiento
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-theme-secondary/10 col-span-12 h-fit rounded-lg border p-4 sm:p-9 lg:col-span-6 lg:pb-3">
                        <h6 className="mb-4 py-3 text-sm font-bold uppercase tracking-wider text-white/40 sm:mb-6 lg:text-xs">
                            Información de contacto
                        </h6>
                        <div className="grid grid-cols-12 gap-x-4 [&amp;_.formkit-outer:last-of-type]:!mb-0 [&amp;_.formkit-outer]:mb-4 [&amp;_.formkit-outer]:sm:mb-6">
                            <div
                                className="col-span-12 group flex-grow min-w-0 text-base mb-1.5 data-[disabled]:select-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none formkit-outer mb-6"
                                data-family="text"
                                data-type="phone"
                                data-disabled="true"
                                data-floating-label="true"
                                data-complete="true"
                            >
                                <div className="mb-2 flex flex-col items-start justify-start  formkit-wrapper !mb-0">
                                    <div className="text-base relative w-full h-12 rounded-lg bg-dark-grey-950/50 flex items-stretch border border-theme-secondary/10 focus-within:ring-2 [&amp;_svg]:text-dark-grey-50/20 [&amp;_svg]:focus-within:text-dark-grey-50/50 group-data-[disabled]:!cursor-not-allowed group-data-[invalid]:border-theme-status-error/20 group-data-[invalid]:bg-theme-status-error/5 [.bg-dark-grey-700_&amp;]:bg-dark-grey-600 formkit-inner">
                                        <div className="static" data-headlessui-state="">
                                            <div
                                                id="headlessui-combobox-button-v-0-24-2"
                                                role="button"
                                                className='[[&amp;&gt;button&gt;span:first-child]:mt-[0.55rem] [&amp;[data-headlessui-state="open"]&gt;button]:bg-dark-grey-900 [&amp;[data-headlessui-state="open"]&gt;button]:!ring-theme-secondary/20 flex h-[2.875rem] w-full items-center [&amp;[data-headlessui-state="open"]&gt;button&gt;span:last-child&gt;svg]:rotate-180'
                                            >
                                                <button
                                                    className="relative w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 inline-flex items-center text-left !ring-theme-secondary/10 cursor-pointer text-white h-12 min-w-[unset] !pl-12 !pr-3 !leading-[normal] shadow-none !ring-0 [&amp;&gt;span:last-child&gt;svg]:h-6 [&amp;&gt;span:last-child&gt;svg]:w-6 [&amp;&gt;span:last-child&gt;svg]:text-white/20 [&amp;&gt;span:last-of-type]:end-auto [&amp;&gt;span:last-of-type]:start-0 [&amp;&gt;span:last-of-type]:pt-2 rounded-md text-md gap-x-2 py-2 px-6 pb-1 pt-3.5 bg-transparent focus:ring-0 focus:shadow-none pe-10"
                                                    type="button"
                                                >
                                                    <span className="block truncate [&amp;&gt;svg]:h-5 [&amp;&gt;svg]:w-5">
                                                        +595
                                                    </span>
                                                    <span className="absolute inset-y-0 end-0 flex items-center pointer-events-none px-3">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                                            aria-hidden="true"
                                                            role="img"
                                                            className="iconify iconify--heroicons flex-shrink-0 text-gray-400 dark:text-gray-500 h-5 w-5"
                                                            width="1em"
                                                            height="1em"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fill="currentColor"
                                                                fillRule="evenodd"
                                                                d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06"
                                                                clipRule="evenodd"
                                                            ></path>
                                                        </svg>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                        <input
                                            id="input_80"
                                            type="text"
                                            className="[&amp;::selection]:bg-primary-800 h-12 w-full rounded-r-lg bg-transparent py-2.5 outline-none"
                                            defaultValue={contextData?.session?.user?.phone || "-"}
                                        />
                                        <label
                                            className="block text-white text-base lg:text-sm !leading-5 mb-2 text-dark-grey-100 formkit-label !leading-normal"
                                            htmlFor="input_80"
                                            style={{
                                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                                left: "calc(-0.25em + 12px)",
                                            }}
                                        >
                                            Teléfono móvil
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="col-span-12 group flex-grow min-w-0 text-base mb-1.5 data-[disabled]:select-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none formkit-outer mb-6"
                                data-family="text"
                                data-type="text"
                                data-disabled="true"
                                data-floating-label="true"
                                data-complete="true"
                            >
                                <div className="mb-2 flex flex-col items-start justify-start mb-1.5 formkit-wrapper !mb-0">
                                    <div className="text-base relative w-full h-12 rounded-lg bg-dark-grey-950/50 flex items-stretch border border-theme-secondary/10 focus-within:ring-2 [&amp;_svg]:text-dark-grey-50/20 [&amp;_svg]:focus-within:text-dark-grey-50/50 group-data-[disabled]:!cursor-not-allowed group-data-[invalid]:border-theme-status-error/20 group-data-[invalid]:bg-theme-status-error/5 [.bg-dark-grey-700_&amp;]:bg-dark-grey-600  formkit-inner">
                                        <input
                                            className="peer appearance-none outline-none [color-scheme:light] placeholder:text-dark-grey-50/50 text-base text-dark-grey-50 font-medium min-h-5 bg-transparent grow w-full h-12 border-none p-3 py-4 focus:ring-0 focus:text-dark-grey-50 data-[placeholder]:max-w-full data-[placeholder]:text-ellipsis data-[placeholder]:overflow-hidden group-data-[invalid]:text-theme-status-error group-data-[empty]:text-dark-grey-50 group-data-[prefix-icon]:!pl-12 [&amp;::selection]:bg-primary-800  formkit-input"
                                            type="text"
                                            disabled=""
                                            name="address1"
                                            id="input_81"
                                            aria-required="true"
                                            defaultValue={contextData?.session?.user?.address || "-"}
                                        />
                                        <label
                                            className="block text-white text-base lg:text-sm !leading-5 mb-2 formkit-label !leading-normal"
                                            htmlFor="input_81"
                                            style={{
                                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                                left: "calc(-0.25em + 12px)",
                                            }}
                                        >
                                            Dirección
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <Footer />
            </div>
        </>
    );
};

export default ProfileDetail;
