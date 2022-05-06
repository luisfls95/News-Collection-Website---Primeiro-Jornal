import React from "react";
import { Link } from "react-router-dom";
import eco from "../icons/eco.svg";
import observador from "../icons/observador.png";
import publico from "../icons/publico.svg";
import PlayButton from "./PlayButton";
import parse from "html-react-parser";
import mainEco from "../img/eco.png";
import mainObs from "../img/obs.png";
import mainPub from "../img/pub.png";

const NoticiaMiniatura = React.forwardRef((props, ref) => {
  const data = new Date(props.info.data);

  let image;
  try {
    if (props.info.img == "" || props.info.img == null) {
      switch (props.info.fonte) {
        case "eco":
          image = mainEco;
          break;
        case "observador":
          image = mainObs;
          break;
        case "publico":
          image = mainPub;
          break;
        default:
          return null;
      }
    } else image = props.info.img;
  } catch (e) {
    image = observador;
    console.log(e);
  }

  return (
    <div className='relative bg-white shadow-md m-3 rounded-lg pb-24 hover:shadow-lg'>
      <Link to={`/noticia/${props.info.fonte}/${data.getFullYear()}/${data.getMonth() + 1}/${data.getDate()}/${props.info.id}`}>
        <img src={image} className='mx-auto w-full rounded-t-lg h-60 object-cover hover:cursor-pointer' />
      </Link>
      <div className='p-4'>
        <Link to={`/noticia/${props.info.fonte}/${data.getFullYear()}/${data.getMonth() + 1}/${data.getDate()}/${props.info.id}`}>
          <h6 className='text-base leading-5 font-semibold mb-2'>{parse("" + props.info.titulo)}</h6>
          <p className='text-base'>{parse("" + props.info.lead)}</p>
        </Link>
        <div className='absolute bottom-8 right-2.5 left-2.5'>
          <PlayButton
            contents={[props.info.lead]}
            id={props.info.id}
            type='desc'
            jornal={props.info.fonte}
            def_audio={props.def_audio}
            ref={ref}
            pauseAllFunc={props.pauseAllFunc}
          />
        </div>
      </div>
      <div className='flex justify-between items-center absolute bottom-3 left-3 right-3'>
        <div className='text-xs'>FONTE</div>
        <div>
          {(() => {
            switch (props.info.fonte) {
              case "eco":
                return <img src={eco} className='w-11 ' />;
              case "observador":
                return <img src={observador} className='w-28' />;
              case "publico":
                return <img src={publico} className='w-5' />;
              default:
                return null;
            }
          })()}
        </div>
      </div>
    </div>
  );
});

export default NoticiaMiniatura;
