import { Image, StyleSheet, Button, View, Text, TouchableOpacity, ScrollView } from "react-native"
import { useState, useEffect, useCallback } from 'react'
import { useLocalSearchParams, useFocusEffect, router } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AntDesign from '@expo/vector-icons/AntDesign';

import images from '../../assets/images'

import ButtonPrimary from '../../components/buttons/ButtonPrimary'
import ButtonSecondary from '../../components/buttons/ButtonSecondary'

import defaults from '../../lib/defaults'

const HomeScreen = () => {

  const insets = useSafeAreaInsets()

  // const teams = ['readings', 'xlfc1']
  const [teams, setTeams] = useState([])
  const [account, setAccount] = useState(null)
  const [firstName, setFirstName] = useState('')

  useFocusEffect(
    useCallback(() => { refresh() }, [])
  )

  async function refresh(){
    setFirstName(await AsyncStorage.getItem('first_name'))
    const account = await AsyncStorage.getItem('account')
    setAccount(account)
    
    defaults.get(account == 'admin' ? 'fetchAllTeams' : 'fetchCoachTeams', {}, null, (response) => {
      setTeams(response.data)
      if (response.data.length == 0)
        router.push({
          pathname: '/success',
          params: {
            message: 'Your Account has been created.\nPlease wait while admin approves'
          }
        })
    })
  }

  async function logOut(){
    await AsyncStorage.removeItem('auth_token')
    router.replace('/login')
  }

  return (
    <GestureHandlerRootView>
      <View className="bg-[#1D82C6] h-full flex flex-col" style={{ paddingTop: insets.top }}>
        <Image
          source={images.lionHead}
          className="h-[72] mx-auto"
          resizeMode="contain"
        />
        <View className="flex flex-row items-center mx-4 mb-4">
          <Image
            source={images.dummy.ronaldo}
            className="h-[52] w-[52]"
          />
          <View className="mx-4 flex-1">
            <Text className="text-white">Hello,</Text>
            <Text className="text-white font-bold text-xl">{firstName}</Text>
          </View>
          <TouchableOpacity className="w-[42] h-[42] rounded-xl border-[1px] border-[#FFFFFF] flex items-center justify-center" onPress={logOut}>
            <Image
              source={images.feedback.logout}
              className="h-[24] w-[24] ml-1"
            />
          </TouchableOpacity>
        </View>
        <View className="bg-white flex-1 rounded-t-[33.3px] overflow-hidden">
          <ScrollView className="px-4">
            {/* <Text className="text-xl font-bold mt-6">New</Text>

            <View className="border-[1px] border-[#E4E4E4] mt-4 rounded-2xl p-4 bg-[#F0F0F1] flex flex-row items-center">
              <View className="flex-1">
                <Text className="text-base font-semibold mb-2">New Coach</Text>
                <View className="flex-row items-center">
                  <Image
                    source={images.dummy.mourinho}
                    className="h-[57] w-[57] rounded-full"
                    resizeMode="contain"
                  />
                  <View className="mx-2.5 flex-1">
                    <Text className="font-bold text-lg">Jose Mourinho</Text>
                    <Text className="text-gray-500 text-xs">Readings XLFC</Text>
                  </View>
                </View>
              </View>
              <View className="space-y-2.5">
                <ButtonSecondary 
                  text="Accept"
                  outlineColor="#1D82C6"
                  backgroundColor="#1D82C6"
                  textColor="white"
                  style="mb-2"
                />
                <ButtonSecondary 
                  text="Decline"
                  outlineColor="#F96C75"
                  backgroundColor="#F96C75"
                  textColor="white"
                  style="mt-2"
                />
              </View>
            </View> */}

            <Text className="text-xl font-bold mt-6">Teams</Text>

            {teams.map(team => (
              <TouchableOpacity key={team.id} className="border-[1px] border-[#E4E4E4] mt-4 rounded-2xl p-4" onPress={() => {
                switch (account){
                  case 'admin':
                    router.push({
                      pathname: '/new-team',
                      params: {
                        id: team.id,
                        old_name: team.name,
                        old_description: team.description
                      }
                    })
                    break
                }
              }}>
                <View className="flex-row items-center">
                  <Image
                    // source={images.dummy[team]}
                    source={images.dummy.readings}
                    className="h-[57] w-[57]"
                    resizeMode="contain"
                  />
                  <View className="mx-2.5 flex-1">
                    <Text className="font-bold text-lg">{team.name}</Text>
                    {team.description && <Text className="text-gray-500 text-xs">{team.description}</Text>}
                  </View>
                </View>
                <View className="flex-row gap-4 mt-0">
                  <Text className="text-gray-500 font-semibold">Members: <Text className="text-[#56D262] text-lg font-black">21</Text></Text>
                  <Text className="text-gray-500 font-semibold">Total Points: <Text className="text-[#56D262] text-lg font-black">912</Text></Text>
                </View>
              </TouchableOpacity>
            ))}

            {account == 'coach' && teams.length == 0 && <Text className="my-6 font-semibold">{`Your Account has been created.\nPlease wait while admin approves`}</Text>}
            <View className="mb-6" />
          </ScrollView>
        </View>
      </View>
      {/* {account == 'admin' && <ButtonPrimary
        containerProps="absolute bottom-[25px] right-[25px]"
        onPress={() => router.push('/new-team')}
        leftView={
          <AntDesign name="plus" size={32} color="white" style={{ paddingHorizontal: 12 }} />
        }
      />} */}
    </GestureHandlerRootView>
  )
}

export default HomeScreen