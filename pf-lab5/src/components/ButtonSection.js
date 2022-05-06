const ButtonSection = (props) => {
  let section = (
    <div className='my-4'>
      <h6 className='mb-3 text-xl font-semibold'>{props.name}</h6>
      <div className='flex justify-start'>{props.children}</div>
    </div>
  );

  return section;
};

export default ButtonSection;
