import React from 'react';
import "../../assets/stylesheets/splash.scss";
import { Link } from 'react-router-dom';

class Splash extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidMount() {
    document.body.style.overflow = "visible";
  }

  handleLogin() {
    this.props.login().then(() => this.props.history.push('/channels/@me'));
  }

  render() {
    return (
      <div className="splash-body">
        <header className="splash-header">
          <nav className="splash-nav">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" className="discorLogo" alt=""></img>
            <ul className="rightNav">
              <li>
                <a href="https://github.com/jeffdeliso" target="_blank">
                  <i className="fab fa-github"></i>
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/jdeliso/" target="_blank">
                  <i className="fab fa-linkedin"></i>
                </a>
              </li>
              <li>
                <a href="https://angel.co/jeffreydeliso" target="_blank">
                  <i className="fab fa-angellist"></i>
                </a>
              </li>
              <li>
                <a href="https://www.jeffdeliso.com" target="_blank">
                  <i className="fas fa-user-circle"></i>
                </a>
              </li>
              <li>
                <Link to="/login" className="openButton">{this.props.currentUserId ? 'Open' : 'Login'}</Link>
              </li>
            </ul>
          </nav>
        </header>

        <section className="splash-main">
          <div className="content ">
            <h1>It's time to ditch Discord.</h1>
            <p>
              All-in-one voice and text chat for gamers that's free, open-source, secure, and works on both your desktop and phone. Stop
              paying
              for TeamSpeak servers and hassling with Skype, and worrying about Discords privacy policies and questionable staff actions. Simplify your life.
            </p>
            <div className="buttons">
              <a href="https://www.github.com/xero-lib" target="_blank" className="open-rift-top">Developers GitHub</a>
            </div>
          </div>

          <div className="images">
            <img src="https://s3.amazonaws.com/discors-dev/Splash/dot.svg" alt="" className="pic dot1"></img>
            <img src="https://s3.amazonaws.com/discors-dev/Splash/dot.svg" alt="" className="pic dot2"></img>
            <img src="https://s3.amazonaws.com/discors-dev/Splash/dot.svg" alt="" className="pic dot3"></img>
            <img src="https://s3.amazonaws.com/discors-dev/Splash/dot.svg" alt="" className="pic dot4"></img>
            <img src="https://s3.amazonaws.com/discors-dev/Splash/x.svg" alt="" className="pic x1"></img>
            <img src="https://s3.amazonaws.com/discors-dev/Splash/x.svg" alt="" className="pic x2"></img>
            <img src="https://s3.amazonaws.com/discors-dev/Splash/circle.svg" alt="" className="pic circle1"></img>
            <img src="https://s3.amazonaws.com/discors-dev/Splash/circle.svg" alt="" className="pic circle2"></img>
            <img src="https://s3.amazonaws.com/discors-dev/Splash/triangle.svg" alt="" className="pic triangle1"></img>
            <img src="https://s3.amazonaws.com/discors-dev/Splash/triangle.svg" alt="" className="pic triangle2"></img>
            <img src="https://s3.amazonaws.com/discors-dev/Splash/square.svg" alt="" className="pic square2"></img>
            <img src="https://s3.amazonaws.com/discors-dev/Splash/square.svg" alt="" className="pic square1"></img>
            <img src="https://s3.amazonaws.com/discors-dev/Splash/floppy.svg" alt="" className="pic floppy"></img>
            <img src="https://s3.amazonaws.com/discors-dev/Splash/bomb.svg" alt="" className="pic bomb"></img>
            <img src="https://s3.amazonaws.com/discors-dev/Splash/question.svg" alt="" className="pic question"></img>
            <img src="https://s3.amazonaws.com/discors-dev/Splash/speaker.svg" alt="" className="pic speaker"></img>
            <img src="https://s3.amazonaws.com/discors-dev/Splash/flask.svg" alt="" className="pic flask"></img>
            <img src="https://s3.amazonaws.com/discors-dev/Splash/computer.svg" alt="" className="pic computer"></img>
            <img src="https://s3.amazonaws.com/discors-dev/Splash/laptop.svg" alt="" className="pic laptop"></img>
            <img src="https://s3.amazonaws.com/discors-dev/Splash/controller.svg" alt="" className="pic controller"></img>
            <img src="https://s3.amazonaws.com/discors-dev/Splash/iphone.svg" alt="" className="pic iphone"></img>
            <img src="https://s3.amazonaws.com/discors-dev/Splash/android.svg" alt="" className="pic android"></img>
            <img src="https://s3.amazonaws.com/discors-dev/Splash/coin.svg" alt="" className="pic coin1"></img>
            <img src="https://s3.amazonaws.com/discors-dev/Splash/coin.svg" alt="" className="pic coin2"></img>
            <img src="https://s3.amazonaws.com/discors-dev/Splash/headphones.svg" alt="" className="pic headphones"></img>
          </div>
        </section>

        <footer className="splash-footer">
          <img src="https://s3.amazonaws.com/discors-dev/Splash/underline.svg" alt="" className="underline"></img>
          <div className="footer-content">
            <div>
              <h2>Ready to try Rift? It's free!</h2>
              <h3>JOIN OVER 0 PLAYERS TODAY</h3>
            </div>
            <Link to="/register" className="open-discors-bottom">{this.props.currentUserId ? 'Open Discors' : 'Sign Up Now'}</Link>
          </div>
        </footer>
      </div>
    )
  }
}

export default Splash;