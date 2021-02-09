import React, { useState } from 'react';

function App() {
  const [isUserExists, setIsUserExists] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [userName, setUserName] = useState('');
  const [repos, setRepos] = useState([]);

  const handleSubmit = e => {
    e.preventDefault();

    fetch(`https://api.github.com/users/${inputValue}`)
    .then(res => {
      if (res.status == 404) {
        setIsUserExists(false);
        setUserName(inputValue);
        setRepos([]);
      }
      else {
        setIsUserExists(true);
        setUserName(inputValue);
        getRepos(inputValue);
      }
    })

    setInputValue('');
  }

  const getRepos = user => {
    fetch(`https://api.github.com/users/${user}/repos`)
    .then(res => res.json())
    .then(data => {console.log(data); return setRepos(data)});
  }

  const handleClick = repoName => {
    fetch(`https://api.github.com/repos/${userName}/${repoName}/commits`)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0)
        console.log(data.map(obj => obj.committer.login));
      else
        console.log(data);
    });
  }

  return (
    <div className="App">
      <div className="container">
        <form className="d-flex flex-column align-items-center" onSubmit={handleSubmit}>
          <input className="form-control shadow-sm p-3 mb-3" type="text" placeholder="Search a user" onChange={e => setInputValue(e.target.value)} value={inputValue} />
          <small className="text-danger" hidden={isUserExists}>`{userName}` is not a user of github :(</small>
        </form>
        <div hidden={!isUserExists}>
          <ul className="list-group mx-auto mt-4">
            {repos.map(repo => {
              return (
                <li className="list-group-item" key={repo.id} onClick={() => handleClick(repo.name)}>
                  <h5>{repo.name}</h5>
                  <small className="text-grey">{repo.created_at}</small>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
