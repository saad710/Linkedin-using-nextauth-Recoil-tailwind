import React from "react";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";


import { signIn } from "next-auth/react";

import { useForm } from "react-hook-form";

const LoginModal = (props) => {
  const { register, handleSubmit,reset } = useForm();
  const { open, setOpen, providers } = props;
  const [loginField, setLoginField] = useState(true);
  const [successMsg,setSuccessMsg] = useState("")

  const handleLoginCheck = () => {
      setLoginField(true)
  }
  const handleRegisterCheck = () => {
      setLoginField(false)
  }
  const onSubmit = async (data, provider) => {
    console.log(provider);
    console.log(data);
    loginField ? handleLoginSubmit(data,provider) : handleRegisterSubmit(data)
  };

  const handleLoginSubmit = (data,provider) => {
    async function validUserData() {
        try {
          let response = await fetch(
            "http://localhost:3000/api/validate/ValidateUser",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: data.email,
                password: data.password,
              }),
            }
          );
          console.log(response);
          let user = await response.json();
          console.log(user);
          if (response.ok) {
            signIn(provider.id, {
              email: user.email,
              username: user.name,
              id: user.id,
              callbackUrl: "/",
            });
          }
        } catch (err) {
          // catches errors both in fetch and response.json
          alert(err);
          console.log(err);
        }
      }
      validUserData();

  } 
  const handleRegisterSubmit = (data) => {
        console.log(data)
        async function registerUserData() {
            try {
              let response = await fetch(
                "http://localhost:3000//api/register/RegisterUser",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    username: data.username,
                  }),
                }
              );
              console.log(response);
              let successData = await response.json();
              console.log(successData);
              setSuccessMsg(successData.status)
          
            } catch (err) {
              // catches errors both in fetch and response.json
              alert(err);
              console.log(err);
            }
          }
          registerUserData();
          reset({username:"",email:"",password:""})
        
  }


  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden "
        onClose={setOpen}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="pointer-events-auto w-screen max-w-md">
                <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl bg-indigo-100">
                  <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        {" "}
                        Sign In{" "}
                      </Dialog.Title>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          {/* <XIcon className="h-6 w-6" aria-hidden="true" /> */}
                        </button>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="flow-root">
                        {/* <ul role="list" className="-my-6 divide-y divide-gray-200">
                          
                        </ul> */}
                        {Object.values(providers).map((provider) => (
                          <div key={provider.name}>
                            <div className="pl-4 ">
                              {provider.name === "Google" && (
                                <div className="w-full max-w-xs text-center">
                                  <button
                                    className=" text-blue-700 font-semibold rounded-full border border-blue-700 px-5 py-1.5 transition-all hover:border-2 mr-3"
                                    onClick={() =>
                                      signIn(provider.id, { callbackUrl: "/" })
                                    }
                                  >
                                    {`SignIn with ${provider.id}`}
                                  </button>
                                </div>
                              )}
                              {provider.name === "Credentials" && (
                                /* <form onSubmit={(e)=>{
                 e.preventDefault()
                              signIn(provider.id, {
                      email: "saad@gmail.com",
                      username: "saad",
                      id: "462347",
                      callbackUrl: "/"}
                      )}
               }>
               <button 
                type="submit"
         
                >Sign in with credentials</button>
               </form> */
                                <div className="w-full max-w-xs mt-3">
                                  <div className="flex">
                                    <div className="flex-none w-30 ...">
                                      <label className="inline-flex items-center">
                                        <input
                                            onChange={handleLoginCheck}
                                          type="checkbox"
                                          className="form-checkbox text-indigo-600"
                                          checked={loginField ? true : false}
                                        />
                                        <span className="ml-2">Login</span>
                                      </label>
                                    </div>
                                    <div className="flex-initial w-30 ml-2 ...">
                                      <label className="inline-flex items-center">
                                        <input
                                        onChange={handleRegisterCheck}
                                          type="checkbox"
                                          className="form-checkbox text-indigo-600"
                                          checked={!loginField ? true : false}
                                        />
                                        <span className="ml-2">Register</span>
                                      </label>
                                    </div>
                                  </div>

                                  <form
                                    className="bg-white rounded px-8 pt-6 pb-8 mb-4 bg-indigo-100"
                                    onSubmit={handleSubmit((data) =>
                                      onSubmit(data, provider)
                                    )}
                                  >
                                 {
                                     !loginField &&
                                     <input
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      placeholder="username"
                                      required
                                      type="text"
                                      name="username"
                                      {...register("username")}
                                    />
                                 }
                                    <input
                                      className="shadow appearance-none border rounded w-full py-2 px-3 mt-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      placeholder="email"
                                      required
                                      type="text"
                                      name="email"
                                      {...register("email")}
                                    />
                                    <input
                                      className="shadow appearance-none border rounded w-full py-2 px-3 mt-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      placeholder="password"
                                      required
                                      type="password"
                                      name="password"
                                      {...register("password")}
                                    />
                                    <button
                                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded focus:outline-none focus:shadow-outline"
                                      type="submit"
                                    >
                                      Submit
                                    </button>
                                  </form>
                                  {successMsg !== "" ? <p className="text-green-800 text-center">{successMsg}</p> : ""}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default LoginModal;
