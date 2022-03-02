import { NavLink } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { useForm } from "react-hook-form";


export default function SignUP() {
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
        mutation signup {
          signup(
            input: {
              name: "${data.name}"
              email: "${data.email}"
              password: "${data.password}"
            }
          ) {
            message
            token
            success
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
          Cookies.set('token', res.data.data.signup.token)
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
          <h1>Join Us</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="input_box">
              <div>
                <label htmlFor="full-name" className="form-label">
                  Full Name
                </label>
              </div>
              <div>
                <input
                  {...register('name', { required: true })}
                  type="text"
                  className="input-field"
                />
              </div>
              {errors.name && errors.name.type === 'required' && (
                <p className="error-message">
                  Please Enter Your Name!
                </p>
              )}
            </div>
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
            <button type="submit" className="button">Sign Up</button>
            {message &&
              <p className="error-message">{message}</p>
            }
          </form>
          <NavLink to="/login" className="SignUP">
            Already Have an Account?
          </NavLink>
        </div>
      </div>
    </div>
  );
}
