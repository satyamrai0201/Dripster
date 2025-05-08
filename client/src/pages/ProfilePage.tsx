import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Avatar from '@/components/ui/avatar';

interface UserProfile {
  displayName: string;
  primaryPhone: string;
  secondaryPhone: string;
}

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<UserProfile>({
    displayName: '',
    primaryPhone: '',
    secondaryPhone: ''
  });
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const initials = (currentUser?.displayName || currentUser?.email || 'U')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Load user data on mount and when currentUser changes
  useEffect(() => {
    if (currentUser) {
      const savedProfile = JSON.parse(localStorage.getItem('user-profile') || '{}');
      setFormData({
        displayName: currentUser.displayName || '',
        primaryPhone: savedProfile.primaryPhone || '',
        secondaryPhone: savedProfile.secondaryPhone || ''
      });
    }
  }, [currentUser]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setIsSaving(true);
    
    try {
      await updateProfile(currentUser, { displayName: formData.displayName });
      
      // Save phone numbers to localStorage
      localStorage.setItem('user-profile', JSON.stringify({
        primaryPhone: formData.primaryPhone,
        secondaryPhone: formData.secondaryPhone
      }));
      
      setEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    const savedProfile = JSON.parse(localStorage.getItem('user-profile') || '{}');
    setFormData({
      displayName: currentUser?.displayName || '',
      primaryPhone: savedProfile.primaryPhone || '',
      secondaryPhone: savedProfile.secondaryPhone || ''
    });
    setEditing(false);
  };

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-8 bg-zinc-900 rounded-2xl border border-zinc-700 text-white text-center">
        <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 py-12 px-2">
      <div className="max-w-3xl mx-auto bg-zinc-900/90 rounded-3xl border border-zinc-700 shadow-2xl p-10 md:p-16 backdrop-blur-xl">
        <h1 className="text-4xl font-extrabold mb-10 text-white font-montserrat">Your Profile</h1>
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-12">
          <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-red-500 bg-zinc-800 shadow-lg flex items-center justify-center">
            <Avatar 
              photoURL={currentUser.photoURL || undefined}
              displayName={currentUser.displayName || undefined}
              email={currentUser.email || undefined}
              size={128} 
            />
          </div>

          <div className="flex-1 w-full">
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block mb-2 text-zinc-300 font-medium">Display Name</label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={e => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  disabled={!editing}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block mb-2 text-zinc-300 font-medium">Primary Phone Number</label>
                <input
                  type="tel"
                  value={formData.primaryPhone}
                  onChange={e => setFormData(prev => ({ ...prev, primaryPhone: e.target.value }))}
                  disabled={!editing}
                  pattern="[0-9]{10}"
                  maxLength={10}
                  placeholder="Enter 10-digit phone number"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block mb-2 text-zinc-300 font-medium">Secondary Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={formData.secondaryPhone}
                  onChange={e => setFormData(prev => ({ ...prev, secondaryPhone: e.target.value }))}
                  disabled={!editing}
                  pattern="[0-9]{10}"
                  maxLength={10}
                  placeholder="Enter 10-digit phone number"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex justify-end gap-3">
                {!editing ? (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 bg-zinc-700/80 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-4 py-2 bg-green-500/80 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">Account Details</h2>
          <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50 space-y-3">
            <div>
              <span className="text-zinc-400">Email: </span>
              <span className="text-white">{currentUser.email}</span>
            </div>
            {formData.primaryPhone && (
              <div>
                <span className="text-zinc-400">Primary Phone: </span>
                <span className="text-white">{formData.primaryPhone}</span>
              </div>
            )}
            {formData.secondaryPhone && (
              <div>
                <span className="text-zinc-400">Secondary Phone: </span>
                <span className="text-white">{formData.secondaryPhone}</span>
              </div>
            )}
            <div>
              <span className="text-zinc-400">Account Created: </span>
              <span className="text-white">{new Date(currentUser.metadata.creationTime || '').toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-zinc-400">Last Sign-in: </span>
              <span className="text-white">{new Date(currentUser.metadata.lastSignInTime || '').toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;