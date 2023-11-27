import {ticketService} from "../src/pairtest/TicketService"

console.log()

test('adds 1 + 2 to equal 3', () => {
    let ticketPurchase = ticketService.purchaseTickets(4, [{noOfTicket: 5, ticketType: "ADULT"}, {noOfTicket: 2, ticketType: "CHILD"}, {noOfTicket: 2, ticketType: "INFANT"}])
  expect(ticketPurchase.totalAmount).toBe(120);
  expect(ticketPurchase.totalSeatsToAllocate).toBe(7)
});