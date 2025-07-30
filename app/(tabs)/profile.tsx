import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { SettingsStyles } from '@/styles/cardStyles'
import { icons } from '@/constants/icons'
import { auth } from '@/firebaseConfig'
import { signOut } from 'firebase/auth'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { useProfilePicture } from '@/hooks/useProfilePicture'

function GradientHeaderWorkout() {
  return (
    <View style={{ position: 'relative', width: '100%', height: 140 }}>
      <LinearGradient
        colors={['#0f2027', '#203a43', '#2c5364']}
        locations={[0, 0.7, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          position: 'absolute',
          width: '100%',
          height: 140,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      />
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60 }}>
      </View>
    </View>
  );
}

const profile = () => {
  const router = useRouter();
  const { profilePic } = useProfilePicture();

  const handleLogOut = async () => {
    try{
      await signOut(auth);
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!auth.currentUser) {
    return (
      <View className='flex-1 justify-center items-center bg-gray-900'>
        <Text className='text-white text-lg'>Not logged in</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-[#101827]'>
      <View style={{ position: 'relative' }}>
        <GradientHeaderWorkout />
        <Image
          source={profilePic}
          style={{
            width: 96,
            height: 96,
            borderRadius: 9999,
            borderWidth: 1,
            borderColor: '#101827',
            position: 'absolute',
            alignSelf: 'center',
            top: 90, // half overlaps the gradient
            zIndex: 2,
            backgroundColor: '#23232a',
          }}
        />
      </View>
      <View className='flex-1 justify-start items-center' style={{ marginTop: 60 }}>
        <Text className='text-2xl font-bold text-white mb-2'>{auth.currentUser.displayName || "Guest"}</Text>
        <View className="h-px bg-white/10 shadow-sm shadow-green-500/20 mx-4 mb-4" />
        <Text className='text-base text-gray-300 mb-4'>{auth.currentUser.email || "No email"}</Text>
        <TouchableOpacity  style={SettingsStyles.button} className='w-[85%] h-14 mt-5 flex-row justify-between items-center' onPress={() => router.push('/profile_settings/EditProfile')}>
          <Text className='text-white font-semibold ml-2'>Edit Profile</Text>
          <Image source={icons.rightArrow} style={{ width: 18, height: 18, tintColor: 'white' }} />
        </TouchableOpacity>
        <TouchableOpacity  style={SettingsStyles.button} className='w-[85%] h-14 mt-5 flex-row justify-between items-center' onPress={() => router.push('/profile_settings/PurchaseHistory')}>
          <Text className='text-white font-semibold ml-2'>Purchase History</Text>
          <Image source={icons.rightArrow} style={{ width: 18, height: 18, tintColor: 'white' }} />
        </TouchableOpacity>
        <TouchableOpacity  style={SettingsStyles.button} className='w-[85%] h-14 mt-5 flex-row justify-between items-center' onPress={() => router.push('/profile_settings/HelpSupport')}>
          <Text className='text-white font-semibold ml-2'>Help & Support</Text>
          <Image source={icons.rightArrow} style={{ width: 18, height: 18, tintColor: 'white' }} />
        </TouchableOpacity>
        <TouchableOpacity  style={SettingsStyles.button} className='w-[85%] h-14 mt-5 flex-row justify-between items-center' onPress={() => router.push('/profile_settings/InviteFriend')}>
          <Text className='text-white font-semibold ml-2'>Invite a Friend</Text>
          <Image source={icons.rightArrow} style={{ width: 18, height: 18, tintColor: 'white' }} />
        </TouchableOpacity>
        <TouchableOpacity  style={SettingsStyles.button} className='w-[85%] h-14 mt-5 flex-row justify-between items-center' onPress={handleLogOut}>
          <Text className='text-white font-semibold ml-2'>LogOut</Text>
          <Image source={icons.rightArrow} style={{ width: 18, height: 18, tintColor: 'white' }} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default profile