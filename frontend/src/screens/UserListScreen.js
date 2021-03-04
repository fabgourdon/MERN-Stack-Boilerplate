import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  FaCheckCircle,
  FaEdit,
  FaPlus,
  FaTimesCircle,
  FaTrash,
} from 'react-icons/fa'

import {
  listUsers,
  deleteUser,
  updateUser,
  registerUser,
  alertDeleteUserReset,
  alertListUserReset,
  alertUpdateUserReset,
} from '../redux/users/usersSlice'

import Pagination from '../components/Pagination'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../components/Confirm'

const UserListScreen = () => {
  const [id, setId] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [message, setMessage] = useState('')
  const [edit, setEdit] = useState(false)

  const dispatch = useDispatch()

  const userList = useSelector((state) => state.userList)
  const { users, loadingUsers, errorUsers } = userList

  const userUpdate = useSelector((state) => state.userUpdate)
  const { loadingUpdate, errorUpdate, successUpdate } = userUpdate

  const userDelete = useSelector((state) => state.userDelete)
  const { successDelete, errorDelete } = userDelete

  const userRegister = useSelector((state) => state.userRegister)
  const { loadingRegister, errorRegister, successRegister } = userRegister

  const formCleanHandler = () => {
    setName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setEdit(false)
  }

  useEffect(() => {
    if (
      errorDelete ||
      errorRegister ||
      errorUsers ||
      errorUpdate ||
      successDelete ||
      successRegister ||
      successUpdate
    ) {
      setTimeout(() => {
        dispatch(alertDeleteUserReset())
        dispatch(alertListUserReset())
        dispatch(alertUpdateUserReset())
        dispatch(alertListUserReset())
      }, 5000)
    }
  }, [
    errorDelete,
    errorRegister,
    errorUsers,
    errorUpdate,
    successDelete,
    successRegister,
    successUpdate,
    dispatch,
  ])

  useEffect(() => {
    dispatch(listUsers())
    if (successUpdate || successRegister) {
      formCleanHandler()
    }
  }, [dispatch, successDelete, successUpdate, successRegister])

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => dispatch(deleteUser(id))))
  }

  const submitHandler = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage('Password do not match')
    } else {
      edit
        ? dispatch(updateUser({ _id: id, name, email, password, isAdmin }))
        : dispatch(registerUser({ name, email, password }))
    }
  }

  const editHandler = (user) => {
    setName(user.name)
    setEmail(user.email)
    setIsAdmin(user.isAdmin)
    setPassword('')
    setId(user._id)
    setEdit(true)
  }

  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 5
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = users && users.slice(indexOfFirstItem, indexOfLastItem)
  const totalItems = users && Math.ceil(users.length / itemsPerPage)

  return (
    <>
      <div
        className='modal fade'
        id='editUserModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editUserModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h5 className='modal-title' id='editUserModalLabel'>
                Edit User
              </h5>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
                onClick={formCleanHandler}
              ></button>
            </div>
            <div className='modal-body'>
              {message && <Message variant='danger'>{message}</Message>}
              {successUpdate && (
                <Message variant='success'>
                  User has been updated successfully.
                </Message>
              )}
              {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
              {loadingUpdate && <Loader />}
              {successRegister && (
                <Message variant='success'>
                  User has been Created successfully.
                </Message>
              )}
              {errorRegister && (
                <Message variant='danger'>{errorRegister}</Message>
              )}
              {loadingRegister && <Loader />}

              {loadingUsers ? (
                <Loader />
              ) : errorUsers ? (
                <Message variant='danger'>{errorUsers}</Message>
              ) : (
                <form onSubmit={submitHandler}>
                  <div className='form-group'>
                    <label htmlFor='name'>Name</label>
                    <input
                      type='text'
                      placeholder='Enter name'
                      className='form-control'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='email'>Email Address</label>
                    <input
                      type='email'
                      placeholder='Enter email'
                      className='form-control'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='password'>Password</label>
                    <input
                      type='password'
                      placeholder='Enter password'
                      className='form-control'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='confirmPassword'>Confirm Password</label>
                    <input
                      type='password'
                      placeholder='Confirm password'
                      className='form-control'
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <div className='form-group'>
                    <input
                      type='checkbox'
                      id='isAdmin'
                      label='Is Admin'
                      checked={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.checked)}
                    />{' '}
                    <label htmlFor='isAdmin' id='isAdmin'>
                      Admin?
                    </label>
                  </div>

                  <div className='modal-footer'>
                    <button
                      type='button'
                      className='btn btn-secondary btn-sm'
                      data-bs-dismiss='modal'
                      onClick={formCleanHandler}
                    >
                      Close
                    </button>
                    <button type='submit' className='btn btn-primary btn-sm'>
                      Update
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='d-flex justify-content-between align-items-center'>
        <h1>Users</h1>
        <button
          className='btn btn-light btn-sm'
          data-bs-toggle='modal'
          data-bs-target='#editUserModal'
        >
          <FaPlus /> REGISTER NEW USER
        </button>
      </div>

      {successDelete && (
        <Message variant='success'>User has been deleted successfully.</Message>
      )}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {loadingUsers ? (
        <Loader />
      ) : errorUsers ? (
        <Message variant='danger'>{errorUsers}</Message>
      ) : (
        <>
          <div className='table-responsive'>
            <table className='table table-sm hover bordered striped caption-top'>
              <caption>{users && users.length} records were found</caption>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>ADMIN</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {currentItems &&
                  currentItems.map((user) => (
                    <tr key={user._id}>
                      <td>{user._id}</td>
                      <td>{user.name}</td>
                      <td>
                        <a href={`mailto:${user.email}`}>{user.email}</a>
                      </td>
                      <td>
                        {user.isAdmin ? (
                          <FaCheckCircle className='text-success' />
                        ) : (
                          <FaTimesCircle className='text-danger' />
                        )}
                      </td>
                      <td className='btn-group'>
                        <button
                          className='btn btn-light btn-sm'
                          onClick={(e) => editHandler(user)}
                          data-bs-toggle='modal'
                          data-bs-target='#editUserModal'
                        >
                          <FaEdit /> Edit
                        </button>

                        <button
                          className='btn btn-danger btn-sm'
                          onClick={() => deleteHandler(user._id)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className='d-flex justify-content-center'>
            <Pagination
              setCurrentPage={setCurrentPage}
              totalItems={totalItems}
              arrayLength={users && users.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        </>
      )}
    </>
  )
}

export default UserListScreen
