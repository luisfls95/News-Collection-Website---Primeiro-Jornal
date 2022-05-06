import { PlayIcon, PauseIcon } from "@heroicons/react/solid";
import { useState, useEffect } from "react";

function AudioPlayer(props) {
  const [aTocar, setATocar] = useState(false);
  const playPause = () => {
    props.func();
    setATocar(!aTocar);
  };

  return (
    <div className='my-3'>
      <div className='grid items-center rounded-lg bg-slate-200 w-full h-12 px-1'>
        <div onClick={playPause} className='cursor-pointer'>
          {!aTocar ? (
            <PlayIcon className='h-10 w-10 fill-slate-800' aria-hidden='true' />
          ) : (
            <PauseIcon className='h-10 w-10 fill-slate-800' aria-hidden='true' />
          )}
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer;
