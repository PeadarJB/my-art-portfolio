import React from "react";
import Gallery from "../components/Gallery";
import paintingsData from "../data/paintingsData";
import './Year.scss';


const Year2020 = () => {
    return(
        <div className="year-container">
            <div>
            <Gallery year="2020" paintingsData={paintingsData["2020"]} />
            </div>
        </div>
    );
};

export default Year2020;