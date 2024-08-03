import React from 'react';
import he from 'he';

function Pagination({ pagination, callback }) {
    const discardWords = (str) => {
        const wordsToDiscard = ["Previous", "Next"];
        const pattern = new RegExp(`\\b(${wordsToDiscard.join('|')})\\b`, 'gi');
        return str.replace(pattern, '').trim().replace(/\s+/g, ' ');
    }

    return (
        <>
            <div className="block-27 mt-3 text-center">
                <ul>
                    {pagination.links && pagination.links.map((element, index) => (
                        <li key={index} className={element.active ? "active" : ""}><a href='#' onClick={() => { callback(element.url) }} ><span>{discardWords(he.decode(element.label))}</span></a></li>
                    ))}

                </ul>
            </div >
        </>
    );
}

export default Pagination;
