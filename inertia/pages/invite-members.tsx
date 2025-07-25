import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import Header from '../components/header'
import Footer from '../components/footer'
import User from '#models/user'
import Group from '#models/group'
import GroupInvitation from '#models/group_invitation'

export default function InviteMembers({
  user,
  group,
  pendingInvitations,
}: {
  user: User
  group: Group
  pendingInvitations: GroupInvitation[]
}) {
  const [inviteData, setInviteData] = useState({
    email: '',
    nickname: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      router.post(`/groups/${group.id}/invite`, inviteData, {
        onSuccess: () => {
          setInviteData({ email: '', nickname: '' })
          setIsSubmitting(false)
        },
        onError: () => {
          console.error('Failed to send invitation')
          setIsSubmitting(false)
        },
      })
    } catch (error) {
      console.error('Failed to send invitation:', error)
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.visit(`/groups/${group.id}`)
  }

  const handleCopyInviteLink = (invitation: GroupInvitation) => {
    const inviteLink = `${window.location.origin}/invite/${invitation.token}`
    navigator.clipboard.writeText(inviteLink)
    // You could add a toast notification here
    alert('Invite link copied to clipboard!')
  }

  return (
    <>
      <Head title="Invite Members - SplitX" />

      <div className="min-h-screen bg-gray-50">
        <Header auth={user} />

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={handleCancel}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Invite Members</h1>
                <p className="text-gray-600 mt-1">Invite friends to join {group.name}</p>
              </div>
            </div>
          </div>

          {/* Invite Form */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Send Invitation</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  placeholder="friend@example.com"
                />
              </div>

              {/* Nickname */}
              <div>
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
                  Nickname (Optional)
                </label>
                <input
                  type="text"
                  id="nickname"
                  name="nickname"
                  value={inviteData.nickname}
                  onChange={(e) => setInviteData({ ...inviteData, nickname: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  placeholder="e.g., John, Sarah"
                />
                <p className="text-sm text-gray-500 mt-1">
                  This will be their display name in the group
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>

          {/* Pending Invitations */}
          {pendingInvitations.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Pending Invitations</h2>
              <div className="space-y-4">
                {pendingInvitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{invitation.email}</h3>
                        {invitation.nickname && (
                          <p className="text-sm text-gray-600">Nickname: {invitation.nickname}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          Invited {new Date(invitation.created_at.toString()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyInviteLink(invitation)}
                      className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors font-medium text-sm"
                    >
                      Copy Link
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="bg-blue-50 rounded-lg p-6 mt-8">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-blue-800 mb-2">How it works</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Invitations are sent via email with a secure link</li>
                  <li>• Invitations expire after 7 days</li>
                  <li>• Recipients can accept or decline the invitation</li>
                  <li>• You can copy and share the invite link manually</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
