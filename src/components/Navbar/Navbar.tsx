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
        // If device screen is mobile landscape, trigger popup to suggest toggling full screen
        if (isDeviceSmartphoneLandscape)
            setTimeout(() => {
                if (!document.fullscreenElement)
                    fullscreenButtonRef.current?.classList.add(styles.fullscreen_suggestion);
            }, 2000);
            
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
