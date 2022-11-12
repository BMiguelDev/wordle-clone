import React, { useEffect, useRef, useState } from "react";

import { playerStatisticsType } from "../../models/model";
import styles from "./StatsPopUp.module.scss";

interface PropTypes {
    isStatsPopUpOpen: boolean;
    toggleIsPopUpOpen: (event: React.MouseEvent, popUpName: string) => void;
    playerStatistics: playerStatisticsType;
}

export default function StatsPopUp({ isStatsPopUpOpen, toggleIsPopUpOpen, playerStatistics }: PropTypes) {
    const [isRender, setIsRender] = useState<boolean>(isStatsPopUpOpen);

    useEffect(() => {
        if (isStatsPopUpOpen) setIsRender(true);
    }, [isStatsPopUpOpen]);

    const statsPopupContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkClickToExitStats = (event: any) => {
            if (isStatsPopUpOpen) {
                if (statsPopupContainerRef.current && !statsPopupContainerRef.current?.contains(event.target)) {
                    toggleIsPopUpOpen(event, "stats");
                }
            }
        };

        window.addEventListener("click", checkClickToExitStats);

        return () => {
            window.removeEventListener("click", checkClickToExitStats);
        };
    }, [isStatsPopUpOpen, toggleIsPopUpOpen]);

    function handleAnimationEnd() {
        if (!isStatsPopUpOpen) setIsRender(false);
    }

    return isRender ? (
        <div className={styles.stats_pop_up_wrapper}>
            <div
                ref={statsPopupContainerRef}
                className={`${styles.stats_popup_container} ${
                    isStatsPopUpOpen ? "" : styles.stats_popup_container_hide
                }`}
                onAnimationEnd={handleAnimationEnd}
            >
                <div className={styles.stats_popup_stats_numbers}>
                    <div className={styles.stats_popup_stats_numbers_title}>Statistics</div>
                    <div className={styles.stats_numbers_row_container}>
                        <div className={styles.singular_stat_container}>
                            <h4 className={styles.singular_stat_number}>{playerStatistics.gamesFinished}</h4>
                            <p className={styles.singular_stat_text}>Played</p>
                        </div>
                        <div className={styles.singular_stat_container}>
                            <h4 className={styles.singular_stat_number}>
                                {Math.round((playerStatistics.gamesWon / playerStatistics.gamesFinished)*100)}
                            </h4>
                            <div className={styles.singular_stat_text}>% Win</div>
                        </div>
                        <div className={styles.singular_stat_container}>
                            <h4 className={styles.singular_stat_number}>{playerStatistics.currentStreak}</h4>
                            <p className={styles.singular_stat_text}>Current Steak</p>
                        </div>
                        <div className={styles.singular_stat_container}>
                            <h4 className={styles.singular_stat_number}>{playerStatistics.maxStreak}</h4>
                            <p className={styles.singular_stat_text}>Max Streak</p>
                        </div>
                    </div>
                </div>

                <div className={styles.stats_popup_stats_graph}>
                    <div className={styles.stats_popup_stats_graph_title}>Guess Distribution</div>
                    <div className={styles.stats_graph_column_container}>
                        <div className={styles.singular_graph_line_container}>
                            <p className={styles.singular_graph_number}>
                                0
                            </p>
                            <div className={styles.singular_graph_bar}>
                                <p>Hey</p>
                            </div>
                        </div>
                        <div className={styles.singular_graph_line_container}>
                            <p className={styles.singular_graph_number}>
                                1
                            </p>
                            <div className={styles.singular_graph_bar}>
                                <p>Hey</p>
                            </div>
                        </div>
                    </div>
                </div>

                <button className={styles.stats_popup_exit_button} onClick={(e) => toggleIsPopUpOpen(e, "stats")}>
                    <i className="fa-solid fa-xmark"></i>
                </button>

                {/* TODO: Maybe add an area of notification to the right of the restart button when a gameSetting is different from the currentGameSetting (being used in the current game).
            This notification area should say "Restart game to apply New Settings" */}
            </div>
        </div>
    ) : (
        <div className={styles.stats_pop_up_hidden} />
    );
}