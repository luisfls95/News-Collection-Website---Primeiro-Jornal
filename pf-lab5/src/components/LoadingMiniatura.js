 const LoadingMiniatura = () => {
  return (
    <div className='relative bg-white shadow-md m-3 rounded-lg pb-24 hover:shadow-lg animate-pulse'>
      <div className='mx-auto w-full rounded-t-lg h-60 object-cover hover:cursor-pointer bg-slate-300 rounded-lg' />

      <div className='p-4'>
        <h6 className='text-base leading-5 font-semibold mb-2 h-6 bg-slate-300 rounded-lg'></h6>
        <h6 className='text-base leading-5 font-semibold h-6 bg-slate-300 rounded-lg w-2/5 mb-5'></h6>
        <p className='text-base h-3 my-2 bg-slate-300 rounded-lg'></p>
        <p className='text-base h-3 my-2 bg-slate-300 rounded-lg'></p>
        <p className='text-base h-3 my-2 bg-slate-300 rounded-lg w-2/3'></p>

        <div className='absolute bottom-14 right-2.5 left-2.5 h-12 bg-slate-300 rounded-lg'></div>
      </div>
      <div className='flex justify-between items-center absolute bottom-3 left-3 right-3'>
        <div className='h-2 w-14 bg-slate-300 rounded-lg'></div>
        <div className='h-8 w-14 bg-slate-300 rounded-lg'></div>
      </div>
    </div>
  );
};

export default LoadingMiniatura