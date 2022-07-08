import { useState } from "react";
import { userCollectionRef } from "../../../lib/firebase";
import { FBAddDoc, FBWhere } from "../../../lib/firebaseActions";
import { showErrorsToast, showSuccessToast } from "../../../utils/Toast";
import { v4 as uuidv4 } from "uuid";
import { Form } from "../elements/Form";
import clsx from "clsx";
import { setLocalStorage } from "../../../lib/localStorage";
import { P } from "../elements/Text";
import { ArrowLeftIcon } from "@heroicons/react/outline";

export const Auth = () => {
  const handleLogin = async ({ email, password }) => {
    const data = await FBWhere({
      collectionRef: userCollectionRef,
      fieldName: "email",
      fieldValue: email,
    });

    if (data.length !== 0) {
      if (data[0].password === password) {
        setLocalStorage("token", data[0].id);
        showSuccessToast({ title: "Login Successfully." });
        setTimeout(() => window.location.reload(), 1500);
        return;
      }
      showErrorsToast({ title: "Invalid credentials" });
      return;
    }
    showErrorsToast({ title: "Email doesn't exist" });
  };

  const handleSignUp = async ({ name, email, password }) => {
    const data = await FBWhere({
      collectionRef: userCollectionRef,
      fieldName: "email",
      fieldValue: email,
    });

    if (data.length === 0) {
      await FBAddDoc(
        {
          uid: uuidv4(),
          name,
          email,
          password,
          urls: [],
          todos: [],
          userImage: `https://avatars.dicebear.com/api/miniavs/${name}.svg`,
        },
        userCollectionRef
      );

      const data = await FBWhere({
        collectionRef: userCollectionRef,
        fieldName: "email",
        fieldValue: email,
      });

      setLocalStorage("token", data[0].id);
      showSuccessToast({ title: "Account Created Successfully" });
      setTimeout(() => window.location.reload(), 2500);
      return;
    }
    showErrorsToast({ title: "User already exist" });
  };

  const login = {
    input: [
      {
        name: "email",
        type: "email",
        placeholder: "Enter your Email",
      },
      {
        name: "password",
        type: "password",
        placeholder: "Enter your Password",
      },
    ],
    button: {
      text: "Login",
      type: "submit",
    },
    form: {
      name: "login",
      onSubmit: handleLogin,
    },
  };

  const signUp = {
    input: [
      {
        name: "email",
        type: "email",
        placeholder: "Enter your Email",
      },
      {
        name: "name",
        type: "text",
        placeholder: "Enter your Name",
      },
      {
        name: "password",
        type: "password",
        placeholder: "Enter your Password",
      },
    ],
    button: {
      text: "SignUp",
      type: "submit",
    },
    form: {
      name: "signUp",
      onSubmit: handleSignUp,
    },
  };

  const [loginOrSignup, setLoginOrSignup] = useState(login);

  return (
    <div className="w-full pt-40 flex flex-col items-center gap-10">
      <div className="fixed top-3 left-10 flex flex-col gap-2 px-2">
        <P className="flex gap-2">
          <ArrowLeftIcon className="text-white w-5 h-5" /> Select your storage
          option.
        </P>
        <span className="text-red-500">
          Database needs login for storing your data, but takes little time to
          load your data. Whereas Local storage will load faster, but there is
          no backup for your data.
        </span>
      </div>
      <div className="text-white flex gap-5 flex-wrap">
        <button
          className={clsx(
            loginOrSignup.form.name === "login" &&
              "bg-black rounded-md font-semibold",
            "py-1 px-2"
          )}
          onClick={() => setLoginOrSignup(login)}
        >
          Login
        </button>
        <button
          className={clsx(
            loginOrSignup.form.name === "signUp" &&
              "bg-black rounded-md font-semibold",
            "py-1 px-2"
          )}
          onClick={() => setLoginOrSignup(signUp)}
        >
          SignUp
        </button>
      </div>

      <div className="w-4/5 flex flex-col justify-center items-center">
        {loginOrSignup && (
          <Form
            onSubmit={loginOrSignup.form.onSubmit}
            inputFields={loginOrSignup.input}
            buttonText={loginOrSignup.button.text}
            initialValues={{ name: "", email: "", password: "" }}
          />
        )}
      </div>
    </div>
  );
};
