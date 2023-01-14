import React, { useEffect, useRef } from "react";
import styles from "./Navbar.module.scss";

interface PropTypes {
    isDeviceSmartphoneLandscape: boolean;
    toggleIsPopUpOpen: (event: React.MouseEvent, popUpName: string) => void;
    toggleFullScreen: () => void;
}

function Navbar({ isDeviceSmartphoneLandscape, toggleIsPopUpOpen, toggleFullScreen }: PropTypes) {
    const fullscreenButtonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        const setCookie = (cookieName: string, value: string, exdays: number) => {
            var expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + exdays);
            var cookieValue = encodeURIComponent(value) + (exdays == null ? "" : "; expires=" + expirationDate.toUTCString());
            document.cookie = cookieName + "=" + cookieValue;
        }
    
        const getCookie = (cookieName: string) => {
            var c_value = document.cookie;
            var c_start = c_value.indexOf(" " + cookieName + "=");
            if (c_start === -1) {
                c_start = c_value.indexOf(cookieName + "=");
            }
            if (c_start === -1) {
                c_value = "";
            } else {
                c_start = c_value.indexOf("=", c_start) + 1;
                var c_end = c_value.indexOf(";", c_start);
                if (c_end === -1) {
                    c_end = c_value.length;
                }
                c_value = decodeURIComponent(c_value.substring(c_start, c_end));
            }
            return c_value;
        }

        // If device screen is mobile landscape and first visiting web app, trigger popup to suggest toggling full screen
        var cookieValue = getCookie("visited");
        if (isDeviceSmartphoneLandscape && cookieValue !== "yes") {
            setTimeout(() => {
                if (!document.fullscreenElement)
                    fullscreenButtonRef.current?.classList.add(styles.fullscreen_suggestion);
            }, 2000);

            // Add first visit cookie only if device screen is a mobile landscape device
            setCookie("visited", "yes", 365);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <header className={styles.navbar_container}>
            <div className={styles.navbar_menu_container} onClick={(e) => toggleIsPopUpOpen(e, "extramenu")}>
                <i className="fa-solid fa-bars"></i>
            </div>
            <h2 className={styles.navbar_title}>Wordle</h2>
            <div className={styles.navbar_icons_container}>
                {isDeviceSmartphoneLandscape && (
                    <div
                        ref={fullscreenButtonRef}
                        className={styles.navbar_icon_container}
                        onClick={toggleFullScreen}
                        onAnimationEnd={() =>
                            fullscreenButtonRef.current?.classList.remove(styles.fullscreen_suggestion)
                        }
                    >
                        <i className="fa-solid fa-expand"></i>
                    </div>
                )}

                <div className={styles.navbar_icon_container} onClick={(e) => toggleIsPopUpOpen(e, "help")}>
                    <i className="fa-solid fa-question"></i>
                </div>
                <div className={styles.navbar_icon_container} onClick={(e) => toggleIsPopUpOpen(e, "stats")}>
                    <i className="fa-sharp fa-solid fa-chart-simple"></i>
                </div>
                <div className={styles.navbar_icon_container} onClick={(e) => toggleIsPopUpOpen(e, "settings")}>
                    <i className="fa-solid fa-gear"></i>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
