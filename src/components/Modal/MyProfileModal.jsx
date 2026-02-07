import { useContext } from "react";
import { AppContext } from "../../AppContext";

const MyProfileModal = ({ isOpen, onClose }) => {
    const { contextData } = useContext(AppContext);

    if (!isOpen) return null;

    return (
        <div className="sc-jENOtw epoRvC cy-modal-dialog cy-modal modal-dialog force-fullscreen-tablet">
            <div className="sc-cnolJO sc-fdTzJR dYBkcR gKGsEC cy-modal-dialog-content apply-borders force-fullscreen-tablet">
                <div className="sc-gfrUAT jaZtiX cy-modal-dialog-consumer-content cy-modal-content">
                    <div className="sc-fCtvmz fGoDUz">
                        <div className="sc-niYhe jBckan cy-modal-dialog-x-close-button">
                            <svg width="1.6rem" height="1.6rem" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" className="sc-bqOBqt PBviZ" fill="unset"><g><path fill="currentColor" d="M19.92,17l-5.09-5.1,4.8-4.8A2,2,0,1,0,16.8,4.22L12,9,7.2,4.22A2,2,0,0,0,4.37,7.05l4.8,4.8L4.08,17A2,2,0,1,0,6.9,19.78l5.1-5.1,5.1,5.1A2,2,0,1,0,19.92,17Z"></path></g></svg>
                        </div>
                        <div className="sc-jaXUkq fnRmpA cy-cashier-external-link-container cy-external-link-container">
                            <div className="cashier-app" ng-include="" src="'app/index.html'">
                                <section className="layout-wrapper" ng-controller="MainPageController as vm" ng-class="{'message-banner-visible': vm.isMessageBannerDisplayed &amp;&amp; vm.showPlse() === false}" ng-show="vm.showAllPage">

                                    <header ng-if="vm.showHeader">
                                        <div className="brand-logo">
                                            <div className="brand-logo-inner-container"></div>
                                        </div>
                                        <div className="user-details clearfix">
                                            <div className="clearfix">
                                                <div className="header-user-settings bi-app-float-right" ng-show="vm.showUserSettings()" show-set-personal-limits="true">
                                                    <span className="icon-wrapper icons-icon_user" ng-click="vm.userSettingsPopupToggle.show = !vm.userSettingsPopupToggle.show">    <i className="fa icons-icon_fa-chevron-down_12_12_9c9c9c" ng-class="{'icons-icon_fa-chevron-down_12_12_9c9c9c': !vm.userSettingsPopupToggle.show, 'icons-icon_fa-chevron-up_12_12_9c9c9c': vm.userSettingsPopupToggle.show}"></i>  </span>
                                                </div>
                                                <div className="header-language-selector bi-app-float-right">
                                                    <c2-language-selector ng-show="vm.showLanguageSelector">
                                                        <c2-dropdown title="Select Language" display-name="cultureDisplayName" items="vm.languages" selected="vm.selectedLanguage">
                                                            <div className="dropdown-wrapper">
                                                                <i className="dropdown-button fa icons-icon_fa-chevron-down_12_12_9c9c9c"></i>
                                                                <div className="dropdown-input">        English    </div>
                                                                <div className="dropdown-menuList">
                                                                    <div className="dropdown-pointer"></div>
                                                                    <div className="dropdown-menu-info">            <span>                Select Language            </span>        </div>
                                                                    <ul>

                                                                        <li className="dropdown" ng-repeat="item in dropdownVm.items" ng-click="dropdownVm.select(item)">                <span className="dropdown">                    Arabic / العربية                </span>            </li>

                                                                        <li className="dropdown" ng-repeat="item in dropdownVm.items" ng-click="dropdownVm.select(item)">                <span className="dropdown">                    Bulgarian / български                </span>            </li>

                                                                        <li className="dropdown" ng-repeat="item in dropdownVm.items" ng-click="dropdownVm.select(item)">                <span className="dropdown">                    Chinese (Simplified) / 中文(简体)                </span>            </li>

                                                                        <li className="dropdown" ng-repeat="item in dropdownVm.items" ng-click="dropdownVm.select(item)">                <span className="dropdown">                    Danish / dansk                </span>            </li>

                                                                        <li className="dropdown" ng-repeat="item in dropdownVm.items" ng-click="dropdownVm.select(item)">                <span className="dropdown">                    Dutch / Nederlands                </span>            </li>

                                                                        <li className="dropdown" ng-repeat="item in dropdownVm.items" ng-click="dropdownVm.select(item)">                <span className="dropdown">                    English                </span>            </li>

                                                                        <li className="dropdown" ng-repeat="item in dropdownVm.items" ng-click="dropdownVm.select(item)">                <span className="dropdown">                    Finnish / suomi                </span>            </li>

                                                                        <li className="dropdown" ng-repeat="item in dropdownVm.items" ng-click="dropdownVm.select(item)">                <span className="dropdown">                    French / français                </span>            </li>

                                                                        <li className="dropdown" ng-repeat="item in dropdownVm.items" ng-click="dropdownVm.select(item)">                <span className="dropdown">                    German / Deutsch                </span>            </li>

                                                                        <li className="dropdown" ng-repeat="item in dropdownVm.items" ng-click="dropdownVm.select(item)">                <span className="dropdown">                    Greek / Ελληνικά                </span>            </li>

                                                                        <li className="dropdown" ng-repeat="item in dropdownVm.items" ng-click="dropdownVm.select(item)">                <span className="dropdown">                    Hungarian / magyar                </span>            </li>

                                                                        <li className="dropdown" ng-repeat="item in dropdownVm.items" ng-click="dropdownVm.select(item)">                <span className="dropdown">                    Italian / italiano                </span>            </li>

                                                                        <li className="dropdown" ng-repeat="item in dropdownVm.items" ng-click="dropdownVm.select(item)">                <span className="dropdown">                    Japanese / 日本語                </span>            </li>

                                                                        <li className="dropdown" ng-repeat="item in dropdownVm.items" ng-click="dropdownVm.select(item)">                <span className="dropdown">                    Polish / polski                </span>            </li>

                                                                        <li className="dropdown" ng-repeat="item in dropdownVm.items" ng-click="dropdownVm.select(item)">                <span className="dropdown">                    Portuguese / português (Portugal)                </span>            </li>

                                                                        <li className="dropdown" ng-repeat="item in dropdownVm.items" ng-click="dropdownVm.select(item)">                <span className="dropdown">                    Romanian / română                </span>            </li>

                                                                        <li className="dropdown" ng-repeat="item in dropdownVm.items" ng-click="dropdownVm.select(item)">                <span className="dropdown">                    Russian / русский                </span>            </li>

                                                                        <li className="dropdown" ng-repeat="item in dropdownVm.items" ng-click="dropdownVm.select(item)">                <span className="dropdown">                    Spanish / español                </span>            </li>

                                                                        <li className="dropdown" ng-repeat="item in dropdownVm.items" ng-click="dropdownVm.select(item)">                <span className="dropdown">                    Swedish / svenska                </span>            </li>

                                                                        <li className="dropdown" ng-repeat="item in dropdownVm.items" ng-click="dropdownVm.select(item)">                <span className="dropdown">                    Thai / ไทย                </span>            </li>

                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </c2-dropdown>
                                                    </c2-language-selector>
                                                </div>
                                                <div className="bi-app-float-right login-security-logo-image icons-icon-security-lock"></div>

                                            </div>
                                            <div className="bi-app-float-left">
                                                <h1>          <span>Hi Juan Ramon,</span>        </h1>
                                            </div>
                                            <div className="vip-indication">

                                            </div>
                                            <div className="balance bi-app-float-right" id="breakdownBalance">
                                                <h1 id="automationBankroll">    US$0.00  </h1>

                                                <div ng-if="vm.showBalanceBreakdown" id="balanceBreakdown">
                                                    <div className="title" id="balanceBreakdownRealMoneyTitle">      Cash Balance: <span className="amount" id="balanceBreakdownRealMoney">US$0.00</span>    </div>
                                                    <div className="title" id="balanceBreakdownBonusMoneyTitle">      Bonus Balance: <span className="amount" id="balanceBreakdownBonusMoney">US$0.00 </span>    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </header>

                                    <div className="cashier-content-container" ng-show="vm.showMainView">
                                        <aside available-actions="vm.availableActions">
                                            <div>
                                                <ul className="main-menu-primary">

                                                    <li className="menu-item" ng-if="vm.getAvailableAction('Deposit')" ng-class="{'active': vm.isActive('Deposit')}">        <span title="DEPOSIT" ng-click="vm.setRoute('Deposit')">          DEPOSIT        </span>      </li>

                                                    <li className="menu-item" ng-if="vm.getAvailableAction('Cashout')" ng-class="{'active': vm.isActive('Withdraw')}">        <span title="WITHDRAWAL" ng-click="vm.setRoute('Withdraw')">          WITHDRAWAL        </span>      </li>

                                                </ul>
                                                <ul className="main-menu-secondary">

                                                    <li className="menu-item verify-id" ng-if="vm.getAvailableAction('VerifyId')" ng-class="{'active': vm.isActive('VerifyId')}">
                                                        <span title="VERIFY ID" ng-click="vm.setRoute('VerifyId')">          VERIFY ID        </span>
                                                        <i className="icons-icon_in_process verify-id-icon icon-tooltip ng-hide" hotspot-class="hotspot" content-class="input-tooltip-help above-input" ng-show="vm.hasPendingDocument">
                                                            <span className="hotspot" data-tooltip-trigger="">

                                                            </span>
                                                            <span className="input-tooltip-help above-input ng-hide" ng-style="contentStyle" ng-show="vmTimerTooltip.isTooltipContentDisplayed" ng-transclude="" data-tooltip-target="">          Your documents are awaiting verification.<br />We will email you upon completion of this process.        </span>
                                                        </i>
                                                        <i className="icons-icon_attention_big icon-tooltip ng-hide verify-id-icon" ng-class="vm.hasPendingDocument ? 'verify-id-double-icons': 'verify-id-icon'" hotspot-class="hotspot" content-class="input-tooltip-help above-input" ng-show="vm.showAgeVerificationRequired">
                                                            <span className="hotspot" data-tooltip-trigger="">

                                                            </span>
                                                            <span className="input-tooltip-help above-input ng-hide" ng-style="contentStyle" ng-show="vmTimerTooltip.isTooltipContentDisplayed" ng-transclude="" data-tooltip-target="">          Please verify your age        </span>
                                                        </i>
                                                    </li>

                                                    <li className="menu-item active" ng-if="vm.getAvailableAction('TransactionsHistory') &amp;&amp; vm.showMenuItemTransactionsHistory" ng-class="{'active': vm.isActive('TransactionsHistory')}">        <span title="HISTORY" ng-click="vm.setRoute('TransactionsHistory')">          HISTORY        </span>      </li>

                                                    <li className="menu-item" ng-if="vm.showMenuSetLimits">        <span title="SET LIMITS" ng-click="vm.externalLinkClick(vm.externalLinkNames.setLimits)">          SET LIMITS        </span>      </li>

                                                    <li className="menu-item" ng-if="vm.showMenuResponsibleGaming">        <span title="RESPONSIBLE GAMING" ng-click="vm.externalLinkClick(vm.externalLinkNames.responsibleGaming)">          RESPONSIBLE GAMING        </span>      </li>
                                                </ul>
                                            </div>
                                        </aside>
                                        <div className="mainContainer">

                                            <div ui-view="main" className="mainViewContainer">
                                                <section className="historyPage" ng-controller="HistoryMainController as historyCtrlVm">
                                                    <div className="historyPageHeader">
                                                        <form className="clearfix ng-pristine ng-valid">
                                                            <div className="historyTitle bi-app-float-left">                History            </div>
                                                            <div className="historyDatesDropdown bi-app-float-right custom-select-wrapper ng-not-empty ng-valid" ng-class="{'credit-card-select-wrapper': dd.ddType == 'creditCards', 'mft-select-wrapper': dd.ddType == 'mfts', 'phone-code-select-wrapper': dd.ddType == 'phoneCode','focused': dd.showDropDown}" ng-blur="dd.showDropDown = false" ng-keydown="dd.keypress(dd.uiItems, $event)" tabindex="0" ng-model="historyCtrlVm.dropdownValue" ng-change="historyCtrlVm.handleTimeIntervalChange(item)" items="historyCtrlVm.getTimeIntervals()" display-property="label" value-property="value" dd-type="generic">
                                                                <div className="custom-select-box" ng-click="dd.toggleDropDown($event)">
                                                                    <div ng-class="{'custom-select-text': true, 'date-select': true}" ng-if="dd.ddType == 'generic'" className="custom-select-text date-select">
                                                                        <span ng-bind="dd.selectedItem.text" ng-if="dd.selectedItem.text" title="Last week">Last week</span>
                                                                    </div>
                                                                    <div ng-class="{'custom-select-arrow': true}" className="custom-select-arrow">      <i className="fa icons-icon_fa_caret_down_8_8_636363"></i>    </div>
                                                                </div>
                                                                <ul ng-if="dd.ddType == 'generic'" className="dropdown-values-list date-select ng-hide" ng-show="dd.showDropDown">

                                                                    <li ng-repeat="item in dd.uiItems" data-ng-class="{'itemFocused': dd.index == $index}" ng-mousedown="dd.setSelectedItem(item)">      <span className="dd-content" ng-bind="item.text">Last hour</span>    </li>

                                                                    <li ng-repeat="item in dd.uiItems" data-ng-class="{'itemFocused': dd.index == $index}" ng-mousedown="dd.setSelectedItem(item)">      <span className="dd-content" ng-bind="item.text">Last day</span>    </li>

                                                                    <li ng-repeat="item in dd.uiItems" data-ng-class="{'itemFocused': dd.index == $index}" ng-mousedown="dd.setSelectedItem(item)">      <span className="dd-content" ng-bind="item.text">Last week</span>    </li>

                                                                    <li ng-repeat="item in dd.uiItems" data-ng-class="{'itemFocused': dd.index == $index}" ng-mousedown="dd.setSelectedItem(item)">      <span className="dd-content" ng-bind="item.text">Last month</span>    </li>

                                                                    <li ng-repeat="item in dd.uiItems" data-ng-class="{'itemFocused': dd.index == $index}" ng-mousedown="dd.setSelectedItem(item)">      <span className="dd-content" ng-bind="item.text">Last 12 months</span>    </li>

                                                                </ul>
                                                            </div>
                                                        </form>
                                                    </div>
                                                    <div className="historyPageTables">
                                                        <div className="historyPageTabs">
                                                            <ul>
                                                                <li className="col-3" ng-if="historyCtrlVm.shouldIncludeTab(historyCtrlVm.subMenuTabsEnums.deposit)" ng-click="historyCtrlVm.setActiveTabIndex(historyCtrlVm.subMenuTabsEnums.deposit)" ng-class="{'selected': historyCtrlVm.getActiveTabIndex() == historyCtrlVm.subMenuTabsEnums.deposit}">
                                                                    <div className="selectedTab ng-hide" ng-show="historyCtrlVm.getActiveTabIndex() == historyCtrlVm.subMenuTabsEnums.deposit"></div>
                                                                    <span>                        Deposit                    </span>
                                                                </li>

                                                                <li className="col-3 selected" ng-if="historyCtrlVm.shouldIncludeTab(historyCtrlVm.subMenuTabsEnums.withdrawal)" ng-click="historyCtrlVm.setActiveTabIndex(historyCtrlVm.subMenuTabsEnums.withdrawal)" ng-class="{'selected': historyCtrlVm.getActiveTabIndex() == historyCtrlVm.subMenuTabsEnums.withdrawal}">
                                                                    <div className="selectedTab" ng-show="historyCtrlVm.getActiveTabIndex() == historyCtrlVm.subMenuTabsEnums.withdrawal"></div>
                                                                    <span>                        Withdrawal                    </span>
                                                                </li>

                                                            </ul>
                                                        </div>
                                                        <div className="historyPageTabsContentView">

                                                            <div ng-if="historyCtrlVm.shouldIncludeTab(historyCtrlVm.subMenuTabsEnums.withdrawal) &amp;&amp; historyCtrlVm.getActiveTabIndex() == historyCtrlVm.subMenuTabsEnums.withdrawal" ng-include="" src="'app/history/views/withdrawalsHistoryTab.html'">
                                                                <div className="historyTableWithdrawal" ng-controller="HistoryTabController as withdrawalTabVm" tab-name="cashout">
                                                                    <div className="historyTableInnerTitles ng-hide" ng-hide="withdrawalTabVm.getHistoryData().length == 0">
                                                                        <ul>
                                                                            <li className="rowNumber"></li>
                                                                            <li className="withdrawalDate">                <span>                    Date &amp; Time                </span>            </li>
                                                                            <li className="withdrawalStatus">                <span>                    Status                </span>            </li>
                                                                            <li className="withdrawalAmount">                <span>                    Amount                </span>            </li>
                                                                            <li className="withdrawalOpen"></li>
                                                                        </ul>
                                                                    </div>
                                                                    <div className="historyTableInnerContent ng-hide" ng-hide="withdrawalTabVm.getHistoryData().length == 0" load-on-scroll="" scroll-callback="withdrawalTabVm.onScrollReachedEnd()">

                                                                    </div>
                                                                    <div className="no-data-available show" ng-class="{'show': withdrawalTabVm.getHistoryData().length == 0 &amp;&amp; !withdrawalTabVm.isLoading}">        <span className="icon icons-icon_no_result"></span>        <span className="text">            No results were found        </span>    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </section>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="main-amanda-help-wrapper" ng-show="vm.showAmandaHelpImag" ng-click="vm.showAmandaHelp()">
                                        <div className="amanda-background amanda-help-icon"></div>
                                        <div className="amanda-help-text">Help?</div>
                                    </div>
                                    <div className="dialog-image-popup-wrapper" data-ng-class="{'open': vm.isPopupVisible, 'transition-end': vm.transitionEnd}">
                                        <div className="full-overlay" data-ng-class="{ 'visible': vm.isShaderVisible, 'fade': vm.isFadeVisible }"></div>
                                        <div className="outer-alignment">
                                            <div className="inner-alignment">
                                                <div className="aligned-content clearfix standard" data-ng-class="{'large': vm.isWide, 'standard': !vm.isWide}">

                                                    <div ui-view="imagespopup" className="popupContainer"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="dialog-popup-wrapper" data-ng-class="{'open': vm.isVisible, 'transition-end': vm.transitionEnd}">
                                        <div className="full-overlay" data-ng-class="{ 'visible': vm.isShaderVisible, 'fade': vm.isFadeVisible }"></div>
                                        <div className="outer-alignment">
                                            <div className="inner-alignment">
                                                <div className="aligned-content clearfix standard" data-ng-class="{'large': vm.isWide, 'standard': !vm.isWide}">
                                                    <div className="dialog-popup-amanda amanda-background" data-ng-class="{'open': vm.isAmandaVisible}" ng-style="{'transition-duration' : vm.transitionDuration, '-webkit-transition-duration': vm.transitionDuration, '-moz-transition-duration': vm.transitionDuration}"></div>
                                                    <div data-ng-class="{'dialog-popup-content-wrapper-common': true,'dialog-popup-content-wrapper-large': vm.isWide, 'dialog-popup-content-wrapper-standard': !vm.isWide, 'open': vm.isContentVisible}" ng-style="{'transition-duration': vm.transitionDuration, '-webkit-transition-duration': vm.transitionDuration, '-moz-transition-duration': vm.transitionDuration}" className="dialog-popup-content-wrapper-common dialog-popup-content-wrapper-standard">
                                                        <div className="dialog-popup-overflow">
                                                            <div className="dialog-popup-content">
                                                                <div className="dialog-popup-close-area-wrapper">                                <span className="icon-wrapper ng-hide" data-ng-show="vm.popupLayout.header.showClose" data-ng-click="vm.closeClicked();">                                    <i className="fa icons-icon_fa-times_15_15_636363"></i>                                </span>                            </div>
                                                                <div className="dialog-popup-inner-content-wrapper">
                                                                    <div className="dialog-popup-inner-content-details">
                                                                        <div className="dialog-popup-details-title">                                        <span className=" icons-icon_set_dialog_popup"></span>                                        <span className="dialog-popup-details-title-text">                                                                                    </span>                                    </div>

                                                                        <div ui-view="popup" className="popupContainer "></div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="side-bar" data-ng-class="{'active-animation': vm.showSideBar()}" show-declined-sidebar="vm.showDeclinedSidebar" show-amanda-help="vm.isShowAmandaHelp">
                                        <div className="side-bar-col-content">
                                            <div className="side-bar-close-icon-wrapper" data-ng-click="vm.closeSideBar()">            <i className="fa icons-icon_fa-times_15_15_636363"></i>        </div>
                                            <div>

                                                <div ui-view="sideBar" className="side-bar-container"></div>
                                            </div>
                                        </div>
                                        <div className="side-bar-col-background" data-ng-click="vm.closeSideBar()"></div>
                                    </div>
                                    <section className="deposit-redirectIframe-iframe-wrapper ng-hide" ng-show="vm.showRedirectIframeContainer" ng-class="{'visible': vm.moveUp}">
                                        <div className="deposit-redirectIframe-scroll-top-wrapper">
                                            <div className="deposit-redirectIframe-top-bar">
                                                <div className="deposit-redirectIframe-top-bar-image-wrap">
                                                    <div className="mft-tab-" ng-style="vm.logoManagerLogoStyle"></div>
                                                </div>
                                                <div className="deposit-redirectIframe-top-bar-login-wrap">        <span ng-bind-html="vm.titleText"></span>      </div>
                                                <div className="deposit-redirectIframe-top-bar-amount-wrap">        <span>                  </span>        <span>                  </span>      </div>
                                                <div className="deposit-redirectIframe-top-bar-edit-amount bi-app-text-bold">        <a ng-click="vm.cancelDeposit(vm.actions.edit)">                  </a>      </div>
                                                <div className="deposit-redirectIframe-top-bar-close-wrap bi-app-text-bold" ng-show="vm.showCancelDepositButton" ng-click="vm.cancelDeposit(vm.actions.close)">        x      </div>
                                            </div>
                                            <div className="deposit-redirectIframe-container">      <iframe ng-show="vm.showRedirectIframe" ng-src="" className="deposit-redirectIframe-iframe ng-hide"></iframe>    </div>
                                        </div>
                                    </section>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfileModal;