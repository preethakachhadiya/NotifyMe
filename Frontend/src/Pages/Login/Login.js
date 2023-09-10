import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const BASE_URL = localStorage.getItem('BASE_URL')

  const handleLogin = async () => {
    setErrors({}) // Reset errors before validation
    // Validate that all three fields are filled
    if (!email || !password) {
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
    console.log('Login data:', { email, password })

    const payload = {
      email: email,
      password: password
    }
    const response = await fetch(BASE_URL + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    const jsonData = await response.json() // Parse the response as JSON
    console.log(jsonData.body)

    localStorage.setItem('user', JSON.stringify(jsonData.body))

    if (jsonData.statusCode === 200) {
      alert('Login successful')
      navigate('/events')
    }
  }

  return (
    <div className='container'>
      <div className='row justify-content-center mt-5'>
        <div className='col-md-5'>
          <div className='card p-5 shadow '>
            <div>
              <h2 className='mb-4 text-center'>Login</h2>
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

              <div className='text-center'>
                <button className='btn btn-primary' onClick={handleLogin}>
                  Login
                </button>
              </div>
            </div>
            <div className='mt-5'>
              <span>
                Don't have an Account?{' '}
                <a
                  href='/register'
                  style={{ color: 'blue', textDecoration: 'none' }}
                >
                  Register
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
