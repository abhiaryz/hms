# Hotel Management System - Feature Interconnections

## Booking to Room Assignment Flow

1. **Initial Booking Creation**
   - Guest fills out booking form with check-in/out dates, room type, and guest information
   - System checks room availability for the requested dates
   - Booking is created with a unique booking ID

2. **Room Assignment**
   - System automatically assigns an available room of the requested type
   - Room status changes from "vacant" to "reserved"
   - Booking is linked to the assigned room via room ID
   - Guest receives confirmation with room number and booking details

3. **Check-in Process**
   - Guest arrives at the hotel
   - Front desk staff verifies booking and guest identity
   - Room status changes from "reserved" to "occupied"
   - Guest is provided with room key and hotel information

4. **During Stay**
   - Room status remains "occupied" throughout the stay
   - Guest can request additional services (housekeeping, amenities, room service)
   - All services are linked to the room number and booking ID

5. **Check-out Process**
   - Guest checks out
   - Room status changes from "occupied" to "cleaning"
   - Housekeeping is notified to clean the room
   - After cleaning, room status changes to "vacant"
   - Final bill is generated including room charges and all additional services

## Food Order Integration

1. **Order Creation**
   - Guest or staff places a food order through the room service page
   - Order is linked to the room number and booking ID
   - Order status is set to "pending"

2. **Order Processing**
   - Kitchen staff receives the order
   - Order is prepared according to specifications
   - Order status changes to "preparing"

3. **Order Delivery**
   - Food is delivered to the specified room
   - Order status changes to "delivered"
   - Order details are added to the room's food orders list

4. **Billing Integration**
   - Food order charges are automatically added to the room's bill
   - Charges appear in the "Food Charges" section of the room's total bills
   - Charges are included in the final bill upon check-out

## Data Flow Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Booking    │────▶│  Room       │────▶│  Food       │
│  Created    │     │  Assigned   │     │  Order      │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Check-in   │────▶│  During     │────▶│  Order      │
│  Process    │     │  Stay       │     │  Delivered  │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Check-out  │────▶│  Room       │────▶│  Final      │
│  Process    │     │  Available  │     │  Bill       │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Implementation Details

### Booking to Room Assignment

- When a booking is created, the system searches for available rooms of the requested type
- The room assignment process updates both the booking record and the room record
- Room status transitions: vacant → reserved → occupied → cleaning → vacant

### Food Order Integration

- Food orders are created with a reference to the room number and booking ID
- Orders are tracked with status updates: pending → preparing → delivered
- All food charges are automatically added to the room's bill
- The room detail page displays all food orders associated with the room

### Billing Integration

- Room charges are calculated based on the length of stay and room rate
- Food charges are the sum of all food orders
- Additional charges may include amenities, services, or damages
- The final bill includes all charges and payment status

## User Interface Integration

- Room status page shows all rooms with their current status
- Clicking on a room navigates to the room detail page
- Room detail page shows guest information, food orders, and total bills
- "Add Food Order" button on the room detail page navigates to the room service page with the room number pre-filled 