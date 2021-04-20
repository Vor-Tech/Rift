import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { joinServer, fetchServers } from '../../../actions/server_actions';
import SearchServerItem from './search_server_item';

const SearchServersForm = (props) => {
  const [name, setName] = useState('');
  const [servers, setServers] = useState([]);
  const searchInput = React.createRef();

  useEffect(() => {
    props.fetchServers();
    searchInput.current.focus();
  });

  const update = (e) => {
    const name = e.currentTarget.value;
    let servers;

    if (name) {
      setServers(props.servers.filter(server => {
        return server.name.match(new RegExp(`^.*${name}.*$`, 'i'));
      }));
    } else {
      setServers([]);
    }
  }

  let servers;
  if (state.servers.length === 0 && state.name) {
    servers = <div className="server-search-empty">{`No servers match "${this.state.name}"`}</div>;
  } else if (this.state.servers.length === 0 && !state.name) {
    servers = <div className="server-search-pic"></div>;
  } else {
    servers = state.servers.map((server, idx) => {
      return <SearchServerItem
        server={server}
        key={idx}
        closeModal={props.closeModal}
        joinServer={props.joinServer}
        currentUserId={props.currentUserId}
      />;
    });
  }

  return (
    <section className="create-channel-form" onSubmit={handleSubmit}>
      <header>
        <h4 style={{ marginBottom: '6px' }}>Server Discovery</h4>
        <input type="text"
          placeholder={`Try searching for a server like "westeros"`}
          value={this.state.name}
          onChange={this.update}
          className='session-input'
          ref={this.searchInput}
          id="search-input"
          autoComplete="off"
        />
      </header>
      <main className="search-results">
        <ul>
          {servers}
        </ul>
      </main>
      <div className="create-channel-form-bottom" id="search-bottom">
        <button type="button" className="create-channel-cancel" onClick={props.closeModal}>Cancel</button>
      </div>
    </section >
  )
}

// const mapStateToProps = state => { //! needs to be converted
//   const currentUserId = state.session.id

//   // const currentUserServers = state.entities.users[currentUserId].servers;
//   // const servers = Object.values(state.entities.servers).filter(server => {
//   //   return !currentUserServers.includes(server.id);
//   // });

//   const servers = Object.values(state.entities.servers)

//   return {
//     servers,
//     currentUserId,
//   }
// }

const mapDispatchToProps = dispatch => { //? should be converted
  return {
    joinServer: (server, userId) => dispatch(joinServer(server, userId)),
    fetchServers: (server, userId) => dispatch(fetchServers(server, userId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchServersForm);