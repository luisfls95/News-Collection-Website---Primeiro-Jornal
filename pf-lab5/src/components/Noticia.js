import "../css/App.css";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { fetchNoticia } from "../fetchNoticia";
import { guardarNoticia, useAuth, isGuardado, isDefAudio } from "../firebase";
import GuardarButton from "./GuardarButton";
import parse from "html-react-parser";
import eco from "../icons/eco.svg";
import observador from "../icons/observador.png";
import publico from "../icons/publico.svg";
import mainEco from "../img/eco.png";
import mainObs from "../img/obs.png";
import mainPub from "../img/pub.png";
import { Remarkable } from "remarkable";
import PlayButton from "./PlayButton";
import fetchUltimas from "../fetchUltimas";
import NoticiaMiniatura from "./NoticiaMiniatura";

function Noticia() {
  const [noticia, setNoticia] = useState({});
  const [noticias, setNoticias] = useState([]);
  const [guardado, setGuardado] = useState(false);
  const userID = useAuth();
  const noticia_param = useParams();
  const [defAudio, setDefAudio] = useState({
    genero: "male",
    vel: 1,
    pitch: 0,
  });

  const [arrayRefs, setArrayRefs] = useState([React.createRef()]);

  const pauseAllAudios = () => {
    //console.log(arrayRefs);
    arrayRefs.forEach((elem) => {
      try {
        if (elem.current != null) elem.current.pause_func();
      } catch (e) {
        //console.log(e);
      }
    });
  };

  //guardar notícia - enviamos como callback para o componente GuardarButton
  const adicionarNoticia = (is_checked) => {
    setGuardado(!guardado);
    guardarNoticia(noticia_param.id, noticia, is_checked);
  };

  useEffect(() => {
    //verificar se está guardado
    isGuardado(noticia_param.id).then((res) => setGuardado(res));
  }, [userID]);

  const removeCurlyBracketsNumerals = (body) => {
    //console.log(body);
    let newbody = body;
    let counter = 0;
    let hasBrackets = true;

    while (hasBrackets) {
      let bracket = "{" + counter + "}";

      if (newbody.includes(bracket)) {
        newbody = newbody.replace(bracket, "‎");
        counter++;
      } else hasBrackets = false;
    }
    return newbody;
  };

  const separateByCurlyBrackets = (body) => {
    //console.log(body)
    let newBody = []
    let rest = body
    let hasBrackets = true
    let count = 0

    while (hasBrackets){
      let bracket = "{" + count + "}";
      if (rest.includes(bracket)){
        let split = rest.split(bracket)
        newBody.push(split.shift())
        rest = split[0]
        count++
      }
      else {
        newBody.push(rest)
        hasBrackets = false
      }
    }

    //console.log(newBody)

    return newBody
  }

  const carregarNoticias = () => {
    const md = new Remarkable();
    //fazer fetch da noticia com id e fonte recebido no url
    fetchNoticia(noticia_param.fonte, noticia_param.id)
      .then((resultado) => {
        if (noticia_param.fonte === "eco") {
          // alterar isto para ajudar no render docorpo
          setNoticia({
            titulo: resultado.title.long,
            desc: <h5 className={"font-medium mb-7"}>{resultado.lead}</h5>,
            img: resultado.images.wide.urlTemplate,
            body: parse(md.render(removeCurlyBracketsNumerals(resultado.body))),
            fonte: "eco",
            data: noticia_param.dia + "-" + noticia_param.mes + "-" + noticia_param.ano,
            body_array: separateByCurlyBrackets(resultado.body),
            // arranjar o tipo
          });
        } else {
          let imagem = resultado.img;
          if (resultado.img == "no image") {
            switch (noticia_param.fonte) {
              case "observador":
                imagem = mainObs;
                break;
              case "publico":
                imagem = mainPub;
                break;
              case "eco":
                imagem = mainEco;
                break;
            }
          }
          setNoticia({
            titulo: resultado.title,
            img: imagem,
            desc: resultado.desc.map((e, index) => (
              <h5 className={"font-medium mb-7"} key={index}>
                {e.content}
              </h5>
            )),
            body: resultado.content.map((e, index) => {
              switch (e.type) {
                case "p":
                  return (
                    <p key={index} className='mb-5'>
                      {parse(e.content)}
                    </p>
                  );
                  break;
                case "h2":
                  return (
                    <h2 key={index} className='mb-5 font-semibold text-2xl'>
                      {parse(e.content)}
                    </h2>
                  );
                  break;
                case "video":
                  return parse(e.content);
                  break;
                case "audio":
                  return (
                    <audio key={index} className='w-full' controls>
                      <source src={e.content} type='audio/mp3' />
                    </audio>
                  );
              }
            }),
            fonte: noticia_param.fonte,
            data: noticia_param.dia + "-" + noticia_param.mes + "-" + noticia_param.ano,
            body_array: resultado.content.map((elem, index) => {
              if (elem.type != "audio" && elem.type != "video") {
                return elem.content;
              } else if (index == 0) {
                //console.log(resultado.desc[0]);
                return resultado.desc[0].content;
              }
            }),
          });
        }
      })
      .catch((err) => {
        //console.log(err);
      });

    //fazer fetch das "outras noticias" (ou "noticias relacionadas" se forem a noticia for do jornal ECO)
    fetchUltimas(3, noticia_param.id, noticia_param.fonte).then(
      (news) => {
        //console.log(news);
        setNoticias(news);
        let array = news.map((element) => React.createRef());
        setArrayRefs([...arrayRefs, ...array]);
      },
      (err) => {
        //console.log(err);
      }
    );
  };

  useEffect(() => {
    //fazer fetch das noticias
    carregarNoticias();

    isDefAudio().then((res) => {
      if (res !== false) {
        setDefAudio(res);
      }
    });
  }, []);

  useEffect(() => {
    //fazer fetch das noticias se os parameters mudarem
    carregarNoticias();
  }, [noticia_param]);

  return (
    <div className='py-12'>
      <div className='lg:container mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 px-10'>
          <div className='lg:col-span-8'>
            <h1 className='font-bold text-4xl mb-4 leading-10'>{noticia.titulo}</h1>
            {noticia.desc}
            <PlayButton
              contents={noticia.body_array}
              id={noticia_param.id}
              type='body'
              jornal={noticia_param.fonte}
              def_audio={defAudio}
              ref={arrayRefs[0]}
              pauseAllFunc={pauseAllAudios}
            />
            <div className='py-3 grid grid-cols-6 mt-2 gap-4 items-center'>
              <div className='col-span-2'>
                <GuardarButton is_saved={guardado} onChangeHandle={adicionarNoticia} id={noticia_param.id} info={noticia} />
              </div>
              <div className='col-end-7 col-span-3 text-right'>
                {(() => {
                  switch (noticia_param.fonte) {
                    case "publico":
                      return <img className='inline h-8' src={publico} />;
                      break;
                    case "eco":
                      return <img className='inline h-8' src={eco} />;
                      break;
                    case "observador":
                      return <img className='inline w-36' src={observador} />;
                      break;
                  }
                })()}
              </div>
            </div>
            <hr className='border-2 my-4' />
            <img className='w-full pt-3.5' src={noticia.img} />
            <div className='corpo-noticia text-base py-8'>{noticia.body}</div>
          </div>
          <div className='col-span-4'>
            {noticia_param.fonte == "eco" ? (
              <h5 className='font-semibold pl-3'>Notícias Relacionadas</h5>
            ) : (
              <h5 className='font-semibold pl-3'>Outras Notícias</h5>
            )}
            <div>
              {noticias &&
                noticias.map((el, index) => (
                  <NoticiaMiniatura ref={arrayRefs[index + 1]} pauseAllFunc={pauseAllAudios} info={el} key={index} def_audio={defAudio} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Noticia;
