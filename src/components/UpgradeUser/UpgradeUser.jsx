import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function UpgradeUser() {
  const [searchTerm, setSearchTerm] = useState('');
  const searchResults = useSelector((state) => state.searchedUser);

  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch({ type: 'USER_SEARCH', payload: searchTerm });
  };
  return (
    <div className="top-margin">
      <form onSubmit={handleSubmit}>
        <p>UPGRADE USER:</p>
        <label htmlFor="search">Search For User:</label>
        <input
          onChange={(event) => setSearchTerm(event.target.value)}
          value={searchTerm}
          type="text"
        />
        <button type="submit">Search</button>
      </form>
      <p>Results:</p>
      {searchResults.map((user) => {
        return (
          <ul>
            <li>
              <div className="li-with-button">
                <p>
                  {user.username} | {user.first_name} {user.last_name}
                </p>
                <button>Grant Access</button>
              </div>
            </li>
          </ul>
        );
      })}
    </div>
  );
}