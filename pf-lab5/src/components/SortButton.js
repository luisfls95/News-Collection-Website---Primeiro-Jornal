const SortButton = (props) => {
  let buttonContent;
  if (props.type === "text") buttonContent = props.content;
  else if (props.type === "img") buttonContent = <img src={props.content} className={props.size + " inline"} />;

  let button = (
    <div className='pr-3'>
      <input
        type='checkbox'
        id={props.id}
        name={props.id}
        className='peer hidden'
        onChange={(e) => {
          props.onChangeHandle(e.target.name, e.target.checked);
        }}
        checked={props.is_checked}
      />
      <label htmlFor={props.id} className='rounded-lg py-2.5 px-3 bg-slate-300 peer-checked:bg-indigo-400 peer-checked:text-white'>
        {buttonContent}
      </label>
    </div>
  );
  return button;
};

export default SortButton;
