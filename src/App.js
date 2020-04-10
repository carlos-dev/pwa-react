import React, { Component } from "react";
import axios from "axios";

import { Header, Repositories, GlobalStyle } from "./styles";

export class App extends Component {
  state = {
    newRepoInput: "",
    repositories: JSON.parse(localStorage.getItem("repositories")),
  };

  addRepository = async () => {
    const { newRepoInput } = this.state;

    if (!newRepoInput) return;

    const response = await axios.get(
      `https://api.github.com/repos/${newRepoInput}`
    );

    this.setState({
      newRepoInput: "",
      repositories: [...this.state.repositories, response.data],
    });

    localStorage.setItem(
      "repositories",
      JSON.stringify(this.state.repositories)
    );
  };

  render() {
    return (
      <>
        <div className="App">
          <GlobalStyle />
          <Header>
            <input
              placeholder="adicionar repositório"
              onChange={(e) => this.setState({ newRepoInput: e.target.value })}
              value={this.state.newRepoInput}
            />

            <button onClick={this.addRepository}>Adicionar</button>
          </Header>

          <Repositories>
            {this.state.repositories.map((repository) => (
              <li key={repository.id}>
                <img src={repository.owner.avatar_url} />
                <div>
                  <strong>{repository.name}</strong>
                  <p>{repository.description}</p>
                  <a href={repository.html_url}>Acessar</a>
                </div>
              </li>
            ))}
          </Repositories>
        </div>
      </>
    );
  }
}

export default App;
