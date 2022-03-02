import { NavLink } from "react-router-dom";
import Cookies from 'js-cookie';

export default function Header() {
  const token = Cookies.get('token');
  const logoutHandler = () => {
    Cookies.remove('token');
  }
  return (
    <ul className="flex ml-auto w-full font-bold">
      <li className="text-xs text-gray-800 ml-auto mr-6 border-b-2 border-green-400 cursor-pointer">Forecast</li>
      <li className="text-xs text-gray-800 mr-6 alert-notice cursor-pointer border-b-2 hover:border-green-400">Map</li>
      <li className="text-xs text-gray-800 mr-6 cursor-pointer border-b-2 hover:border-green-400">News</li>
      <li className="text-xs text-gray-800 mr-6 cursor-pointer border-b-2 hover:border-green-400">Satellite</li>
      {!token &&
        <li className="text-xs text-gray-800 cursor-pointer border-b-2 hover:border-green-400"><NavLink to="/login">Login</NavLink></li>
      }
      {token &&
        <li className="text-xs text-gray-800 cursor-pointer border-b-2 hover:border-green-400"><NavLink to="/login" onClick={logoutHandler}>Logout</NavLink></li>
      }
    </ul>
  )
}