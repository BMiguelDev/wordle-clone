import React from "react";
import styles from "./Navbar.module.scss";

function Navbar() {
    return (
        <header className={styles.navbar_container}>
            <div className={styles.navbar_menu_container}>
                <i className="fa-solid fa-bars"></i>
            </div>
            <h2 className={styles.navbar_title}>Wordle</h2>
            <div className={styles.navbar_icons_container}>
                <div className={styles.navbar_icon_container}>
                    <i className="fa-solid fa-question"></i>
                </div>
                <div className={styles.navbar_icon_container}>
                    <i className="fa-sharp fa-solid fa-chart-simple"></i>
                </div>
                <div className={styles.navbar_icon_container}>
                    <i className="fa-solid fa-gear"></i>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
