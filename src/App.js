import React, { Component } from "react";
import axios from "axios";

import { Header, Repositories, GlobalStyle, Offline } from "./styles";

export class App extends Component {
  state = {
    online: navigator.onLine,
    newRepoInput: "",
    repositories: JSON.parse(localStorage.getItem("repositories")) || [],
  };

  componentDidMount() {
    window.addEventListener("online", this.handleNetworkChange);
    window.addEventListener("offline", this.handleNetworkChange);
  }

  componentWillUnmount() {
    window.removeEventListener("online", this.handleNetworkChange);
    window.removeEventListener("offline", this.handleNetworkChange);
  }

  handleNetworkChange = () => {
    this.setState({ online: navigator.onLine });
  };

  addRepository = async () => {
    const { newRepoInput } = this.state;

    if (!newRepoInput) return;

    if (!this.state.online) {
      alert("Você está offline :/");
    }

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
    console.log(this.state.online);

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

          {!this.state.online && <Offline>Você está offline</Offline>}
        </div>
      </>
    );
  }
}

export default App;
