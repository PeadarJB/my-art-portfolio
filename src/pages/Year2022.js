import React, { useEffect, useRef } from "react";
import Gallery from "../components/Gallery";
import paintingsData from "../data/paintingsData";
import './Year.scss';


const Year2022 = () => {
    const scrollRef = useRef(null);

    useEffect(() => {
        const handleWheel = (event) => {
            event.preventDefault();
            if (scrollRef.current) {
                scrollRef.current.scrollLeft += event.deltaY;
            }
        };

        const scrollContainer = scrollRef.current;
        scrollContainer.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            scrollContainer.removeEventListener('wheel', handleWheel);
        };
    }, []);



    return(
        <div className="year-container" ref={scrollRef}>
            <div className="year-item" >
            <picture>
            <img src="./images/2022/UplandFolk-black-large.svg" alt="Upland Folk title text" className="img-light"/>
            
            </picture>
            <picture>
            
            <img src="./images/2022/UplandFolk-white-large.svg" alt="Upland Folk title text" className="img-dark"/>
            </picture>
            </div>
            <div className="year-item">
            <p>‘Upland Folk’ is a series of eight paintings by Irish artist Peadar Jolliffe-Byrne. 
                The exhibition was made in response to the research Peadar carried out in 2021 during his work on the
                UNESCO World Heritage Tentative List application for the cultural landscape of the Burren, Co. Clare, Ireland.
            </p>
            <p>
                The Burren provides a plethora of inspirational starting points for any sort of artistic endeavour, ranging from its 
                globally significant karst environment, to its extraordinary collection of well preserved archaeological sites, to the 
                unique ecological mosaic of its flora and fauna. Yet perhaps, the most outstanding characteristic within this seemingly 
                inhospitable landscape are the people who live there.
                </p>
            </div>            
            <Gallery year="2022" paintingsData={paintingsData["2022"]} /> 
        </div>
    );
};

export default Year2022;