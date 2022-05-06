import React, { useState, useEffect, useRef } from "react";
import NoticiaMiniatura from "./NoticiaMiniatura";
import { fetchMeuFeed, fetchTemaNoticia } from "../fetchMeuFeed";
import eco from "../icons/eco.svg";
import publico from "../icons/publico.svg";
import observador from "../icons/observador.png";
import SortButton from "./SortButton";
import ButtonSection from "./ButtonSection";
import { hasFiltros, saveFitros, isDefAudio } from "../firebase";
import LoadingMiniatura from "./LoadingMiniatura";
import { uniqueSort } from "domutils";

function OMeuFeed() {
  const renders = useRef(0);
  const refPesquisa = useRef(null);
  const [arrayRefs, setArrayRefs] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [searchNoticias, setSearchNoticias] = useState(null);
  const [displayNoticias, setDisplayNoticias] = useState([]);
  const [fontes, setFontes] = useState(null);
  const [temas, setTemas] = useState(null);
  const [defAudio, setDefAudio] = useState({
    genero: "male",
    vel: 1,
    pitch: 0,
  });
  const loadingMin = [0, 1, 2, 3, 4, 5];
  const escolherFonte = (id, estado) => {
    setFontes({ ...fontes, [id]: estado });
    saveFitros(temas, { ...fontes, [id]: estado });
  };
  const escolherTema = (id, estado) => {
    setTemas({ ...temas, [id]: estado });
    saveFitros({ ...temas, [id]: estado }, fontes);
  };

  useEffect(() => {
    //verificar no firebase se exitem filtros selecionados e dar checked ao que estão
    hasFiltros().then((filtros) => {
      if (filtros === false) {
        setTemas({
          politica: false,
          sociedade: false,
          coronavirus: false,
          economia: false,
          cultura: false,
          desporto: false,
          ciencia: false,
          tecnologia: false,
        });
        setFontes({
          publico: false,
          eco: false,
          observador: false,
        });
      } else {
        setTemas(filtros.temas);
        setFontes(filtros.fontes);
      }
    });
  }, []);

  const checkFontes = (el) => {
    // Verifica se todas as fontes são falsas
    if (!fontes.publico && !fontes.observador && !fontes.eco) return true;
    // verifica se a fonte correspondente ao estado é verdadeira ou false
    if (
      (el.fonte === "publico" && fontes.publico) ||
      (el.fonte === "eco" && fontes.eco) ||
      (el.fonte === "observador" && fontes.observador)
    )
      return true;
    return false;
  };

  const pauseAllAudios = () => {
    //percorre todos os elementos das referências distríbuidas pelos PlayButtons e chama a função pause de cada PlayButton
    arrayRefs.forEach((elem) => {
      try {
        if (elem.current != null) elem.current.pause_func();
      } catch (e) {}
    });
  };

  const refreshAllAudios = () => {
    // função semelhante à pauseAllAudios()
    arrayRefs.forEach((elem) => {
      try {
        if (elem.current != null) elem.current.refresh_func();
      } catch (e) {}
    });
  };

  const filtrar_fontes = () => {
    let arr_filtrado;
    if (searchNoticias == null) {
      arr_filtrado = noticias.filter((el) => checkFontes(el));
    } else {
      arr_filtrado = searchNoticias.filter((el) => checkFontes(el));
    }
    setDisplayNoticias(arr_filtrado);
    refreshAllAudios();
  };

  const pesquisarNoticias = (texto) => {
    let texto_lower = texto.toLowerCase();
    let noticias_pesquisadas = [];
    noticias_pesquisadas = noticias.filter((el) => {
      let titulo_lower = el.titulo.toLowerCase();
      return titulo_lower.includes(texto_lower);
    });

    if (texto == "") {
      setSearchNoticias(noticias);
      setDisplayNoticias(noticias);
    } else {
      if (noticias_pesquisadas != undefined) {
        setSearchNoticias([...noticias_pesquisadas]);
        setDisplayNoticias([...noticias_pesquisadas]);
      } else {
        setSearchNoticias(null);
        setDisplayNoticias(null);
      }
    }
  };

  useEffect(() => {
    filtrar_fontes();
  }, [fontes]);

  useEffect(() => {
    isDefAudio().then((res) => {
      if (res !== false) {
        setDefAudio(res);
      }
    });

    

    return () => {
      //console.log(arrayRefs)
      pauseAllAudios();
    };
  }, []);

  useEffect(() => {
    setNoticias([]);

    const temTemas = () => {
      for (let prop in temas) {
        if (temas[prop] === true) return true;
      }
      return false;
    };

    if (temas !== null) {
      if (temTemas()) {
        //se tiver temas selecionados fazer fetch com as fontes selecionadas
        fetchTemaNoticia(temas).then((res) => {
          setNoticias(res);
          setDisplayNoticias(res);
          setArrayRefs(res.map((noticia) => React.createRef()));
        });
      } else {
        //se não, fazer fetch das ultimas 25 noticias dos 3 jornais (10 público, 10 observador, 5 eco)
        fetchMeuFeed().then((news) => {
          setNoticias(news);
          setDisplayNoticias(news);
          setArrayRefs(news.map((noticia) => React.createRef()));
        });
      }
    }
  }, [temas]);

  useEffect(() => {
    filtrar_fontes();
    pesquisarNoticias(refPesquisa.current.value);
  }, [noticias]);

  return (
    <div className='py-5'>
      {/*console.log("display", displayNoticias)*/}
      <h1 className='pl-11 text-center font-semibold text-2xl my-5'>O Meu Feed</h1>
      <div className='container mx-auto px-10'>
        <div className='pb-7'>
          {temas !== null && (
            <ButtonSection name='Temas'>
              <SortButton id='politica' content='Política' type='text' onChangeHandle={escolherTema} is_checked={temas.politica} />
              <SortButton id='sociedade' content='Sociedade' type='text' onChangeHandle={escolherTema} is_checked={temas.sociedade} />
              <SortButton id='coronavirus' content='Covid-19' type='text' onChangeHandle={escolherTema} is_checked={temas.coronavirus} />
              <SortButton id='economia' content='Economia' type='text' onChangeHandle={escolherTema} is_checked={temas.economia} />
              <SortButton id='cultura' content='Cultura' type='text' onChangeHandle={escolherTema} is_checked={temas.cultura} />
              <SortButton id='desporto' content='Desporto' type='text' onChangeHandle={escolherTema} is_checked={temas.desporto} />
              <SortButton id='ciencia' content='Ciência' type='text' onChangeHandle={escolherTema} is_checked={temas.ciencia} />
              <SortButton id='tecnologia' content='Tecnologia' type='text' onChangeHandle={escolherTema} is_checked={temas.tecnologia} />
            </ButtonSection>
          )}
          {fontes !== null && (
            <ButtonSection name='Fontes'>
              <SortButton id='publico' content={publico} type='img' size='h-6' onChangeHandle={escolherFonte} is_checked={fontes.publico} />
              <SortButton id='eco' content={eco} type='img' size='h-4' onChangeHandle={escolherFonte} is_checked={fontes.eco} />
              <SortButton
                id='observador'
                content={observador}
                type='img'
                size='h-2'
                onChangeHandle={escolherFonte}
                is_checked={fontes.observador}
              />
            </ButtonSection>
          )}
          <div>
            <h6 className='mb-1 text-xl font-semibold'>Pesquisar</h6>
            <input
              type='text'
              ref={refPesquisa}
              onChange={(e) => {
                pesquisarNoticias(e.target.value);
              }}
              className='text-sm w-full md:w-96 bg-slate-300 rounded-lg p-2'
              placeholder='Título'
            />
            <div className='inline ml-8'>
              Áudios
              <button onClick={refreshAllAudios} className='py-1 px-2 ml-2 shadow-sm border-2 rounded-lg text-black'>
                Refresh
              </button>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {noticias.length > 0
            ? displayNoticias.map((el, index) => (
                <NoticiaMiniatura ref={arrayRefs[index]} pauseAllFunc={pauseAllAudios} info={el} key={el.id} def_audio={defAudio} />
              ))
            : loadingMin.map((e) => <LoadingMiniatura key={e} />)}
        </div>
      </div>
    </div>
  );
}

export default OMeuFeed;
