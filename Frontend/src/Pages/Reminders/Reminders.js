import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useParams, useLocation } from 'react-router-dom'

const Reminders = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [reminders, setReminders] = useState([])
  const [showCreateReminderModal, setShowCreateReminderModal] = useState(false)
  const [showEditReminderModal, setShowEditReminderModal] = useState(false)
  const [noReminders, setNoReminders] = useState(false)
  const [newReminder, SetNewReminder] = useState({
    message: '',
    date: ''
  })
  const [currentReminder, SetCurrentReminder] = useState({
    message: '',
    date: ''
  })

  const event = location.state.event

  const { event_id } = useParams()

  const BASE_URL = localStorage.getItem('BASE_URL')

  const user = JSON.parse(localStorage.getItem('user'))

  console.log('user', user)

  const getReminders = async () => {
    const payload = {
      event_id: event_id,
      email: user.email
    }
    const response = await fetch(BASE_URL + '/get-reminders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    const jsonData = await response.json() // Parse the response as JSON
    console.log(jsonData.body)
    if (jsonData.body.length > 0) {
      setNoReminders(false)
      setReminders(jsonData.body)
    } else {
      setNoReminders(true)
    }
  }

  useEffect(() => {
    console.log('event', location)
    getReminders()
  }, [])

  const getDate = isoDateString => {
    const date = new Date(isoDateString)
    date.setHours(date.getHours() + 3)

    const day = date.getDate()
    const year = date.getFullYear()
    const month = date.toLocaleString('default', { month: 'long' })

    const formattedDate = `${month} ${day}, ${year}`
    console.log(formattedDate)
    return formattedDate
  }

  const openCreateReminderModal = () => {
    setShowCreateReminderModal(true)
  }

  const closeCreateReminderModal = () => {
    SetNewReminder({
      message: '',
      date: ''
    })
    setShowCreateReminderModal(false)
  }

  const openEditReminderModal = reminder => {
    SetCurrentReminder(reminder)
    setShowEditReminderModal(true)
  }

  const closeEditReminderModal = () => {
    SetCurrentReminder({
      message: '',
      date: ''
    })
    setShowEditReminderModal(false)
  }

  // const openEditReminderModal = () => {}

  const handleDeleteEvent = async reminder => {
    console.log('reminder in delete reminder', reminder)
    const payload = {
      reminder_id: reminder.reminder_id,
      event_id: event.event_id,
      email: user.email
    }
    closeCreateReminderModal()
    console.log('payload', payload)
    const response = await fetch(BASE_URL + '/delete-reminder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    const jsonData = await response.json() // Parse the response as JSON
    console.log(jsonData.body)
    if (jsonData.statusCode === 200) {
      getReminders()
      //   getEvents()
      alert('Reminder deleted successfully')
    }
  }

  const handleCreateReminder = async reminder => {
    console.log('newReminder', newReminder)
    const payload = {
      message: newReminder.message,
      date: new Date(newReminder.date).toISOString(),
      email: user.email,
      reminder_id: reminder.reminder_id,
      event_id: event.event_id
    }
    closeCreateReminderModal()
    console.log('payload', payload)
    const response = await fetch(BASE_URL + '/add-reminder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    const jsonData = await response.json() // Parse the response as JSON
    console.log(jsonData.body)
    if (jsonData.statusCode === 200) {
      getReminders()
      //   getEvents()
      alert('Reminder added successfully')
    }
  }

  const handleEditEvent = async reminder => {
    console.log('currentReminder', currentReminder)
    const payload = {
      message: currentReminder.message,
      date: new Date(currentReminder.date).toISOString(),
      email: user.email,
      reminder_id: currentReminder.reminder_id
    }
    closeEditReminderModal()
    console.log('payload', payload)
    const response = await fetch(BASE_URL + '/update-reminder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    const jsonData = await response.json() // Parse the response as JSON
    console.log(jsonData.body)
    if (jsonData.statusCode === 200) {
      getReminders()
      //   getEvents()
      alert('Reminder updated successfully')
    }
  }

  const handleLogout = async () => {
    // const BASE_URL = localStorage.getItem('BASE_URL')
    // const user = JSON.parse(localStorage.getItem('user'))

    const payload = {
      user_id: user.user_id
    }
    const response = await fetch(BASE_URL + '/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    const jsonData = await response.json() // Parse the response as JSON
    console.log(jsonData.body)
    if (jsonData.statusCode === 200) {
      localStorage.removeItem('user')
      navigate('/')
    }
  }

  return (
    <div>
      {/* CREATE MODAL */}
      <Modal
        show={showCreateReminderModal}
        onHide={closeCreateReminderModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Reminder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Event name input */}
            <Form.Group>
              <Form.Label>Reminder Message</Form.Label>
              <Form.Control
                type='text'
                value={newReminder.message}
                onChange={e =>
                  SetNewReminder({ ...newReminder, message: e.target.value })
                }
                placeholder='Enter reminder message'
              />
            </Form.Group>
            {/* Event date input */}
            <Form.Group className='mt-4'>
              <Form.Label>Reminder Date</Form.Label>
              <Form.Control
                type='date'
                value={newReminder.date}
                onChange={e =>
                  SetNewReminder({ ...newReminder, date: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={closeCreateReminderModal}>
            Close
          </Button>
          <Button
            variant='primary'
            onClick={handleCreateReminder}
            disabled={!newReminder.message || !newReminder.date}
          >
            Add Reminder
          </Button>
        </Modal.Footer>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        show={showEditReminderModal}
        onHide={closeEditReminderModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Reminder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Event name input */}
            <Form.Group>
              <Form.Label>Reminder Message</Form.Label>
              <Form.Control
                type='text'
                value={currentReminder.message}
                onChange={e =>
                  SetCurrentReminder({
                    ...currentReminder,
                    message: e.target.value
                  })
                }
                placeholder='Enter reminder message'
              />
            </Form.Group>
            {/* Event date input */}
            <Form.Group className='mt-4'>
              <Form.Label>Reminder Date</Form.Label>
              <Form.Control
                type='date'
                value={currentReminder.date.slice(0, 10)}
                onChange={e =>
                  SetCurrentReminder({
                    ...currentReminder,
                    date: e.target.value
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={closeEditReminderModal}>
            Close
          </Button>
          <Button
            variant='primary'
            onClick={handleEditEvent}
            disabled={!currentReminder.message || !currentReminder.date}
          >
            Edit Reminder
          </Button>
        </Modal.Footer>
      </Modal>
      <nav class='navbar navbar-dark bg-primary'>
        <a class='navbar-brand mx-5' href='/events'>
          ReminderApp
        </a>

        <div className='d-flex mx-5 nav-item justify-content-between'>
          <a class='nav-link align-self-center' href='/events'>
            <strong>My Events</strong>
          </a>
          <button
            class='btn btn-outline-light ms-4 my-2 my-sm-0'
            onClick={handleLogout}
          >
            <strong>Logout</strong>
          </button>
        </div>
      </nav>
      <div className='container'>
        <div className='row mt-3 justify-content-center'>
          <div className='col-md-9 '>
            <h2>
              {event.name} - {getDate(event.date)}
            </h2>
          </div>
        </div>
        <div className='row mt-3 justify-content-center'>
          <div className='col-md-9 d-flex justify-content-between'>
            <h3 className=''>Reminders</h3>

            <button
              className='btn btn-primary w-auto'
              onClick={openCreateReminderModal}
            >
              Add Reminder
            </button>
          </div>
        </div>
        <div className='row justify-content-center mt-5'>
          {noReminders && (
            <div className='col-md-9'>No reminders for this event.</div>
          )}
          {!noReminders && (
            <div className='col-md-9'>
              <table className='table ps-5'>
                <thead className='thead-dark'>
                  <tr>
                    <th scope='col'>Date</th>
                    <th scope='col'>Message</th>
                    {/* <th scope='col'>Last</th> */}
                    <th scope='col'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reminders.map(reminder => (
                    <tr key={reminder.reminder_id}>
                      <td>{getDate(reminder.date)}</td>
                      <td>{reminder.message}</td>
                      <td>
                        {/* <button
                        className='btn btn-primary me-3'
                        onClick={() => navigate('/reminders/' + reminder.event_id)}
                      >
                        View Reminders
                      </button> */}
                        <button
                          className='btn btn-primary me-3'
                          onClick={() => openEditReminderModal(reminder)}
                        >
                          Edit
                        </button>
                        <button
                          className='btn btn-danger'
                          onClick={() => handleDeleteEvent(reminder)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reminders
