import React from "react";
import Gallery from "../components/Gallery";
import paintingsData from "../data/paintingsData";
import './Year.scss';


const Year2019 = () => {
    return(
        <div className="year-container">
            <div>
            <Gallery year="2019" paintingsData={paintingsData["2019"]} />
            </div>
        </div>
    );
};

export default Year2019;