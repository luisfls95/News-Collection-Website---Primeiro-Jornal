import { SaveIcon } from "@heroicons/react/solid";

function GuardarButton(props) {
  return (
    <>
      <input
        type='checkbox'
        id={`guardar${props.id}`}
        name='guardar'
        checked={props.is_saved}
        className='peer hidden'
        onChange={(e) => {
          props.onChangeHandle(e.target.checked, props.id, props.info);
        }}
      />
      <label
        htmlFor={`guardar${props.id}`}
        className='px-4 py-1 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 flex justify-center items-center peer-checked:bg-gray-300 peer-checked:text-black'
      >
        <SaveIcon className='h-8 w-8 inline pr-2' />
        {props.is_saved ? "Guardado" : "Guardar"}
      </label>
    </>
  );
}

export default GuardarButton;
