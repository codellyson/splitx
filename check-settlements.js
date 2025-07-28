import { Database } from '@adonisjs/lucid/database'
import { DateTime } from 'luxon'

async function checkSettlements() {
  try {
    const settlements = await Database.from('settlements').select('*')

    console.log('Current settlements in database:')
    console.log('='.repeat(80))

    settlements.forEach((settlement, index) => {
      console.log(`Settlement ${index + 1}:`)
      console.log(`  ID: ${settlement.id}`)
      console.log(`  Payment Type: ${settlement.payment_type}`)
      console.log(`  Method: ${settlement.method}`)
      console.log(`  Status: ${settlement.status}`)
      console.log(`  Amount: ${settlement.amount}`)
      console.log(`  From User: ${settlement.from_user}`)
      console.log(`  To User: ${settlement.to_user}`)
      console.log(`  Created: ${settlement.created_at}`)
      console.log(`  Paid At: ${settlement.paid_at}`)
      console.log(`  Payment Notes: ${settlement.payment_notes}`)
      console.log(`  Payment Reference: ${settlement.payment_reference}`)
      console.log(`  Transaction ID: ${settlement.transaction_id}`)
      console.log('')
    })

    console.log(`Total settlements: ${settlements.length}`)

    const manualSettlements = settlements.filter((s) => s.payment_type === 'manual')
    const automaticSettlements = settlements.filter((s) => s.payment_type === 'automatic')
    const nullSettlements = settlements.filter((s) => !s.payment_type)

    console.log(`Manual settlements: ${manualSettlements.length}`)
    console.log(`Automatic settlements: ${automaticSettlements.length}`)
    console.log(`Null payment_type: ${nullSettlements.length}`)
  } catch (error) {
    console.error('Error checking settlements:', error)
  } finally {
    await Database.manager.closeAll()
  }
}

checkSettlements()
