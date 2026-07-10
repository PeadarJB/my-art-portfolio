import React, { useEffect, useRef } from "react";
import Gallery from "../components/Gallery";
import paintingsData from "../data/paintingsData";
import './Year.scss';


const Year2021 = () => {
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
            
            <Gallery year="2021" paintingsData={paintingsData["2021"]} />
            
        </div>
    );
};

export default Year2021;