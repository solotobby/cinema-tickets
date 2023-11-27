import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  #price = {
    infant: 0,
    child: 10,
    adult: 20
  }

  #no = Math.floor((Math.random() * 10) + 1);

  #ticketTypeRequests = []
  #LIMIT_PURCHASE = 20

  #requestTicket(arrayOfTicket){
    arrayOfTicket.forEach(ticket => {
      const request = new TicketTypeRequest(ticket.ticketType, ticket.noOfTicket)
      const noOfTicket = request.getNoOfTickets()
      const ticketType = request.getTicketType()

      this.#ticketTypeRequests.push({noOfTicket, ticketType})
    });
    return this.#ticketTypeRequests
  }

  #processTicketData(tickets){
    let numberOfInfants = 0;
    let numberOfChildren = 0;
    let numberOfAdults = 0;

    tickets.forEach(ticket => {
      if (ticket.ticketType == "ADULT") {
        numberOfAdults += ticket.noOfTicket
      } else if (ticket.ticketType == "CHILD") {
        numberOfChildren += ticket.noOfTicket
      } else {
        numberOfInfants += ticket.noOfTicket
      }
    })

    let totalNumberOfTicket = numberOfAdults + numberOfChildren + numberOfInfants;

    if(totalNumberOfTicket > this.#LIMIT_PURCHASE){
      throw new InvalidPurchaseException("You can not purchase more than 20 tickets at one booking")
    }

    if (numberOfChildren > numberOfAdults) {
      throw new InvalidPurchaseException("You can not purchase a child ticket without an adult")
    }
   
    const priceForChild = numberOfChildren * this.#price.child;
    const priceForAdult = numberOfAdults * this.#price.adult;
    const totalAmount = priceForChild + priceForAdult;

    return {
      totalAmount, numberOfChildren, numberOfAdults
    }
  }

  purchaseTickets(accountId, ticketTypeRequests) {
    const tickets = this.#requestTicket(ticketTypeRequests)

   let {totalAmount, numberOfChildren, numberOfAdults} = this.#processTicketData(tickets)
    
    const payment = new TicketPaymentService()
    payment.makePayment(this.#no, totalAmount)

    const totalSeatsToAllocate = numberOfChildren + numberOfAdults
    const seatReservation = new SeatReservationService()
    seatReservation.reserveSeat(this.#no, totalSeatsToAllocate)

    return {
      totalAmount, totalSeatsToAllocate
    }
  }
}

export const ticketService = new TicketService()
