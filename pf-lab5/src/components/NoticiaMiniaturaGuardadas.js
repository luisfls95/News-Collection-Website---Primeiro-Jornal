import { useState } from "react";
import { guardarNoticia } from "../firebase";
import { Link } from "react-router-dom";
import parse from "html-react-parser";
import eco from "../icons/eco.svg";
import observador from "../icons/observador.png";
import publico from "../icons/publico.svg";
import AudioPlayer from "./AudioPlayer";
import GuardarButton from "./GuardarButton";

function NoticiaMiniaturaGuardadas(props) {
  const data = new Date(props.info.data);
  const [guardado, setGuardado] = useState(true);
  const removerNoticia = (is_checked, noticia_id, noticia_info) => {
    setGuardado(!guardado);
    guardarNoticia(noticia_id, noticia_info, is_checked);
  };
  const audioATocar = (aTocar) => {
    if (aTocar) {
      return true;
    }
    return false;
  };

  let image;
  try {
    image = props.info.img;
  } catch (e) {
    console.log(e);
  }

  return (
    <div className='relative bg-white shadow-md m-3 rounded-lg'>
      <div className='grid grid-cols-12'>
        <div className='col-span-3'>
          <Link to={`/noticia/${props.info.fonte}/${data.getFullYear()}/${data.getMonth() + 1}/${data.getDate()}/${props.info.id}`}>
            <img src={image} className='w-full h-full object-cover hover:cursor-pointer rounded-tl-lg rounded-bl-lg' />
          </Link>
        </div>
        <div className='col-span-9 flex items-center'>
          <div className='py-3 px-4 w-full'>
            <Link to={`/noticia/${props.info.fonte}/${data.getFullYear()}/${data.getMonth() + 1}/${data.getDate()}/${props.info.id}`}>
              <div className='pb-2 grid grid-cols-12 gap-4'>
                <div className='col-start-1 col-end-11'>
                  <h6 className='text-base leading-5 font-semibold mb-2'>{parse("" + props.info.titulo)}</h6>
                </div>
                <div className='col-span-2 col-end-13 text-right'></div>
              </div>
            </Link>
            <div className='grid grid-cols-8 items-center'>
              <div className='col-start-1 col-span-3 pr-2'>
                {(() => {
                  switch (props.info.fonte) {
                    case "eco":
                      return <img src={eco} className='w-14 inline' />;
                    case "observador":
                      return <img src={observador} className='w-28 inline' />;
                    case "publico":
                      return <img src={publico} className='w-5 inline' />;
                    default:
                      return null;
                  }
                })()}
              </div>
              <div className='col-start-9 col-end-13 pl-2 items-center'>
                <GuardarButton is_saved={guardado} onChangeHandle={removerNoticia} info={props.info} id={props.info.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoticiaMiniaturaGuardadas;
