import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Create test users with realistic data
    const users = [
      {
        full_name: 'John Smith',
        email: 'john@example.com',
        password: 'password123',
      },
      {
        full_name: 'Sarah Johnson',
        email: 'sarah@example.com',
        password: 'password123',
      },
      {
        full_name: 'Mike Davis',
        email: 'mike@example.com',
        password: 'password123',
      },
      {
        full_name: 'Emily Wilson',
        email: 'emily@example.com',
        password: 'password123',
      },
      {
        full_name: 'David Brown',
        email: 'david@example.com',
        password: 'password123',
      },
      {
        full_name: 'Lisa Anderson',
        email: 'lisa@example.com',
        password: 'password123',
      },
      {
        full_name: 'Tom Martinez',
        email: 'tom@example.com',
        password: 'password123',
      },
      {
        full_name: 'Rachel Green',
        email: 'rachel@example.com',
        password: 'password123',
      },
    ]

    for (const userData of users) {
      // Hash the password before creating the user
      const hashedPassword = await hash.make(userData.password)

      await User.create({
        full_name: userData.full_name,
        email: userData.email,
        password: hashedPassword,
      })
    }

    console.log('✅ Users seeded successfully!')
  }
}
