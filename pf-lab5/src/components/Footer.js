import { Link } from "react-router-dom";
import eco from "../icons/eco.svg";
import publico from "../icons/publico.svg";
import observador from "../icons/observador.png";

function Footer() {
  const date = new Date();
  return (
    <div className='border-t-2 py-10 bg-white'>
      <div className='container mx-auto px-72'>
        <div className='mb-9 text-center'>
          <Link to='/' className='font-base hover:text-indigo-600 mx-3'>
            Página Inicial
          </Link>
          <Link to='/ultimas' className='font-base hover:text-indigo-600 mx-3'>
            Últimas
          </Link>
          <Link to='/omeufeed' className='font-base hover:text-indigo-600 mx-3'>
            O Meu Feed
          </Link>
          <Link to='/guardadas' className='font-base hover:text-indigo-600 mx-3'>
            Notícias Guardadas
          </Link>
        </div>
        <div className='grid grid-cols-2 items-center mb-5'>
          <a href='https://github.com/simbentes/pf-lab5' target={"_blank"}>
            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' viewBox='0 0 16 16'>
              <path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z' />
            </svg>
          </a>
          <div className='text-right'>
            <div className='text-xxs pt-2 inline mr-2'>POWERED BY</div>
            <img src={publico} className='w-5 inline mx-1' />
            <img src={eco} className='w-10 inline mx-1' />
            <img src={observador} className='w-20 inline ml-1' />
          </div>
        </div>
        <div className='grid grid-cols-2 text-xs'>
          <div className='text-left'>© {date.getFullYear()} Primeiro Jornal. Todos os direitos reservados.</div>
          <div className='text-right'>
            Desenvolvido por{" "}
            <a href='https://github.com/luisfls95' target={"_blank"} className='font-semibold hover:text-indigo-600'>
              Luís Simões
            </a>{" "}
            e{" "}
            <a href='https://github.com/simbentes' target={"_blank"} className='font-semibold hover:text-indigo-600'>
              Simão Bentes
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
