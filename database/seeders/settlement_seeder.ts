import Group from '#models/group'
import Settlement from '#models/settlement'
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

    const settlements = [
      // Weekend Trip to Vegas settlements
      {
        group_id: groups[0].id, // Weekend Trip to Vegas
        from_user: users[1].id, // Sarah Johnson
        to_user: users[0].id, // John Smith
        amount: 200.0,
        method: 'Venmo',
        note: 'Hotel booking reimbursement',
      },
      {
        group_id: groups[0].id,
        from_user: users[2].id, // Mike Davis
        to_user: users[1].id, // Sarah Johnson
        amount: 75.0,
        method: 'Cash',
        note: 'Dinner at Gordon Ramsay Steak',
      },
      {
        group_id: groups[0].id,
        from_user: users[3].id, // Emily Wilson
        to_user: users[2].id, // Mike Davis
        amount: 100.0,
        method: 'PayPal',
        note: 'Show tickets reimbursement',
      },

      // Apartment Rent & Utilities settlements
      {
        group_id: groups[1].id, // Apartment Rent & Utilities
        from_user: users[2].id, // Mike Davis
        to_user: users[1].id, // Sarah Johnson
        amount: 800.0,
        method: 'Bank Transfer',
        note: 'Monthly rent payment',
      },
      {
        group_id: groups[1].id,
        from_user: users[6].id, // Tom Martinez
        to_user: users[2].id, // Mike Davis
        amount: 40.0,
        method: 'Venmo',
        note: 'Electricity bill split',
      },

      // Office Lunch Club settlements
      {
        group_id: groups[2].id, // Office Lunch Club
        from_user: users[3].id, // Emily Wilson
        to_user: users[2].id, // Mike Davis
        amount: 23.75,
        method: 'Cash',
        note: 'Team lunch reimbursement',
      },
      {
        group_id: groups[2].id,
        from_user: users[4].id, // David Brown
        to_user: users[3].id, // Emily Wilson
        amount: 8.0,
        method: 'Venmo',
        note: 'Coffee run payment',
      },

      // Birthday Party Planning settlements
      {
        group_id: groups[3].id, // Birthday Party Planning
        from_user: users[0].id, // John Smith
        to_user: users[3].id, // Emily Wilson
        amount: 60.0,
        method: 'PayPal',
        note: 'Venue rental contribution',
      },
      {
        group_id: groups[3].id,
        from_user: users[1].id, // Sarah Johnson
        to_user: users[0].id, // John Smith
        amount: 90.0,
        method: 'Venmo',
        note: 'Catering contribution',
      },

      // Road Trip to National Parks settlements
      {
        group_id: groups[4].id, // Road Trip to National Parks
        from_user: users[0].id, // John Smith
        to_user: users[4].id, // David Brown
        amount: 80.0,
        method: 'Cash',
        note: 'Gas money for the trip',
      },
      {
        group_id: groups[4].id,
        from_user: users[2].id, // Mike Davis
        to_user: users[0].id, // John Smith
        amount: 45.0,
        method: 'Venmo',
        note: 'Camping gear rental split',
      },
    ]

    for (const settlementData of settlements) {
      await Settlement.create(settlementData)
    }

    console.log('✅ Settlements seeded successfully!')
  }
}
