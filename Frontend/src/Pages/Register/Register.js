import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import { Link } from 'react-router-dom'
// import { useHistory } from 'react-router-dom'

function Register () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [register, setRegister] = useState('')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  //   const history = useHistory()
  const BASE_URL = localStorage.getItem('BASE_URL')

  const handleRegistration = async () => {
    setErrors({}) // Reset errors before validation
    console.log(BASE_URL)
    // Validate that all three fields are filled
    if (!email || !password || !register) {
      setErrors(prevErrors => ({
        ...prevErrors,
        allFields: 'All fields are required'
      }))
      return
    }

    // Validate password format
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!password.match(passwordRegex)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        password:
          'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one special character (@, $, !, %, *, ?, &).'
      }))
      return
    }

    // Implement registration logic here
    console.log('Registration data:', { email, password, register })

    const payload = {
      email: email,
      password: password,
      name: register
    }
    const response = await fetch(BASE_URL + '/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    const jsonData = await response.json() // Parse the response as JSON
    console.log(jsonData.body)

    if (jsonData.statusCode === 200) {
      alert('Successfully registered')
      navigate('/')
    }

    // After successful registration, redirect to the login page
    // history.push('/login-step1')
  }

  return (
    <div className='container'>
      <div className='row justify-content-center mt-5'>
        <div className='col-md-5'>
          <div className='card p-5 shadow '>
            <div>
              <h2 className='mb-4 text-center'>Register</h2>
              {errors.allFields && (
                <div className='alert alert-danger' role='alert'>
                  {errors.allFields}
                </div>
              )}
              <div className='form-group mx-5'>
                <label>Email</label>
                <input
                  type='email'
                  className='form-control mb-3'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder='Enter your email'
                  onBlur={() => {
                    if (!email) {
                      setErrors(prevErrors => ({
                        ...prevErrors,
                        email: 'Email is required'
                      }))
                    } else {
                      setErrors(prevErrors => ({
                        ...prevErrors,
                        email: undefined
                      }))
                    }
                  }}
                />
                {errors.email && (
                  <small className='text-danger'>{errors.email}</small>
                )}
              </div>
              <div className='form-group mx-5'>
                <label>Password</label>
                <input
                  type='password'
                  className='form-control mb-3'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder='Enter your password'
                  onBlur={() => {
                    if (!password) {
                      setErrors(prevErrors => ({
                        ...prevErrors,
                        password: 'Password is required'
                      }))
                    } else {
                      setErrors(prevErrors => ({
                        ...prevErrors,
                        password: undefined
                      }))
                    }
                  }}
                />
                {errors.password && (
                  <small className='text-danger'>{errors.password}</small>
                )}
              </div>
              <div className='form-group mx-5'>
                <label>Name</label>
                <input
                  type='text'
                  className='form-control mb-3'
                  value={register}
                  onChange={e => setRegister(e.target.value)}
                  placeholder='Enter your name'
                  onBlur={() => {
                    if (!register) {
                      setErrors(prevErrors => ({
                        ...prevErrors,
                        register: 'Name is required'
                      }))
                    } else {
                      setErrors(prevErrors => ({
                        ...prevErrors,
                        register: undefined
                      }))
                    }
                  }}
                />
                {errors.register && (
                  <small className='text-danger'>{errors.register}</small>
                )}
              </div>
              <div className='text-center'>
                <button
                  className='btn btn-primary'
                  onClick={handleRegistration}
                >
                  Register
                </button>
              </div>
            </div>
            <div className='mt-5'>
              <span>
                Already have an Account?{' '}
                <a href='/' style={{ color: 'blue', textDecoration: 'none' }}>
                  Login
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
