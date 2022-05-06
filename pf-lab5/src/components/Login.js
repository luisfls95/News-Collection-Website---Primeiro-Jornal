import { signInWithPopup, GoogleAuthProvider, signInWithPhoneNumber } from "firebase/auth";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { useState, useEffect, useRef } from "react";
import { auth } from "../firebase";
import "../css/App.css";
import g_icon from "../icons/g_icon.svg";

function Login() {
  const auth = getAuth();
  const num_tel = useRef();
  const input_codigo = useRef();
  const [resultado, setResultado] = useState({});
  const [enterTel, setEnterTel] = useState(true);
  const [alerta, setAlerta] = useState("");

  useEffect(() => {
    let reCaptchaVerifier = new RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log("chegou aqui");
          onSignInSubmit(reCaptchaVerifier);
        },
      },
      auth
    );
    reCaptchaVerifier.render();
  }, []);

  const iniciarSessaoTelemovel = () => {};

  const onSignInSubmit = (reCap) => {
    console.log("será");
    signInWithPhoneNumber(auth, "+351" + num_tel.current.value, reCap)
      .then((confirmationResult) => {
        console.log("enviou");
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        setResultado(confirmationResult);
        setEnterTel(!enterTel);

        // ...
      })
      .catch((error) => {
        // Error; SMS not sent
        setAlerta("Número de Telemóvel inválido.");
        return false;
        // ...
      });
  };

  const confimarCodigo = (codigo) => {
    resultado
      .confirm(codigo)
      .then((result) => {
        // User signed in successfully.
        console.log(result.user);
        // ...
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        setAlerta("Código inválido.");
        input_codigo.current.value = "";
        alert("Código inválido.");
      });
  };

  //iniciar sessão com a conta da google
  const iniciarSessaoGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        //sessão iniciada
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className='h-screen flex justify-center items-center'>
      <div className='text-center'>
        <div className='text-5xl font-bold'>Primeiro Jornal.</div>
        <div className='mb-4'>A sua audioteca de notícias portuguesas.</div>
        <div>
          <button
            className='my-4 px-4 py-3 mx-auto bg-white rounded-md flex items-center text-sm  border-4 text-black'
            onClick={iniciarSessaoGoogle}
          >
            <img src={g_icon} className='w-8 pr-3' alt='logo' />
            Iniciar Sessão com o Google
          </button>
        </div>
        <div>
          <h1 className='pt-5 pb-2 text-md font-semibold'>Iniciar Sessão com Número de Telefone</h1>
          {enterTel ? (
            <div>
              <form>
                <input type='text' className='p-2 border-2' ref={num_tel} />
                <button id='sign-in-button' className='px-12 py-3 bg-indigo-600 text-white rounded-xl my-4 block mx-auto'>
                  Próximo
                </button>
                <div>{alerta}</div>
              </form>
            </div>
          ) : (
            <div>
              <h1 className='py-5 text-md text-left'>Introduzir código enviado.</h1>
              <form>
                <input
                  ref={input_codigo}
                  type='number'
                  pattern='[0-9]*'
                  maxLength={6}
                  className='mx-1 py-2 font-semibold text-xl tracking-super text-center'
                  onChange={(e) => {
                    if (e.target.value.length == 6) confimarCodigo(e.target.value); //limits to 6 digit entry
                  }}
                />
                <div>{alerta}</div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
