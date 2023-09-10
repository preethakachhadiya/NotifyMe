import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import './App.css'
import Login from './Pages/Login/Login'
import Register from './Pages/Register/Register'
import Reminders from './Pages/Reminders/Reminders'
import Events from './Pages/Events/Events'

import AWS from 'aws-sdk'

const awsConfig = {
  region: 'us-east-1',
  accessKeyId: 'ASIAUEHDDYCKTD73FG77',
  secretAccessKey: 'ooDZc83fpT4rnUN5ZXF3GJg62LeENCSS0Oxs/2P7',
  sessionToken:
    'FwoGZXIvYXdzEE4aDEd4wNvsL3JjvuAd1yLAAUSZwyb05YWLYdrqiimmkAMM2o/GnnkGY2Vp3iUw7HgcbevswTlhBobHEJ91BcUz4EMWhaBD3dsCzmPrz9LDKxuRPGIX539YpdpJkzZX909HeMd24aXNxUIecEljTpmt+R8Yam90TjvppalhulGEG7HQzSb4HLp+OuNK+yAfs4xNvu5ANOmVt/ZDgmZc8ePnyHhrVqnhhwTozLok6ApfLhv0r5qOdyQeku7WtiDQaHcAhsf3uBB8xRUXlihPBjgVRSiQ96OmBjItpIunkQYzMLATRXJRVBXuzHbE+XN9tS8yeCKzxGs6V6K8dwYKteZ8Q7ItLQW/'
}

function App () {
  useEffect(() => {
    AWS.config.update(awsConfig)

    const secretsManager = new AWS.SecretsManager()

    const getSecret = async () => {
      try {
        const secretName = 'CloudSecret' // Replace with the name of your secret
        const data = await secretsManager
          .getSecretValue({ SecretId: secretName })
          .promise()
        console.log(JSON.parse(data.SecretString).Deployment)
        let code = JSON.parse(data.SecretString)['Deployment']

        let BASE_URL =
          'https://' + code + '.execute-api.us-east-1.amazonaws.com/dev'

        localStorage.setItem('BASE_URL', BASE_URL)
        setTimeout(() => {}, 500)
      } catch (error) {
        console.error('Error fetching secret:', error)
      }
    }

    getSecret()
  }, [])

  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/events' element={<Events />} />
          <Route path='/reminders/:event_id' element={<Reminders />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
