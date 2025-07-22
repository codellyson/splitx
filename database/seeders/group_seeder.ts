import Group from '#models/group'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Get the first few users to create groups
    const users = await User.all()

    if (users.length === 0) {
      console.log('⚠️  No users found. Please run the user seeder first.')
      return
    }

    const groups = [
      {
        name: 'Weekend Trip to Vegas',
        description: 'Annual friends trip to Las Vegas - hotels, food, and entertainment',
        created_by: users[0].id, // John Smith
      },
      {
        name: 'Apartment Rent & Utilities',
        description: 'Monthly shared expenses for our apartment',
        created_by: users[1].id, // Sarah Johnson
      },
      {
        name: 'Office Lunch Club',
        description: 'Weekly team lunches and coffee runs',
        created_by: users[2].id, // Mike Davis
      },
      {
        name: 'Birthday Party Planning',
        description: "Planning expenses for Lisa's surprise birthday party",
        created_by: users[3].id, // Emily Wilson
      },
      {
        name: 'Road Trip to National Parks',
        description: 'Gas, food, and camping expenses for our summer road trip',
        created_by: users[4].id, // David Brown
      },
    ]

    for (const groupData of groups) {
      await Group.create(groupData)
    }

    console.log('✅ Groups seeded successfully!')
  }
}
