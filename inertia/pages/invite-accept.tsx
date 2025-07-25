import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import Header from '../components/header'
import Footer from '../components/footer'
import User from '#models/user'
import Group from '#models/group'
import GroupInvitation from '#models/group_invitation'

export default function InviteAccept({
  user,
  group,
  invitation,
}: {
  user: User
  group: Group
  invitation: GroupInvitation
}) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAccept = async () => {
    setIsProcessing(true)
    try {
      await router.get(`/invite/${invitation.token}/accept`)
    } catch (error) {
      console.error('Failed to accept invitation:', error)
      setIsProcessing(false)
    }
  }

  const handleDecline = async () => {
    setIsProcessing(true)
    try {
      await router.get(`/invite/${invitation.token}/decline`)
    } catch (error) {
      console.error('Failed to decline invitation:', error)
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Head title="Group Invitation - SplitX" />

      <div className="min-h-screen bg-gray-50">
        <Header auth={user} />

        {/* Main Content */}
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-800 mb-2">You're Invited!</h1>
            <p className="text-gray-600 mb-6">You've been invited to join a group on SplitX</p>

            {/* Group Info */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{group.name}</h2>
              {group.description && <p className="text-gray-600 mb-4">{group.description}</p>}
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <span>Invited by: {invitation.invitedByUser?.full_name || 'Unknown'}</span>
                <span>•</span>
                <span>{new Date(invitation.created_at.toString()).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAccept}
                disabled={isProcessing}
                className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Joining...' : 'Accept Invitation'}
              </button>
              <button
                onClick={handleDecline}
                disabled={isProcessing}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Decline Invitation'}
              </button>
            </div>

            {/* Info */}
            <div className="mt-8 text-sm text-gray-500">
              <p>By accepting, you'll be able to:</p>
              <ul className="mt-2 space-y-1">
                <li>• View and add expenses to the group</li>
                <li>• Split costs with other members</li>
                <li>• Track balances and settlements</li>
              </ul>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
