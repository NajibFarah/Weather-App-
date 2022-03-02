import "../../App.css";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { useForm } from "react-hook-form";

export default function Login(props) {
  //Success For SignUp
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null);
  //React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();
  //Navigation
  let navigate = useNavigate();
  //OnSubmit Handler
  const onSubmit = async (data, e) => {
    await axios.post("http://localhost:3001/graphql", {
      query: `
      mutation login {
        login(input: {
          email: "${data.email}"
          password: "${data.password}"
        }){
          message
          success
          token
          expiresIn
        }
      }
      `
    })
      .then(res => {
        if (res.data.errors) {
          setMessage(res.data.errors[0].message)
          setSuccess(false)
        } else {
          navigate("/")
          Cookies.set('token', res.data.data.login.token)
          setSuccess(false)
        }
      })
      .catch(err => {
        setMessage("Something went wrong!")
        setSuccess(false)
      })
  }
  return (
    <div className="container-box">
      <div className="subContainer">
        <div className="login-box">
          <h1>Login</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div>
                <label htmlFor="email" className="form-label">
                  email
                </label>
              </div>
              <div>
                <input
                  {...register(
                    'email',
                    {
                      required: 'Please enter an email addreess!',
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: 'The email you enter is invalid email!',
                      },
                    },
                    { required: true }
                  )}
                  type="email"
                  className="input-field"
                />
              </div>
              {errors.email && (
                <p className="error-message">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <div>
                <label htmlFor="Password" className="form-label">
                  Password
                </label>
              </div>
              <div>
                <input
                  {...register('password', { required: true })}
                  type="password"
                  placeholder="password"
                  className="input-field"
                />
              </div>
              {errors.password && errors.password.type === 'required' && (
                <p className="error-message">
                  Please enter a password!
                </p>
              )}
            </div>
            <button type="submit" className="button">Login</button>
            {message &&
              <p className="error-message">{message}</p>
            }
          </form>
          <NavLink to="/SignUP" className="SignUP">
            New User?
          </NavLink>
        </div>
      </div>
    </div>
  );
}
