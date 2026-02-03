import { useState } from "react";
import ImgWhatsAPP from "/src/assets/svg/support-whatsapp.svg";
import ImgTelegram from "/src/assets/svg/support-telegram.svg";
import ImgEmail from "/src/assets/svg/support-email.svg";

const SupportModal = ({ isOpen, onClose, supportWhatsApp, supportTelegram, supportEmail, supportParentOnly, supportParent }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async (text) => {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text || "");
            } else {
                const ta = document.createElement("textarea");
                ta.value = text || "";
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                document.body.removeChild(ta);
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <>
                <div className="alert alert-success" role="alert" id="success-alert" style={{ display: copied ? 'block' : 'none' }}>
                    <span className="alert-span">Se copió al portapapeles.</span>
                </div>

                <div id="support-popup" className="apigames-popup" style={{ display: isOpen ? "flex" : "none" }}>
                    <div id="login-support-overlay" className="apigames-popup-overlay" onClick={onClose}></div>
                    <div className="apigames-popup-content" style={{ opacity: 1 }}>
                        <div className="apigames-popup-content-header">
                            <p className="close support-popup-close" id="support-popup-close" onClick={onClose}>
                                <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CloseIcon">
                                    <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z">
                                    </path>
                                </svg>
                            </p>
                        </div>
                        <div className="apigames-popup-content-container apigames-pl20 apigames-pr20 apigames-pb20">
                            <div>
                                <div className="gradient-title">
                                    <div className="gradient-title-lateral gradient-title-left">
                                        <div></div>
                                    </div>
                                    <div className="gradient-title-no-wrap">{supportParentOnly ? "Contactá a Tu Cajero" : "Soporte técnico"}</div>
                                    <div className="gradient-title-lateral gradient-title-right">
                                        <div></div>
                                    </div>
                                </div>
                                <div className="support-modal-notice">Puedes contactarnos a través de:</div>
                                {supportParentOnly ? (
                                    supportParent ? (
                                        <div className="modal-content-support-network">
                                            <div>
                                                <img src={ImgWhatsAPP} alt="Soporte" />
                                                Whatsapp: {supportParent}
                                            </div>
                                            <button className="btn-copy" type="button" onClick={() => copyToClipboard(supportParent || "")}>
                                                Copiar
                                            </button>
                                        </div>
                                    ) : null
                                ) : (
                                    <>
                                        {supportWhatsApp && (
                                            <div className="modal-content-support-network">
                                                <div>
                                                    <img src={ImgWhatsAPP} alt="Whatsapp" />
                                                    Whatsapp: {supportWhatsApp}
                                                </div>
                                                <button className="btn-copy" type="button" onClick={() => copyToClipboard(supportWhatsApp || "")}>
                                                    Copiar
                                                </button>
                                            </div>
                                        )}
                                        {supportTelegram && (
                                            <div className="modal-content-support-network">
                                                <div>
                                                    <img src={ImgTelegram} alt="Telegram" />
                                                    Telegram: {supportTelegram}
                                                </div>
                                                <button className="btn-copy" type="button" onClick={() => copyToClipboard(supportTelegram || "")}>
                                                    Copiar
                                                </button>
                                            </div>
                                        )}
                                        
                                        {supportEmail && (
                                            <div className="modal-content-support-network">
                                                <div>
                                                    <img src={ImgEmail} alt="Email" />
                                                    E-mail: {supportEmail}
                                                </div>
                                                <button className="btn-copy" type="button" onClick={() => copyToClipboard(supportEmail || "")}>
                                                    Copiar
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                                <div className="full-width text-center margin-top-3em">
                                    <button className="btn-support-close support-popup-close" type="button" onClick={onClose}>Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </>
    );
};

export default SupportModal;