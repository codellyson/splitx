import Expense from '#models/expense'
import ExpenseSplit from '#models/expense_split'
import GroupMember from '#models/group_member'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Get all expenses and group members
    const expenses = await Expense.all()
    const groupMembers = await GroupMember.all()

    if (expenses.length === 0 || groupMembers.length === 0) {
      console.log('⚠️  No expenses or group members found. Please run the previous seeders first.')
      return
    }

    // Define expense splits for each expense
    const expenseSplits = [
      // Hotel Booking - Bellagio (Weekend Trip to Vegas) - Split among 6 people
      {
        expense_id: expenses[0].id, // Hotel Booking - Bellagio
        splits: [
          { user_id: 1, amount_owed: 200.0 }, // John Smith
          { user_id: 2, amount_owed: 200.0 }, // Sarah Johnson
          { user_id: 3, amount_owed: 200.0 }, // Mike Davis
          { user_id: 4, amount_owed: 200.0 }, // Emily Wilson
          { user_id: 5, amount_owed: 200.0 }, // David Brown
          { user_id: 6, amount_owed: 200.0 }, // Lisa Anderson
        ],
      },
      // Dinner at Gordon Ramsay Steak - Split among 6 people
      {
        expense_id: expenses[1].id, // Dinner at Gordon Ramsay Steak
        splits: [
          { user_id: 1, amount_owed: 75.0 }, // John Smith
          { user_id: 2, amount_owed: 75.0 }, // Sarah Johnson
          { user_id: 3, amount_owed: 75.0 }, // Mike Davis
          { user_id: 4, amount_owed: 75.0 }, // Emily Wilson
          { user_id: 5, amount_owed: 75.0 }, // David Brown
          { user_id: 6, amount_owed: 75.0 }, // Lisa Anderson
        ],
      },
      // Show Tickets - Split among 6 people
      {
        expense_id: expenses[2].id, // Show Tickets - Cirque du Soleil
        splits: [
          { user_id: 1, amount_owed: 100.0 }, // John Smith
          { user_id: 2, amount_owed: 100.0 }, // Sarah Johnson
          { user_id: 3, amount_owed: 100.0 }, // Mike Davis
          { user_id: 4, amount_owed: 100.0 }, // Emily Wilson
          { user_id: 5, amount_owed: 100.0 }, // David Brown
          { user_id: 6, amount_owed: 100.0 }, // Lisa Anderson
        ],
      },
      // Uber Rides - Split among 6 people
      {
        expense_id: expenses[3].id, // Uber Rides
        splits: [
          { user_id: 1, amount_owed: 30.0 }, // John Smith
          { user_id: 2, amount_owed: 30.0 }, // Sarah Johnson
          { user_id: 3, amount_owed: 30.0 }, // Mike Davis
          { user_id: 4, amount_owed: 30.0 }, // Emily Wilson
          { user_id: 5, amount_owed: 30.0 }, // David Brown
          { user_id: 6, amount_owed: 30.0 }, // Lisa Anderson
        ],
      },

      // Monthly Rent - Split among 3 roommates
      {
        expense_id: expenses[4].id, // Monthly Rent
        splits: [
          { user_id: 2, amount_owed: 800.0 }, // Sarah Johnson
          { user_id: 3, amount_owed: 800.0 }, // Mike Davis
          { user_id: 7, amount_owed: 800.0 }, // Tom Martinez
        ],
      },
      // Electricity Bill - Split among 3 roommates
      {
        expense_id: expenses[5].id, // Electricity Bill
        splits: [
          { user_id: 2, amount_owed: 40.0 }, // Sarah Johnson
          { user_id: 3, amount_owed: 40.0 }, // Mike Davis
          { user_id: 7, amount_owed: 40.0 }, // Tom Martinez
        ],
      },
      // Internet & Cable - Split among 3 roommates
      {
        expense_id: expenses[6].id, // Internet & Cable
        splits: [
          { user_id: 2, amount_owed: 28.33 }, // Sarah Johnson
          { user_id: 3, amount_owed: 28.33 }, // Mike Davis
          { user_id: 7, amount_owed: 28.34 }, // Tom Martinez
        ],
      },

      // Team Lunch - Split among 4 coworkers
      {
        expense_id: expenses[7].id, // Team Lunch - Italian Restaurant
        splits: [
          { user_id: 3, amount_owed: 23.75 }, // Mike Davis
          { user_id: 4, amount_owed: 23.75 }, // Emily Wilson
          { user_id: 5, amount_owed: 23.75 }, // David Brown
          { user_id: 8, amount_owed: 23.75 }, // Rachel Green
        ],
      },
      // Coffee Run - Split among 4 coworkers
      {
        expense_id: expenses[8].id, // Coffee Run
        splits: [
          { user_id: 3, amount_owed: 8.0 }, // Mike Davis
          { user_id: 4, amount_owed: 8.0 }, // Emily Wilson
          { user_id: 5, amount_owed: 8.0 }, // David Brown
          { user_id: 8, amount_owed: 8.0 }, // Rachel Green
        ],
      },
      // Pizza Friday - Split among 4 coworkers
      {
        expense_id: expenses[9].id, // Pizza Friday
        splits: [
          { user_id: 3, amount_owed: 19.5 }, // Mike Davis
          { user_id: 4, amount_owed: 19.5 }, // Emily Wilson
          { user_id: 5, amount_owed: 19.5 }, // David Brown
          { user_id: 8, amount_owed: 19.5 }, // Rachel Green
        ],
      },

      // Venue Rental - Split among 5 friends
      {
        expense_id: expenses[10].id, // Venue Rental
        splits: [
          { user_id: 4, amount_owed: 60.0 }, // Emily Wilson
          { user_id: 1, amount_owed: 60.0 }, // John Smith
          { user_id: 2, amount_owed: 60.0 }, // Sarah Johnson
          { user_id: 6, amount_owed: 60.0 }, // Lisa Anderson
          { user_id: 7, amount_owed: 60.0 }, // Tom Martinez
        ],
      },
      // Catering - Split among 5 friends
      {
        expense_id: expenses[11].id, // Catering - Mexican Food
        splits: [
          { user_id: 4, amount_owed: 90.0 }, // Emily Wilson
          { user_id: 1, amount_owed: 90.0 }, // John Smith
          { user_id: 2, amount_owed: 90.0 }, // Sarah Johnson
          { user_id: 6, amount_owed: 90.0 }, // Lisa Anderson
          { user_id: 7, amount_owed: 90.0 }, // Tom Martinez
        ],
      },
      // Decorations - Split among 5 friends
      {
        expense_id: expenses[12].id, // Decorations
        splits: [
          { user_id: 4, amount_owed: 17.0 }, // Emily Wilson
          { user_id: 1, amount_owed: 17.0 }, // John Smith
          { user_id: 2, amount_owed: 17.0 }, // Sarah Johnson
          { user_id: 6, amount_owed: 17.0 }, // Lisa Anderson
          { user_id: 7, amount_owed: 17.0 }, // Tom Martinez
        ],
      },

      // Gas for the Trip - Split among 4 friends
      {
        expense_id: expenses[13].id, // Gas for the Trip
        splits: [
          { user_id: 5, amount_owed: 80.0 }, // David Brown
          { user_id: 1, amount_owed: 80.0 }, // John Smith
          { user_id: 3, amount_owed: 80.0 }, // Mike Davis
          { user_id: 8, amount_owed: 80.0 }, // Rachel Green
        ],
      },
      // Camping Gear Rental - Split among 4 friends
      {
        expense_id: expenses[14].id, // Camping Gear Rental
        splits: [
          { user_id: 5, amount_owed: 45.0 }, // David Brown
          { user_id: 1, amount_owed: 45.0 }, // John Smith
          { user_id: 3, amount_owed: 45.0 }, // Mike Davis
          { user_id: 8, amount_owed: 45.0 }, // Rachel Green
        ],
      },
      // Groceries for the Trip - Split among 4 friends
      {
        expense_id: expenses[15].id, // Groceries for the Trip
        splits: [
          { user_id: 5, amount_owed: 36.25 }, // David Brown
          { user_id: 1, amount_owed: 36.25 }, // John Smith
          { user_id: 3, amount_owed: 36.25 }, // Mike Davis
          { user_id: 8, amount_owed: 36.25 }, // Rachel Green
        ],
      },
    ]

    for (const expenseSplit of expenseSplits) {
      for (const split of expenseSplit.splits) {
        await ExpenseSplit.create({
          expense_id: expenseSplit.expense_id,
          user_id: split.user_id,
          amount_owed: split.amount_owed,
        })
      }
    }

    console.log('✅ Expense splits seeded successfully!')
  }
}
