import Group from '#models/group'
import GroupMember from '#models/group_member'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    // Get all users and groups
    const users = await User.all()
    const groups = await Group.all()

    if (users.length === 0 || groups.length === 0) {
      console.log('⚠️  No users or groups found. Please run the user and group seeders first.')
      return
    }

    // Define group memberships for each group
    const groupMemberships = [
      // Weekend Trip to Vegas - 6 friends
      {
        group_id: groups[0].id,
        members: [
          { user_id: users[0].id, nickname: 'John' }, // John Smith
          { user_id: users[1].id, nickname: 'Sarah' }, // Sarah Johnson
          { user_id: users[2].id, nickname: 'Mike' }, // Mike Davis
          { user_id: users[3].id, nickname: 'Emily' }, // Emily Wilson
          { user_id: users[4].id, nickname: 'David' }, // David Brown
          { user_id: users[5].id, nickname: 'Lisa' }, // Lisa Anderson
        ],
      },
      // Apartment Rent & Utilities - 3 roommates
      {
        group_id: groups[1].id,
        members: [
          { user_id: users[1].id, nickname: 'Sarah' }, // Sarah Johnson
          { user_id: users[2].id, nickname: 'Mike' }, // Mike Davis
          { user_id: users[6].id, nickname: 'Tom' }, // Tom Martinez
        ],
      },
      // Office Lunch Club - 4 coworkers
      {
        group_id: groups[2].id,
        members: [
          { user_id: users[2].id, nickname: 'Mike' }, // Mike Davis
          { user_id: users[3].id, nickname: 'Emily' }, // Emily Wilson
          { user_id: users[4].id, nickname: 'David' }, // David Brown
          { user_id: users[7].id, nickname: 'Rachel' }, // Rachel Green
        ],
      },
      // Birthday Party Planning - 5 friends
      {
        group_id: groups[3].id,
        members: [
          { user_id: users[3].id, nickname: 'Emily' }, // Emily Wilson
          { user_id: users[0].id, nickname: 'John' }, // John Smith
          { user_id: users[1].id, nickname: 'Sarah' }, // Sarah Johnson
          { user_id: users[5].id, nickname: 'Lisa' }, // Lisa Anderson
          { user_id: users[6].id, nickname: 'Tom' }, // Tom Martinez
        ],
      },
      // Road Trip to National Parks - 4 friends
      {
        group_id: groups[4].id,
        members: [
          { user_id: users[4].id, nickname: 'David' }, // David Brown
          { user_id: users[0].id, nickname: 'John' }, // John Smith
          { user_id: users[2].id, nickname: 'Mike' }, // Mike Davis
          { user_id: users[7].id, nickname: 'Rachel' }, // Rachel Green
        ],
      },
    ]

    for (const groupMembership of groupMemberships) {
      for (const member of groupMembership.members) {
        await GroupMember.create({
          user_id: member.user_id,
          group_id: groupMembership.group_id,
          nickname: member.nickname,
          joined_at: DateTime.now(),
        })
      }
    }

    console.log('✅ Group members seeded successfully!')
  }
}
