import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

{
  /* 
    import { Link } from "react-router-dom";
        Allows us to go to other pages without refreshing the page
    Keyword "flex" gives us FlexBox properties
    FlexBox: CSS Layout that makes it easier to design flexible responsive web designs. It allows for 
                efficient arrangement of elements across different screen sizes
    <span>: An HTML element used to group or style parts of a text within a document without introducing
                any structural changes
            - It allows us to style specific parts of text within a block cof content
        
*/
}

export default function Header() {
  const {currentUser} = useSelector(state => state.user)
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Sahand</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          <Link to="/profile">
          {currentUser ? (
            <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt="profile" />
          ): (
          <li className="text-slate-700 hover:underline"> Sign in </li>
          )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
