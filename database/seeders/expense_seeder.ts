import Expense from '#models/expense'
import Group from '#models/group'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Get all users and groups
    const users = await User.all()
    const groups = await Group.all()

    if (users.length === 0 || groups.length === 0) {
      console.log('⚠️  No users or groups found. Please run the user and group seeders first.')
      return
    }

    const expenses = [
      // Weekend Trip to Vegas expenses
      {
        group_id: groups[0].id, // Weekend Trip to Vegas
        title: 'Hotel Booking - Bellagio',
        description: '3 nights at Bellagio Hotel for the group',
        amount: 1200.0,
        paid_by: users[0].id, // John Smith
      },
      {
        group_id: groups[0].id,
        title: 'Dinner at Gordon Ramsay Steak',
        description: 'Group dinner at the famous steakhouse',
        amount: 450.0,
        paid_by: users[1].id, // Sarah Johnson
      },
      {
        group_id: groups[0].id,
        title: 'Show Tickets - Cirque du Soleil',
        description: 'Tickets for "O" show at Bellagio',
        amount: 600.0,
        paid_by: users[2].id, // Mike Davis
      },
      {
        group_id: groups[0].id,
        title: 'Uber Rides',
        description: 'Transportation around Vegas',
        amount: 180.0,
        paid_by: users[3].id, // Emily Wilson
      },

      // Apartment Rent & Utilities expenses
      {
        group_id: groups[1].id, // Apartment Rent & Utilities
        title: 'Monthly Rent',
        description: 'Apartment rent for March 2024',
        amount: 2400.0,
        paid_by: users[1].id, // Sarah Johnson
      },
      {
        group_id: groups[1].id,
        title: 'Electricity Bill',
        description: 'March electricity bill',
        amount: 120.0,
        paid_by: users[2].id, // Mike Davis
      },
      {
        group_id: groups[1].id,
        title: 'Internet & Cable',
        description: 'Monthly internet and cable service',
        amount: 85.0,
        paid_by: users[6].id, // Tom Martinez
      },

      // Office Lunch Club expenses
      {
        group_id: groups[2].id, // Office Lunch Club
        title: 'Team Lunch - Italian Restaurant',
        description: "Weekly team lunch at Luigi's",
        amount: 95.0,
        paid_by: users[2].id, // Mike Davis
      },
      {
        group_id: groups[2].id,
        title: 'Coffee Run',
        description: 'Starbucks coffee for the team',
        amount: 32.0,
        paid_by: users[3].id, // Emily Wilson
      },
      {
        group_id: groups[2].id,
        title: 'Pizza Friday',
        description: 'Friday pizza delivery for the office',
        amount: 78.0,
        paid_by: users[4].id, // David Brown
      },

      // Birthday Party Planning expenses
      {
        group_id: groups[3].id, // Birthday Party Planning
        title: 'Venue Rental',
        description: 'Community center rental for the party',
        amount: 300.0,
        paid_by: users[3].id, // Emily Wilson
      },
      {
        group_id: groups[3].id,
        title: 'Catering - Mexican Food',
        description: 'Taco bar catering for 30 people',
        amount: 450.0,
        paid_by: users[0].id, // John Smith
      },
      {
        group_id: groups[3].id,
        title: 'Decorations',
        description: 'Balloons, banners, and party decorations',
        amount: 85.0,
        paid_by: users[1].id, // Sarah Johnson
      },

      // Road Trip to National Parks expenses
      {
        group_id: groups[4].id, // Road Trip to National Parks
        title: 'Gas for the Trip',
        description: 'Fuel expenses for the entire road trip',
        amount: 320.0,
        paid_by: users[4].id, // David Brown
      },
      {
        group_id: groups[4].id,
        title: 'Camping Gear Rental',
        description: 'Tents, sleeping bags, and camping equipment',
        amount: 180.0,
        paid_by: users[0].id, // John Smith
      },
      {
        group_id: groups[4].id,
        title: 'Groceries for the Trip',
        description: 'Food and snacks for the camping trip',
        amount: 145.0,
        paid_by: users[2].id, // Mike Davis
      },
    ]

    for (const expenseData of expenses) {
      await Expense.create(expenseData)
    }

    console.log('✅ Expenses seeded successfully!')
  }
}
