import { View, Text, ScrollView, Image } from 'react-native'
import { useState, useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useFocusEffect, router } from 'expo-router'

import DefaultInput from '../../components/inputs/DefaultInput'
import TopNavAction from '../../components/main/TopNavAction'
import ButtonPrimary from '../../components/buttons/ButtonPrimary'

import ArrowDown from '../../assets/images/nav/arrow-down.svg'
import images from '../../assets/images'

import defaults from '../../lib/defaults'

const RegisterScreen = () => {

  // const [fullName, setFullName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [surName, setSurName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [inProgress, setInProgress] = useState(false)

  function createAccount(){
    // router.push('/more-info')
    // router.push('/role')
    defaults.post('createUser', {
      firstName: firstName,
      surName: surName,
      email: email,
      password: password,
      confirmPassword: confirmPassword
    }, setInProgress, (response) => {
      defaults.logIn(email, password, setInProgress)
    })
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="bg-white h-full">
        <TopNavAction title="Create Account" />
        <ScrollView>
          <DefaultInput 
            label="First Name"
            style="mx-4 my-3"
            placeholder="Enter First Name"
            text={firstName}
            setText={setFirstName}
          />
          <DefaultInput 
            label="Sur Name"
            style="mx-4 my-3"
            placeholder="Enter Sur Name"
            text={surName}
            setText={setSurName}
          />
          {/* <DefaultInput 
            label="Date Of Birth"
            style="mx-4 my-3"
            placeholder="Enter Date Of Birth"
            text={dateOfBirth}
            setText={setDateOfBirth}
            rightView={
              <Image
                source={images.inputs.calendar}
                className="w-[20] h-[20]"
              />
            }
          /> */}
          <DefaultInput 
            label="Email"
            style="mx-4 my-3"
            placeholder="Enter Email Address"
            text={email}
            setText={setEmail}
            keyboardType="email"
            autoCapitalize="none"
          />
          {/* <DefaultInput 
            label="Phone Number"
            style="mx-4 my-3"
            placeholder="+1 000 000 000"
            text={phoneNumber}
            setText={setPhoneNumber}
            leftView={
              <View className="flex flex-row items-center space-x-2">
                <Image
                  source={images.dummy.country_usa}
                  className="w-[22] h-[22]"
                />
                <ArrowDown color="#666666" />
              </View>
            }
          /> */}
          <DefaultInput 
            label="Password"
            style="mx-4 my-3"
            placeholder="Enter Password"
            text={password}
            setText={setPassword}
            secureTextEntry={true}
          />
          <DefaultInput 
            label="Confirm Password"
            style="mx-4 my-3"
            placeholder="Enter Password Again"
            text={confirmPassword}
            setText={setConfirmPassword}
            secureTextEntry={true}
          />
        </ScrollView>
        <ButtonPrimary 
          text="Continue"
          containerProps="mx-4 my-4"
          inProgress={inProgress}
          onPress={createAccount}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default RegisterScreen