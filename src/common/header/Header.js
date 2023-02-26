import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import Modal from 'react-modal';

// Material ui components.
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';

// Style and Assets of this component.
import logo from '../../assets/logo.svg';
import './Header.css';
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const TabContainer = function (props) {
  return (
    <Typography component="div" style={{ padding: 0, textAlign: 'center' }}>
      {props.children}
    </Typography>
  );
};

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const Header = (props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [username, setUsername] = useState('');
  const [usernameRequired, setUsernameRequired] = useState('invisible');
  const [loginPasswordRequired, setLoginPasswordRequired] =
    useState('invisible');
  const [loginPassword, setLoginPassword] = useState('');
  const [firstnameRequired, setFirstnameRequired] = useState('invisible');
  const [firstname, setFirstname] = useState('');
  const [lastnameRequired, setLastnameRequired] = useState('invisible');
  const [lastname, setLastname] = useState('');
  const [emailRequired, setEmailRequired] = useState('invisible');
  const [email, setEmail] = useState('');
  const [registerpasswordRequired, setRegisterPasswordRequired] =
    useState('invisible');
  const [registerpassword, setRegisterPassword] = useState('');
  const [contactRequired, setContactRequired] = useState('invisible');
  const [contact, setContact] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [loggedIn, setLoggedIn] = useState(
    sessionStorage.getItem('access-token') == null ? false : true
  );
  const [bookShowRequested, setBookShowRequested] = useState(false);

  const history = useHistory();

  // When open a model, update the model status as true.
  const openModalHandler = () => {
    setModalIsOpen(true);
  };

  /**
   * When close a modal, update the model status as false and reset the
   * username, password fields.
   */
  const closeModalHandler = () => {
    setUsername('');
    setLoginPassword('');
    setModalIsOpen(false);
  };

  // Current tab status handler.
  const tabChangeHandler = (event, value) => {
    setValue(value);
  };

  // Login action.
  const loginClickHandler = () => {
    username === ''
      ? setUsernameRequired('visible')
      : setUsernameRequired('invisible');
    loginPassword === ''
      ? setLoginPasswordRequired('visible')
      : setLoginPasswordRequired('invisible');

    if (username && loginPassword) {
      // Add authentication token to the request header.
      const authCredentials = window.btoa(username + ':' + loginPassword);
      const headers = {
        Authorization: `Basic ${authCredentials}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      };

      axios
        .post(`${props.baseUrl}auth/login`, {}, { headers })
        .then((res) => {
          sessionStorage.setItem('uuid', res.data.id);
          sessionStorage.setItem('access-token', res.headers['access-token']);

          // set logged in status
          setLoggedIn(true);

          // close the modal.
          closeModalHandler();

          // if the current page is book show, then navigate to that page.
          if (bookShowRequested) {
            history.push('/bookshow/' + props.id);
            setBookShowRequested(false);
          }
        })
        .catch(function (error) {
          if (error.response) {
            let message = error.response.data.message;
            if (
              message === 'Password match failed' ||
              message === 'Username does not exist' ||
              message === 'User account is LOCKED'
            ) {
              alert(error.response.data.message);
            } else {
              console.log(error.message);
            }
          } else if (error.request) {
            alert(error.request);
          } else {
            alert('Error', error.message);
          }
        });
    } else {
      alert('Please enter valid credentials');
    }
  };

  // update username.
  const inputUsernameChangeHandler = (e) => {
    setUsername(e.target.value);
  };

  // update password
  const inputLoginPasswordChangeHandler = (e) => {
    setLoginPassword(e.target.value);
  };

  // Register
  const registerClickHandler = () => {
    firstname === ''
      ? setFirstnameRequired('visible')
      : setFirstnameRequired('invisible');
    lastname === ''
      ? setLastnameRequired('visible')
      : setLastnameRequired('invisible');
    email === '' ? setEmailRequired('visible') : setEmailRequired('invisible');
    registerpassword === ''
      ? setRegisterPasswordRequired('visible')
      : setRegisterPasswordRequired('invisible');
    contact === ''
      ? setContactRequired('visible')
      : setContactRequired('invisible');

    // Validate
    if (firstname && lastname && email && registerpassword && contact) {
      let dataSignup = {
        email_address: email,
        first_name: firstname,
        last_name: lastname,
        mobile_number: contact,
        password: registerpassword,
      };

      axios.post(props.baseUrl + 'signup', dataSignup).then((res) => {
        setRegistrationSuccess(true);

        // Automatically switch to the login tab.
        setValue(0);
        setFirstname('');
        setLastname('');
        setEmail('');
        setContact('');
        setRegisterPassword('');
        setRegistrationSuccess(false);
      });
    } else {
      alert('Please fill all mandatory fields');
      setRegistrationSuccess(false);
    }
  };

  // Register input handlers.
  const inputFirstnameChangeHandler = (e) => {
    setFirstname(e.target.value);
  };

  const inputLastnameChangeHandler = (e) => {
    setLastname(e.target.value);
  };

  const inputEmailChangeHandler = (e) => {
    setEmail(e.target.value);
  };

  const inputRegisterPasswordChangeHandler = (e) => {
    setRegisterPassword(e.target.value);
  };

  const inputContactChangeHandler = (e) => {
    setContact(e.target.value);
  };

  // Logout handler
  const logoutHandler = (e) => {
    const headers = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Authorization: 'Bearer ' + sessionStorage.getItem('access-token'),
    };
    axios
      .post(
        props.baseUrl + 'auth/logout',
        {},
        {
          headers,
        }
      )
      .then((res) => {
        sessionStorage.removeItem('uuid');
        sessionStorage.removeItem('access-token');
        setLoggedIn(false);
      });
  };

  const guestBookShowHandler = (e) => {
    openModalHandler();
    setBookShowRequested(true);
  };

  return (
    <div>
      <header className="app-header">
        <img src={logo} className="app-logo" alt="Movies App Logo" />
        {!loggedIn ? (
          <div className="login-button">
            <Button
              variant="contained"
              color="default"
              onClick={openModalHandler}
            >
              Login
            </Button>
          </div>
        ) : (
          <div className="login-button">
            <Button variant="contained" color="default" onClick={logoutHandler}>
              Logout
            </Button>
          </div>
        )}

        {props.showBookShowButton === 'true' && !loggedIn ? (
          <div className="book-show-button">
            <Button
              variant="contained"
              color="primary"
              onClick={guestBookShowHandler}
            >
              Book Show
            </Button>
          </div>
        ) : (
          ''
        )}

        {props.showBookShowButton === 'true' && loggedIn ? (
          <div className="book-show-button">
            <Link to={'/bookshow/' + props.id}>
              <Button variant="contained" color="primary">
                Book Show
              </Button>
            </Link>
          </div>
        ) : (
          ''
        )}
      </header>

      {/** The Login/Register Modal*/}
      <Modal
        ariaHideApp={false}
        isOpen={modalIsOpen}
        contentLabel="Login"
        onRequestClose={closeModalHandler}
        style={customStyles}
      >
        <Tabs className="tabs" value={value} onChange={tabChangeHandler}>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {value === 0 && (
          <TabContainer>
            <FormControl required>
              <InputLabel htmlFor="username">Username</InputLabel>
              <Input
                id="username"
                type="text"
                username={username}
                onChange={inputUsernameChangeHandler}
              />
              <FormHelperText className={usernameRequired}>
                <span className="red">required</span>
              </FormHelperText>
            </FormControl>
            <br />
            <br />
            <FormControl required>
              <InputLabel htmlFor="loginPassword">Password</InputLabel>
              <Input
                id="loginPassword"
                type="password"
                loginpassword={loginPassword}
                onChange={inputLoginPasswordChangeHandler}
              />
              <FormHelperText className={loginPasswordRequired}>
                <span className="red">required</span>
              </FormHelperText>
            </FormControl>
            <br />
            <br />
            {loggedIn === true && (
              <FormControl>
                <span className="successText">Login Successful!</span>
              </FormControl>
            )}
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={loginClickHandler}
            >
              LOGIN
            </Button>
          </TabContainer>
        )}

        {value === 1 && (
          <TabContainer>
            <FormControl required>
              <InputLabel htmlFor="firstname">First Name</InputLabel>
              <Input
                id="firstname"
                type="text"
                firstname={firstname}
                onChange={inputFirstnameChangeHandler}
              />
              <FormHelperText className={firstnameRequired}>
                <span className="red">required</span>
              </FormHelperText>
            </FormControl>
            <br />
            <br />
            <FormControl required>
              <InputLabel htmlFor="lastname">Last Name</InputLabel>
              <Input
                id="lastname"
                type="text"
                lastname={lastname}
                onChange={inputLastnameChangeHandler}
              />
              <FormHelperText className={lastnameRequired}>
                <span className="red">required</span>
              </FormHelperText>
            </FormControl>
            <br />
            <br />
            <FormControl required>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                id="email"
                type="email"
                email={email}
                onChange={inputEmailChangeHandler}
              />
              <FormHelperText className={emailRequired}>
                <span className="red">required</span>
              </FormHelperText>
            </FormControl>
            <br />
            <br />
            <FormControl required>
              <InputLabel htmlFor="registerpassword">Password</InputLabel>
              <Input
                id="registerpassword"
                type="password"
                registerpassword={registerpassword}
                onChange={inputRegisterPasswordChangeHandler}
              />
              <FormHelperText className={registerpasswordRequired}>
                <span className="red">required</span>
              </FormHelperText>
            </FormControl>
            <br />
            <br />
            <FormControl required>
              <InputLabel htmlFor="contact">Contact No.</InputLabel>
              <Input
                id="contact"
                type="tel"
                contact={contact}
                onChange={inputContactChangeHandler}
              />
              <FormHelperText className={contactRequired}>
                <span className="red">required</span>
              </FormHelperText>
            </FormControl>
            <br />
            <br />
            {registrationSuccess === true && (
              <FormControl>
                <span className="successText">
                  Registration Successful. Please Login!
                </span>
              </FormControl>
            )}
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={registerClickHandler}
            >
              REGISTER
            </Button>
          </TabContainer>
        )}
      </Modal>
    </div>
  );
};

export default Header;
