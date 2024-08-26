import React from 'react';
import { useSelector } from 'react-redux';
import { RingLoader } from 'react-spinners';

function Loader() {  // Receive `loading` as a prop
    const loading = useSelector(state => state.loader.loading);
    const color = "#0071e7";

    return (
        loading && (  // Use strict equality for boolean values
            <div className="blur-overlay">
                <RingLoader
                    color={color}
                    loading={loading}
                    size={100}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </div>
        )
    );
}

export default Loader;
