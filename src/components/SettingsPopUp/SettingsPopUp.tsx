import React, { useEffect, useRef, useState } from "react";

import styles from "./SettingsPopUp.module.scss";
import { gameSettingsType, isApiAvailableType } from "../../models/model";

interface PropTypes {
    isSettingsPopUpOpen: boolean;
    toggleIsPopUpOpen: (event: React.MouseEvent, popUpName: string) => void;
    handleChangeGameSettings: (gameSetting: string, option: string) => void;
    gameSettings: gameSettingsType;
    isApiAvailable: isApiAvailableType;
    isDarkMode: boolean;
    isHighContrastMode: boolean;
    handleChangeDarkMode: () => void;
    handleChangeHighContrastMode: () => void;
    resetButtonRef: React.RefObject<HTMLButtonElement>;
    resetGame: () => void;
}

export default function SettingsPopUp({
    isSettingsPopUpOpen,
    toggleIsPopUpOpen,
    handleChangeGameSettings,
    gameSettings,
    isApiAvailable,
    isDarkMode,
    isHighContrastMode,
    handleChangeDarkMode,
    handleChangeHighContrastMode,
    resetButtonRef,
    resetGame,
}: PropTypes) {
    const [isRender, setIsRender] = useState<boolean>(isSettingsPopUpOpen);

    useEffect(() => {
        if (isSettingsPopUpOpen) setIsRender(true);
    }, [isSettingsPopUpOpen]);

    const settingsPopupContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkClickToExitSettings = (event: any) => {
            if (isSettingsPopUpOpen) {
                if (settingsPopupContainerRef.current && !settingsPopupContainerRef.current?.contains(event.target)) {
                    toggleIsPopUpOpen(event, "settings");
                }
            }
        };

        window.addEventListener("click", checkClickToExitSettings);

        return () => {
            window.removeEventListener("click", checkClickToExitSettings);
        };
    }, [isSettingsPopUpOpen, toggleIsPopUpOpen]);

    function handleAnimationEnd() {
        if (!isSettingsPopUpOpen) setIsRender(false);
    }

    return isRender ? (
        <div className={styles.settings_pop_up_wrapper}>
            <div
                ref={settingsPopupContainerRef}
                className={`${styles.settings_popup_container} ${
                    isSettingsPopUpOpen ? "" : styles.settings_popup_container_hide
                }`}
                onAnimationEnd={handleAnimationEnd}
            >
                <div className={styles.settings_popup_title}>Settings</div>
                <div className={styles.settings_popup_settings}>
                    <div className={styles.singular_setting_container}>
                        <div className={styles.singular_setting_text}>
                            <h4>Word Length</h4>
                        </div>
                        <div
                            className={`${styles.singular_setting_toggler} ${
                                isApiAvailable.isWordApiAvailable ? "" : styles.singular_setting_toggler_disabled
                            }`}
                        >
                            <button className={styles.singular_setting_toggler_decrement} onClick={() => handleChangeGameSettings("word-length", "decrement")}>
                                <i className="fa-solid fa-angle-down"></i>
                            </button>
                            {gameSettings.futureGameSettings.wordLength}
                            <button className={styles.singular_setting_toggler_increment} onClick={() => handleChangeGameSettings("word-length", "increment")}>
                                <i className="fa-solid fa-angle-up"></i>
                            </button>
                            
                        </div>
                    </div>
                    <div className={styles.singular_setting_container}>
                        <div className={styles.singular_setting_text}>
                            <h4>Number of Stages</h4>
                        </div>
                        <div className={styles.singular_setting_toggler}>
                            <button className={styles.singular_setting_toggler_decrement} onClick={() => handleChangeGameSettings("stage-number", "decrement")}>
                                <i className="fa-solid fa-angle-down"></i>
                            </button>
                            {gameSettings.futureGameSettings.numberStages}
                            <button className={styles.singular_setting_toggler_increment} onClick={() => handleChangeGameSettings("stage-number", "increment")}>
                                <i className="fa-solid fa-angle-up"></i>
                            </button>

                        </div>
                    </div>
                    <div className={styles.singular_setting_container}>
                        <div className={styles.singular_setting_text}>
                            <h4>Hard Mode</h4>
                            <p>Any revealed hint letters must be used in subsequent guesses</p>
                        </div>
                        <div className={styles.singular_setting_toggler}>
                            <div
                                className={`${styles.singular_setting_toggler_area} ${
                                    gameSettings.currentGameSettings.hardMode
                                        ? styles.toggler_area_on
                                        : styles.toggler_area_off
                                }`}
                                onClick={() => handleChangeGameSettings("hard-mode", "")}
                            />
                        </div>
                    </div>
                    <div className={styles.singular_setting_container}>
                        <div className={styles.singular_setting_text}>
                            <h4>Lazy Mode</h4>
                            <p>Guessed words don't need to be in dictionary</p>
                        </div>
                        <div className={styles.singular_setting_toggler}>
                            <div
                                className={`${styles.singular_setting_toggler_area} ${
                                    gameSettings.currentGameSettings.lazyMode
                                        ? styles.toggler_area_on
                                        : styles.toggler_area_off
                                }`}
                                onClick={() => handleChangeGameSettings("lazy-mode", "")}
                            />
                        </div>
                    </div>
                    <div className={styles.singular_setting_container}>
                        <div className={styles.singular_setting_text}>
                            <h4>High Contrast Mode</h4>
                            <p>For improved color vision</p>
                        </div>
                        <div className={styles.singular_setting_toggler}>
                            <div
                                className={`${styles.singular_setting_toggler_area} ${
                                    isHighContrastMode ? styles.toggler_area_on : styles.toggler_area_off
                                }`}
                                onClick={handleChangeHighContrastMode}
                            />
                        </div>
                    </div>

                    <div className={styles.singular_setting_container}>
                        <div className={styles.singular_setting_text}>
                            <h4>Dark Mode</h4>
                        </div>
                        <div className={styles.singular_setting_toggler}>
                            <div
                                className={`${styles.singular_setting_toggler_area} ${
                                    isDarkMode ? styles.toggler_area_on : styles.toggler_area_off
                                }`}
                                onClick={handleChangeDarkMode}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.settings_popup_reset_button_container}>
                    <button ref={resetButtonRef} onClick={resetGame}>
                        Restart Game
                    </button>
                </div>

                <button className={styles.settings_popup_exit_button} onClick={(e) => toggleIsPopUpOpen(e, "settings")}>
                    <i className="fa-solid fa-xmark"></i>
                </button>

                {/* TODO: Maybe add an area of notification to the right of the restart button when a gameSetting is different from the currentGameSetting (being used in the current game).
            This notification area should say "Restart game to apply New Settings" */}
            </div>
        </div>
    ) : (
        <div className={styles.settings_pop_up_hidden} />
    );
}
