import React, { useState, useEffect, useRef } from "react";
import NoticiaMiniatura from "./NoticiaMiniatura";
import fetchUltimas from "../fetchUltimas";
import { isDefAudio } from "../firebase";
import LoadingMiniatura from "./LoadingMiniatura";

function Ultimas() {
  const ref = useRef(0);
  const loadingMin = [0, 1, 2, 3, 4, 5];
  const [noticias, setNoticias] = useState(null);
  const [arrayRefs, setArrayRefs] = useState([]);
  const [defAudio, setDefAudio] = useState({
    genero: "male",
    vel: 1,
    pitch: 0,
  });

  const pauseAllAudios = () => {
    arrayRefs.forEach((elem) => {
      try {
        if (elem.current != null) elem.current.pause_func();
      } catch (e) {
        console.log(e);
      }
    });
  };

  useEffect(() => {
    fetchUltimas().then(
      (news) => {
        setNoticias(news);
        setArrayRefs(news.map((noticia) => React.createRef()));
      },
      (err) => {
        console.log(err);
      }
    );
  }, []);

  useEffect(() => {
    ref.current = ref.current + 1;
  });

  useEffect(() => {
    isDefAudio().then((res) => {
      if (res !== false) {
        setDefAudio(res);
      }
    });
  }, []);

  return (
    <div className='py-5'>
      <h1 className='pl-11 text-center font-semibold text-2xl mb-5 mt-16'>Últimas Notícias</h1>
      <div className='container mx-auto px-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {noticias !== null
            ? noticias.map((el, index) => (
                <NoticiaMiniatura ref={arrayRefs[index]} pauseAllFunc={pauseAllAudios} info={el} key={index} def_audio={defAudio} />
              ))
            : loadingMin.map((e) => <LoadingMiniatura key={e} />)}
        </div>
      </div>
    </div>
  );
}

export default Ultimas;
