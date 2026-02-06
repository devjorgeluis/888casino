import { useOutletContext, useNavigate } from "react-router-dom";
import ImgCasino from "/src/assets/img/footer-888cas.png";
import ImgSports from "/src/assets/img/footer-888spo.png";

const Footer = () => {
    const navigate = useNavigate();
    const { isSlotsOnly } = useOutletContext();

    return (
        <footer>
            <div className="footer-component-v2">
                <div className="footer-container">
                    <div className="aem-Grid aem-Grid--12 aem-Grid--default--12 ">
                        <div className="experiencefragment aem-GridColumn aem-GridColumn--default--12">
                            <div id="experiencefragment-f74107b615" className="cmp-experiencefragment cmp-experiencefragment--offer-strip-es-footer">
                                <div className="xf-content-height">
                                    <div className="root container responsivegrid">
                                        <div className="root container responsivegrid">
                                            <div id="container-89a2efe923" className="cmp-container">
                                                <div className="offer-banner">
                                                    <div className="section section-cta">
                                                        <div className="footer-banner-text">
                                                            <span className="footer-banner-second-title">¿PREPARADO PARA CREAR TU CUENTA?</span>
                                                        </div>
                                                        <div className="footer-banner-button">
                                                            <div>
                                                                <div className="cta-item">
                                                                    <div className="cta-template cta-secondary ">
                                                                        <a href="javascript:void(0)"><span className="label ">Jugar</span></a></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="section section-top">
                        <div className="footer-top">
                            <div className="footer-top-component">
                                <div className="section section-link">
                                    <div className="footer-top-links">
                                        <div className="footer-top-links-component default">
                                            <div className="accordion-heading">
                                                <span className="toggle-icon">
                                                    <a><span>Juegos de casino</span></a>
                                                </span>
                                            </div>
                                            <div className="accordion-content">
                                                {
                                                    isSlotsOnly === "false" ? 
                                                    <ul className="link-list">
                                                        <li className="link-item" onClick={() => navigate("/home")}>
                                                            <a>
                                                                <span>Inicio</span>
                                                            </a>
                                                        </li>
                                                        <li className="link-item" onClick={() => navigate("/casino")}>
                                                            <a>
                                                                <span>Casino</span>
                                                            </a>
                                                        </li>
                                                        <li className="link-item" onClick={() => navigate("/live-casino")}>
                                                            <a>
                                                                <span>Casino en vivo</span>
                                                            </a>
                                                        </li>
                                                        <li className="link-item" onClick={() => navigate("/sports")}>
                                                            <a>
                                                                <span>Deportes</span>
                                                            </a>
                                                        </li>
                                                        <li className="link-item" onClick={() => navigate("/live-sports")}>
                                                            <a>
                                                                <span>Deportes en vivo</span>
                                                            </a>
                                                        </li>
                                                    </ul> : 
                                                    <ul className="link-list">
                                                        <li className="link-item" onClick={() => navigate("/casino")}>
                                                            <a>
                                                                <span>Casino</span>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="footer-top-links">
                                        <div className="footer-top-links-component icons">
                                            <div className="accordion-heading">
                                                <span className="toggle-icon">
                                                    <a><span>2 productos, 1 cuenta</span></a>
                                                </span>
                                            </div>
                                            <div className="accordion-content">
                                                <ul className="link-list">
                                                    <li className="link-item" onClick={() => navigate("/casino")}>
                                                        <a>
                                                            <img src={ImgCasino} />
                                                        </a>
                                                    </li>
                                                    {
                                                        isSlotsOnly === "false" && 
                                                        <li className="link-item" onClick={() => navigate("/sports")}>
                                                            <a>
                                                                <img src={ImgSports} />
                                                            </a>
                                                        </li>
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="section section-disclaimer">
                        <div id="footerLicense">
                            <p><span class="font-size-16">PREVENCIÓN ADICCIÓN AL JUEGO, LLAMA: 900 533 788</span></p>
                            <p>Copyright © 2026. 888 Online Games España S.A., Licencias nº 138-11/GA/A75057273/SGR, 68-11/GO/N0440805J/SGR, 76-11/ADC/N0440805J/SGR, 70-11/BNG/N0440805J/SGR, 73-11/BLJ/N0440805J/SGR, 71-11/POQ/N0440805J7SGR, MAZ/2014/008, una filial de Evoke Holding Plc.</p>
                            <p>888 Online Games España S.A. es una sociedad inscrita en Ceuta; Domicilio social: Calle Millán Astray nº1, 51001, Ceuta, España.</p>
                            <p>El representante en España de 888 es Cuatrecasas con domicilio social en Calle Almagro 9, 28010 – Madrid</p>
                            <p>La prestación y operación de servicios de juego remoto en España por parte de 888 Online Games España S.A. ha sido autorizada por la Dirección General de Ordenación del Juego.</p>
                            Para más información, por favor lea nuestros 
                            <a title="Términos y Condiciones" rel="noopener" referrerpolicy="no-referrer" class="addsCut">Términos y Condiciones</a>
                            <a title="Política de Privacidad." rel="noopener" referrerpolicy="no-referrer" class="addsCut">Política de Privacidad.</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;