const asyncHandler = require("express-async-handler")

const User = require("../models/userModel")
const Note = require("../models/noteModel")
const Ticket = require("../models/ticketModel")

// NOTE: no need to get the user, we already have them on req object from
// protect middleware. The protect middleware already checks for valid user.

// @desc    Get notes for a ticket
// @route   GET /api/tickets/:ticketId/notes
// @access  Private
const getNotes = asyncHandler(async (req, res) => {
  // Get user using the id in the JWT
  const user = await User.findById(req.user.id)

  if (!user) {
    res.status(401)
    throw new Error("User not found")
  }


  const ticket = await Ticket.findById(req.params.ticketId)

if (ticket.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Not Authorized')
}

const notes = await Note.find({ ticket: req.params.ticketId })


  res.status(200).json(notes)
})

// @desc    Creat ticket note
// @route   POST /api/tickets/:ticketId/:noteId
// @access  Private
const addNote = asyncHandler(async (req, res) => {
    // Get user using the id in the JWT
    const user = await User.findById(req.user.id)
  
    if (!user) {
      res.status(401)
      throw new Error("User not found")
    }
  
  
    const ticket = await Ticket.findById(req.params.ticketId)
  
  if (ticket.user.toString() !== req.user.id) {
      res.status(401)
      throw new Error('Not Authorized')
  }
  
  const note = await Note.create({ 
    text: req.body.text,
    isStaff: false,
    ticket: req.params.ticketId,
    user: req.user.id
})
  
  
    res.status(200).json(note)
  })

module.exports = {
    getNotes,
    addNote,
}