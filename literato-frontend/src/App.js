import React, { Component } from 'react'
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import './App.css'
import Login from './components/login'
import Signup from './components/signup'
import Header from './components/dashboard/header'
import Sidebar from './components/dashboard/sidebar'
import Profile from './components/dashboard/profile'
import Pending from './components/dashboard/pending'
import MakeTrades from './components/dashboard/make-trades'
import UserBookList from './components/user-book-list'
import { handleCheckLogin, handleUserLogin, handleNewUser, handleUserLogout } from './actions/UserActions'
import Dashboard from './components/dashboard/dashboard'

const mapComponentToProps = store => {
  return {
    user: store.user.currentUser,
    userError: store.user.error,
    logInUserSuccess: store.user.logInUserSuccess,
    newUserSuccess: store.user.newUserSuccess,
    books: store.books.books,
    delete: store.books.deleteBookSuccess,
    userBooks: store.books.userBooks,
    currentRequest: store.user.currentRequest,
    user1Books: store.books.user1Books,
    tradeSuccess: store.books.tradeSuccess,
    successMessage: store.books.successMessage,
    loading: store.user.loading,
  }
}

var apiUrl
if (process.env.NODE_ENV === 'production') {
  apiUrl = ''
} else {
  apiUrl = 'http://localhost:3001'
}

export default connect(mapComponentToProps)(
  class App extends Component {
    constructor(props) {
      super(props)
      this.state = {
        apiUrl: apiUrl,
        newBookSuccess: false,
      }
    }

    componentWillMount() {
      this.props.dispatch(handleCheckLogin(this.state.apiUrl))
    }

    handleUserLogin(params) {
      this.props.dispatch(handleUserLogin(this.state.apiUrl, params))
    }

    handleNewUser(params) {
      this.props.dispatch(handleNewUser(this.state.apiUrl, params))
    }

    handleLogout() {
      this.props.dispatch(handleUserLogout())
    }

    render() {
      return (
        <Router>
          <div className="app">
            <Route
              exact
              path="/"
              render={props => (
                <div>
                  <Header />
                  <div className="forms">
                    <Login onSubmit={this.handleUserLogin.bind(this)} />
                    {this.props.user && <Redirect to="/profile" />}
                  </div>
                </div>
              )}
            />
            <Route
              exact
              path="/profile"
              render={props => (
                <div>
                  <Profile
                    onSubmit={this.handleLogout.bind(this)}
                    user={this.props.user}
                    userBooks={this.props.userBooks}
                    dispatch={this.props.dispatch}
                  />
                  {!this.props.user && !this.props.loading && <Redirect to="/login" />}
                </div>
              )}
            />
            <Route
              exact
              path="/dashboard"
              render={props => (
                <div>
                  <Dashboard onSubmit={this.handleLogout.bind(this)} successMessage={this.props.successMessage} />
                  {!this.props.user && !this.props.loading && <Redirect to="/login" />}
                </div>
              )}
            />
            <Route
              exact
              path="/make-trades"
              render={props => (
                <div>
                  <MakeTrades onSubmit={this.handleLogout.bind(this)} />
                  {!this.props.user && !this.props.loading && <Redirect to="/login" />}
                </div>
              )}
            />
            <Route
              exact
              path="/current-request"
              render={props => (
                <div>
                  {!this.props.user && !this.props.loading && this.props.currentRequest && <Redirect to="/dashboard" />}
                  <div>
                    <Header />
                    <UserBookList
                      currentRequest={this.props.currentRequest}
                      user={this.props.currentRequest.user1}
                      userBooks={this.props.user1Books}
                      successMessage={this.props.successMessage}
                      dispatch={this.props.dispatch}
                    />
                    {!this.props.user && !this.props.loading && <Redirect to="/login" />}
                    <Sidebar />
                  </div>
                </div>
              )}
            />
            <Route
              exact
              path="/pending"
              render={props => (
                <div>
                  <Pending onSubmit={this.handleLogout.bind(this)} />
                  {!this.props.user && !this.props.loading && <Redirect to="/login" />}
                </div>
              )}
            />
            <Route
              exact
              path="/signup"
              render={props => (
                <div>
                  <Header />
                  <div className="forms">
                    <Signup onSubmit={this.handleNewUser.bind(this)} />
                    {this.props.newUserSuccess && <Redirect to="/login" />}
                  </div>
                </div>
              )}
            />
            <Route
              exact
              path="/login"
              render={props => (
                <div>
                  <Header />
                  <div className="forms">
                    <Login onSubmit={this.handleUserLogin.bind(this)} />
                    {this.props.logInUserSuccess && <Redirect to="/profile" />}
                  </div>
                </div>
              )}
            />
          </div>
        </Router>
      )
    }
  },
)
