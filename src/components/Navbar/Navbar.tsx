import React from "react";
import styles from "./Navbar.module.scss";


interface PropTypes {
    toggleIsPopUpOpen: (event: React.MouseEvent, popUpName: string) => void;
}

function Navbar({ toggleIsPopUpOpen }: PropTypes) {
    return (
        <header className={styles.navbar_container}>
            <div className={styles.navbar_menu_container} onClick={(e) => toggleIsPopUpOpen(e, "extramenu")}>
                <i className="fa-solid fa-bars"></i>
            </div>
            <h2 className={styles.navbar_title}>Wordle</h2>
            <div className={styles.navbar_icons_container}>
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
