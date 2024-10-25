import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useFocusEffect, router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

import DefaultInput from '../../components/inputs/DefaultInput'
import TopNavAction from '../../components/main/TopNavAction'
import ButtonPrimary from '../../components/buttons/ButtonPrimary'

import images from '../../assets/images'

import defaults from '../../lib/defaults'

const RoleScreen = () => {

  const [selectedAccount, setSelectedAccount] = useState(null)
  const [inProgress, setInProgress] = useState(false)

  const accounts = [
    {
      account: 'player',
      subTitle: 'Lorem Ipsum is simply dummy text.',
      image: images.dummy.player,
      endpoint: 'becomePlayer'
    },
    {
      account: 'coach',
      subTitle: 'Lorem Ipsum is simply dummy text.',
      image: images.dummy.manager,
      endpoint: 'assignUserAsCoach'
    },
    {
      account: 'admin',
      subTitle: 'Lorem Ipsum is simply dummy text.',
      image: images.dummy.admin,
      endpoint: 'createAdmin'
    }
  ]

  function setAccountType(){
    if (!selectedAccount)
      return defaults.simpleAlert('Error', 'Please select your role')

    const account = accounts.find(a => a.account == selectedAccount)

    defaults.post(account.endpoint, {}, setInProgress, async (response) => {
      await AsyncStorage.setItem('account', account.account)
      router.replace('/')
    })
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="bg-white h-full">
        <TopNavAction title="Role Selection" />
        <ScrollView>
          {accounts.map(account => (
            <TouchableOpacity key={account.account} className="flex flex-row mx-4 my-2.5 p-4 border-[1px] items-center rounded-3xl" style={{ borderColor: account.account == selectedAccount ? 'blue' : '#E4E4E4' }} onPress={() => setSelectedAccount(account.account)}> 
              <View className="flex-1 space-y-2">
                <Text className="text-xl font-bold capitalize">{account.account}</Text>
                <Text className="font-light">{account.subTitle}</Text>
              </View>
              <Image
                source={account.image}
                className="w-[60px] h-[60px]"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ButtonPrimary 
          text="Create Account"
          containerProps="mx-4 my-4"
          inProgress={inProgress}
          onPress={() => setAccountType()}
          // onPress={() => router.push({
          //   pathname: '/success',
          //   params: {
          //     message: 'Your Account has been created'
          //   }
          // })}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default RoleScreen