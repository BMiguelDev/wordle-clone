import React from "react";

import styles from "./SettingsPopUp.module.scss";
import { gameSettingsType, isApiAvailableType } from "../../models/model";

import Footer from "../Footer/Footer";

interface PropTypes {
    isSettingsPopUpOpen: boolean;
    toogleIsSettingsPopUpOpen: () => void;
    handleChangeGameSettings: (gameSetting: string, option: string) => void;
    gameSettings: gameSettingsType;
    isApiAvailable: isApiAvailableType;
    isDarkMode: boolean;
    handleChangeDarkMode: () => void;
    resetButtonRef: React.RefObject<HTMLButtonElement>;
    resetGame: () => void;
}

export default function SettingsPopUp({
    isSettingsPopUpOpen,
    toogleIsSettingsPopUpOpen,
    handleChangeGameSettings,
    gameSettings,
    isApiAvailable,
    isDarkMode,
    handleChangeDarkMode,
    resetButtonRef,
    resetGame
}: PropTypes) {
    return (
        <div
            className={`${styles.settings_popup_container} ${
                isSettingsPopUpOpen ? "" : styles.settings_popup_container_hide
            }`}
        >
            <div className={styles.settings_popup_title}>Settings</div>
            <div className={styles.settings_popup_settings}>
                <div className={styles.singular_setting_container}>
                    <div className={styles.singular_setting_text}>
                        <h4>Word Length</h4>
                        <p>Explanation of word Length (if necessary)</p>
                    </div>
                    <div
                        className={`${styles.singular_setting_toggler} ${
                            isApiAvailable.isWordApiAvailable ? "" : styles.singular_setting_toggler_disabled
                        }`}
                    >
                        {/* Toggler */}
                        <button onClick={() => handleChangeGameSettings("word-length", "increment")}>+</button>
                        {gameSettings.wordLength}
                        <button onClick={() => handleChangeGameSettings("word-length", "decrement")}>-</button>
                    </div>
                </div>
                <div className={styles.singular_setting_container}>
                    <div className={styles.singular_setting_text}>
                        <h4>Stage Number</h4>
                        <p>Explanation of Stage Number (if necessary)</p>
                    </div>
                    <div className={styles.singular_setting_toggler}>
                        {/* Toggler */}
                        <button onClick={() => handleChangeGameSettings("stage-number", "increment")}>+</button>
                        {gameSettings.numberStages}
                        <button onClick={() => handleChangeGameSettings("stage-number", "decrement")}>-</button>
                    </div>
                </div>
                <div className={styles.singular_setting_container}>
                    <div className={styles.singular_setting_text}>
                        <h4>Hard Mode</h4>
                        <p>Any revealed hint letters must be used in subsequent guesses</p>
                    </div>
                    <div className={styles.singular_setting_toggler}>
                        {/* Toggler */}
                        <button onClick={() => handleChangeGameSettings("hard-mode", "")}>Toggle</button>
                    </div>
                </div>
                <div className={styles.singular_setting_container}>
                    <div className={styles.singular_setting_text}>
                        <h4>Dark Mode</h4>
                    </div>
                    <div className={styles.singular_setting_toggler}>
                        {/* Toggler */}
                        <button onClick={handleChangeDarkMode}>Toggle</button>
                    </div>
                </div>
            </div>
            <div className={styles.settings_popup_reset_button_container}>
                <button ref={resetButtonRef} onClick={resetGame}>
                    Restart Game
                </button>
            </div>

            {/* <div className={styles.settings_popup_footer}>
                <Footer />
            </div> */}

            <button className={styles.settings_popup_exit_button} onClick={toogleIsSettingsPopUpOpen}>
                <i className="fa-solid fa-xmark"></i>
            </button>
        </div>
    );
}
