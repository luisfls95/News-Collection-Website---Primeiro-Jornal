import React from "react";
import { useState, useEffect, useRef } from "react";
import { PlayIcon, PauseIcon, RefreshIcon } from "@heroicons/react/solid";

const PlayButton = React.forwardRef((props, ref) => {
  // Diferentes JSXs para o botão de play nos diferentes estados
  let playjsx = <PlayIcon className='h-10 w-10 fill-slate-800 hover:fill-slate-900' aria-hidden='true' />;
  let pausejsx = <PauseIcon className='h-10 w-10 fill-slate-800 hover:fill-slate-900' aria-hidden='true' />;
  let loadingjsx = "Loading";

  let reference = useRef({ hasStarted: false, times: 0 });
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState("animate-pulse");
  const [buttonContent, setButtonContent] = useState(loadingjsx);

  useEffect(() => {
    if (ref != null) {
      // cada vez que os componentes pais são re-renderizados são atribuidos novas referencias pelo forward ref pelo que cada vez que isto aconte
      // voltam a ser aplicados as funções à referência para facil acesso nos elementos pai
      ref.current.pause_func = pause;
      ref.current.refresh_func = refresh;
    }
  });

  useEffect(() => {
    if (props.contents == undefined) return;

    //console.log("vel: ", typeof props.def_audio.vel, "pitch: ", typeof props.def_audio.pitch);
    reference.current.times += 1;

    fetch_audio();
  }, [props.contents]);

  const fetch_audio = () => {
    // se o conteudo a ser passado para o botão for null ou vazio o pedido não é efetuado e o botão de play informa que não existe audio
    if (props.contents[0] == null || props.contents[0] == "") {
      setButtonContent("Sem audio");
      setLoading("");
      return;
    }

    //console.log(props.contents.length)

    // aqui cria-se um novo audio context que se mantem entre renders pois é necessário garantir o continuo acesso ao audio context que é inicializado
    reference.current.context = new AudioContext();
    reference.current.source = reference.current.context.createBufferSource();
    fetch("https://pf-py-api.herokuapp.com/audio/", {
      method: "POST",
      body: JSON.stringify({
        type: props.type,
        id: props.id,
        gender: props.def_audio.genero,
        jornal: props.jornal,
        contents: props.contents,
        speed: Number(props.def_audio.vel),
        pitch: Number(props.def_audio.pitch),
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        try {
          return reference.current.context.decodeAudioData(arrayBuffer);
        } catch (e) {
          //console.log(e)
        }
      })
      .then((audioBuffer) => {
        try {
          reference.current.source.buffer = audioBuffer;
        } catch (e) {
          //console.log(e);
        }
        reference.current.source.connect(reference.current.context.destination);
        setDisable(false);
        setButtonContent(playjsx);
        setLoading("");
      });
  };

  const pause = () => {
    // condição que impede que o botão seja premido
    if (disable || !reference.current.hasStarted) return;
    reference.current.context.suspend().then();
    setButtonContent(playjsx);
    //ref.current.state = "suspended";
    setLoading("");
  };

  const refresh = () => {
    //console.log("yo");
    // refresh do audio associado à noticia permitindo, fazer um novo pedido se algo correr mal
    // mas acima de tudo tocar o audio desde o inicio
    // pois o audio context não permite voltar ao inicio nem navegar uma timeline
    // antes de cada refresh cada audio é pausado para garantir que o context anterior se estiver a tocar não continua a fazê-lo
    // pois a referencia dele irá ser perdida
    pause();
    reference.current.hasStarted = false;
    setDisable(true);
    setButtonContent(loadingjsx);
    setLoading("animation-pulse");
    fetch_audio();
  };

  const play_pause = () => {
    if (disable) return;

    if (props.pauseAllFunc != undefined) props.pauseAllFunc();

    //console.log(ref);

    if (!reference.current.hasStarted) {
      reference.current.source.start();
      reference.current.hasStarted = true;
      setButtonContent(pausejsx);
      // criação de um "dummy" state duplicado para garantir um nivel minimo de funcionalidade no microsoft edge
      ref.current.state = "running";
    } else if (ref.current.state == "running" || reference.current.context.state == "running") {
      reference.current.context.suspend().then();
      ref.current.state = "suspended";
      setButtonContent(playjsx);
    } else if (ref.current.state == "suspended" || reference.current.context.state == "suspended") {
      reference.current.context.resume().then();
      ref.current.state = "running";
      setButtonContent(pausejsx);
    }
  };

  return (
    <div ref={ref} className={`my-3 flex justify-between items-center rounded-lg bg-slate-200 w-full h-12 px-1 ${loading}`}>
      <div onClick={play_pause} className='cursor-pointer'>
        {buttonContent}
      </div>
      <div onClick={refresh} className='cursor-pointer col-end-13 text-right'>
        <RefreshIcon className='h-7 w-7 mr-1.5 fill-slate-800 hover:fill-slate-900' aria-hidden='true' />
      </div>
    </div>
  );
});

export default PlayButton;
