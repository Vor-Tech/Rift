import "../../../assets/stylesheets/friends.scss";
import "../../../assets/stylesheets/main.scss";
import React from 'react';
import { connect } from 'react-redux';

class FriendsHeader extends React.Component {
  render() {
    return (
      <header className="chat-header">
        <ul className="friends-button-container">
          <div className={this.props.tab === 'all' ? "friends-header-button-active" : "friends-header-button"}
            onClick={() => this.props.changeTab('all')}
          >All</div>
          <div className={this.props.tab === 'online' ? "friends-header-button-active" : "friends-header-button"}
            onClick={() => this.props.changeTab('online')}
          >Online</div>
          <div className={this.props.tab === 'pending' ? "friends-header-button-active" : "friends-header-button"}
            onClick={() => this.props.changeTab('pending')}
          >Pending
          {this.props.requestCount ? <div className="friends-request-header-counter">{this.props.requestCount}</div> : null}
          </div>
        </ul>
      </header>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const incomingRequests = Object.values(state.entities.friendRequests).filter((request) => {
    return request.friend_id === state.session.id;
  }).length;

  return {
    requestCount: incomingRequests,
  };
};

export default connect(mapStateToProps)(FriendsHeader);