import { useState } from "react";
import { useCookies } from "react-cookie";

const Auth = () => {
  const [cookies, setCookies, removeCookie] = useCookies(null);
  const [isAuth, setIsAuth] = useState(false);
  const [error, setError] = useState(null);
  const [signUpMode, setSignUpMode] = useState(false);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const submitLogin = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );
    const data = await response.json();
    if (data.detail) {
      setError(data.detail);
    } else {
      setCookies("email", data.email);
      setCookies("token", data.token);
    }
  };

  const submitSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}auth/sign-up`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );
    const data = await response.json();
    if (data.detail) {
      setError(data.detail);
    } else {
      setCookies("email", data.email);
      setCookies("token", data.token);
    }
    console.log(data);
  };

  return (
    <div>
      <form>
        <h2>{isAuth ? "Please log in" : "Please sign up!"}</h2>{" "}
        <input
          type="email"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {signUpMode && (
          <input
            type="password"
            placeholder="confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        {!signUpMode && (
          <button onClick={(e) => submitLogin(e)}>submit login</button>
        )}
        {signUpMode && (
          <button onClick={(e) => submitSignUp(e)}>submit sign up</button>
        )}
        {error && <p>{error}</p>}
      </form>
      <button onClick={() => setSignUpMode(!signUpMode)}>
        {signUpMode && <span>Login page</span>}
        {!signUpMode && <span>Sign Up page</span>}
      </button>
    </div>
  );
};

export default Auth;
