
import { useState } from "react";

const Genre = ({name, handler}) => {
    return (
        <>
        <button onClick={() => handler(name)}> {name} </button>
        </>
    )
}

export default Genre;