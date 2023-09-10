import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

const Events = () => {
  const navigate = useNavigate()
  const [noEvents, setNoEvents] = useState(false)
  const [events, setEvents] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newEvent, SetNewEvent] = useState({
    name: '',
    date: ''
  })

  const BASE_URL = localStorage.getItem('BASE_URL')

  const user = JSON.parse(localStorage.getItem('user'))

  console.log('user', user)

  const getEvents = async () => {
    const payload = {
      user_id: user['user_id']
    }
    const response = await fetch(BASE_URL + '/get-events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    const jsonData = await response.json() // Parse the response as JSON
    console.log(jsonData.body)
    if (jsonData.body.length > 0) {
      setNoEvents(false)
      setEvents(jsonData.body)
    } else {
      setNoEvents(true)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      getEvents()
    }, 500)
  }, [])

  const getDate = isoDateString => {
    const date = new Date(isoDateString)
    date.setHours(date.getHours() + 3)

    const year = date.getFullYear()
    const month = date.toLocaleString('default', { month: 'long' })
    const day = date.getDate()

    const formattedDate = `${month} ${day}, ${year}`
    console.log(formattedDate)
    return formattedDate
  }

  const openModal = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    SetNewEvent({
      name: '',
      date: ''
    })
    setShowModal(false)
  }

  const handleDeleteEvent = async event => {
    console.log('event in delete event', event)
    const payload = {
      event_id: event.event_id,
      user_id: user.user_id,
      email: user.email
    }
    closeModal()
    console.log('payload', payload)
    const response = await fetch(BASE_URL + '/delete-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    const jsonData = await response.json() // Parse the response as JSON
    console.log(jsonData.body)
    if (jsonData.statusCode === 200) {
      getEvents()
      alert('Event and its reminders deleted successfully')
    }
  }

  const handleCreateEvent = async event => {
    console.log('newEvent', newEvent)
    const payload = {
      name: newEvent.name,
      date: new Date(newEvent.date).toISOString(),
      user_id: user.user_id
    }
    closeModal()
    console.log('payload', payload)
    const response = await fetch(BASE_URL + '/create-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    const jsonData = await response.json() // Parse the response as JSON
    console.log(jsonData.body)
    if (jsonData.statusCode === 200) {
      getEvents()
      alert('Event created successfully')
    }
  }

  const handleLogout = async () => {
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
      {/* CREATE TEAM MODAL */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                type='text'
                value={newEvent.name}
                onChange={e =>
                  SetNewEvent({ ...newEvent, name: e.target.value })
                }
                placeholder='Enter event name'
              />
            </Form.Group>
            <Form.Group className='mt-4'>
              <Form.Label>Event Date</Form.Label>
              <Form.Control
                type='date'
                value={newEvent.date}
                onChange={e =>
                  SetNewEvent({ ...newEvent, date: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={closeModal}>
            Close
          </Button>
          <Button
            variant='primary'
            onClick={handleCreateEvent}
            disabled={!newEvent.name || !newEvent.date}
          >
            Create Event
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
        <div className='row mt-5 justify-content-center'>
          <div className='col-md-9 d-flex justify-content-between'>
            <h1 className=''>My Events</h1>

            <button className='btn btn-primary w-auto' onClick={openModal}>
              Create Event
            </button>
          </div>
        </div>
        <div className='row justify-content-center mt-5'>
          {noEvents && <div className='col-md-9'>No events added yet.</div>}
          {!noEvents && (
            <div className='col-md-9'>
              <table className='table ps-5'>
                <thead className='thead-dark'>
                  <tr>
                    <th scope='col'>Name</th>
                    <th scope='col'>Date</th>
                    {/* <th scope='col'>Last</th> */}
                    <th scope='col'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(event => (
                    <tr key={event.event_id}>
                      <td>{event.name}</td>
                      <td>{getDate(event.date)}</td>
                      <td>
                        <button
                          className='btn btn-primary me-3'
                          onClick={() =>
                            navigate('/reminders/' + event.event_id, {
                              state: {
                                event: event
                              }
                            })
                          }
                        >
                          View Reminders
                        </button>
                        <button
                          className='btn btn-danger'
                          onClick={() => handleDeleteEvent(event)}
                        >
                          Delete Event
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

export default Events
