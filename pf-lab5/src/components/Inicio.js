import "./../css/App.css";
import Ultimas from "./Ultimas";
import eco from "../icons/eco.svg";
import publico from "../icons/publico.svg";
import observador from "../icons/observador.png";

export default function Inicio() {
  return (
    <div>
      <div className='fixed right-0 left-0 bottom-0 -z-30'>
        <div className='altura-index flex justify-center items-center'>
          <div className='text-center'>
            <div className='text-5xl font-bold'>Primeiro Jornal.</div>
            <div className='mb-4'>A sua audioteca de notícias portuguesas.</div>
            <div className='text-center'>
              <div className='text-xxs pt-2'>POWERED BY</div>
              <img src={publico} className='w-10 inline mx-2' />
              <img src={eco} className='w-16 inline mx-2' />
              <img src={observador} className='w-32 inline mx-2' />
            </div>
          </div>
        </div>
      </div>
      <div className='bg-ultimas'>
        <Ultimas />
      </div>
    </div>
  );
}
