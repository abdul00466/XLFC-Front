import { Alert, Linking } from 'react-native'
import { Tabs, Redirect, router, useFocusEffect } from 'expo-router'

import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import { fileTypeFromFile } from 'file-type'
import mime from 'mime'

import analytics from './analytics'
import constants from './constants'
import env from './env'

// import { setupNotifications } from '../lib/notification.js'

const request = async (endpoint, method, params, setInProgress, callback, failed, auth_token, fullUrl) => {
  const url = fullUrl ?? env.API_DOMAIN_WITH_ENDPOINT(endpoint) + `?`
  if (setInProgress) setInProgress(true)
  const token = auth_token ?? await AsyncStorage.getItem('auth_token') ?? ''
  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkcml2ZXJJZCI6IjY1NzNlYzhjNTAwMTdiN2NiNzU0OTZkMCIsInVzZXJJZCI6IjY1NTY5NjI1NDQyNWY2MWI0MzI4YmMzNCIsImlhdCI6MTcxNjM0ODIwMn0.TeYhdPyRPXr333rUQnBU_syQA8ZydqRyj4OhGuLF5T4'

  try {
    const response = await fetch(url + new URLSearchParams(method == 'GET' ? params : {}), {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
        'Authorization': token
      },
      body: method == 'POST' ? JSON.stringify(params) : null
    })

    if (setInProgress) setInProgress(false)

    const data = await response.json();

    if (!response.ok) {
      // response.text().then(async (text) => {
      //   if (response.status == 501 && text == 'sign-out'){
      //     // AsyncStorage.removeItem('auth_token')
      //     analytics.logEvent('log_out', {
      //       from: 'server'
      //     })
      //     analytics.initUser(null)
      //     return logOut()
      //   }

      //   Alert.alert('Error', text, [ { text: 'Okay' }], { cancelable: true })
      // })
      if (failed) 
        return failed()

      if (data.message)
        Alert.alert('Error', data.message, [ { text: 'Okay' }], { cancelable: true })

      return
    }

    console.log('Data', data)
    // You can save data to AsyncStorage, Redux store, or any state management solution here
    // console.log('Sign-in successful', data);

    if (callback) callback(data)

    // Example: Saving data to AsyncStorage (if required)
    // await AsyncStorage.setItem('userToken', data.token);

    // return data
  } catch (err) {
    const errorMessage = err.response?.data ?? err.message ?? err
    console.log('Error', errorMessage, url)
    // return { err_message: err.message || err }
    // return { err_message: errorMessage }
    Alert.alert('Error', errorMessage, [ { text: 'Okay' }], { cancelable: true })
  }
}

const post = (endpoint, params, setInProgress, callback, failed, token, fullUrl) => {
  request(endpoint, 'POST', params, setInProgress, callback, failed, token, fullUrl)
}

const get = (endpoint, params, setInProgress, callback, failed, token, fullUrl) => {
  request(endpoint, 'GET', params, setInProgress, callback, failed, token, fullUrl)
}

const upload = async (uri, directory, setInProgress, progressHandler, completed, failed) => {
  if (setInProgress) setInProgress(true)
  
  const formData = new FormData()
  const mimeType = mime.getType(uri)
  const url = `${env.API_DOMAIN}upload/file?directory=${directory}`
  
  formData.append('file', {
    uri: uri,
    name: uuidv4(),
    type: mimeType
  })

  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        // const progressPercent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        const progress = progressEvent.loaded /progressEvent.total
        if (progressHandler) progressHandler(progress)
        // setProgress(progressPercent);
      }
    })

    if (setInProgress) setInProgress(false)
    
    completed(response.data.fileName)
  } catch (error) {
    if (setInProgress) setInProgress(false)
    if (failed) failed(err.response?.data ?? err.message ?? err)
  }
}

async function logOut(){
  const auth_token = await AsyncStorage.getItem('auth_token')
  if (!auth_token) return

  post('user/sign-out', {
    token: auth_token
  }, null, async (response) => {
    await AsyncStorage.clear()
    router.replace('/starter')
  }, async () => {
    await AsyncStorage.clear()
    router.replace('/starter')
  })
}

const simpleAlert = (title, message, positive, onPress, negative = 'Cancel') => {
  const options = [
    {
      text: positive ?? 'Okay',
      onPress: onPress
    }
  ]
  if (positive && negative)
    options.push({
      text: negative
    })

  Alert.alert(title, message, options, { cancelable: true })
}

export default {
  post: post,
  get: get,
  logIn: async (email, password, setInProgress) => {
    post(null, {
      email: email,
      password: password,
      returnSecureToken: true
    }, setInProgress, async ({ idToken }) => {
      await AsyncStorage.setItem('auth_token', idToken)
      await AsyncStorage.setItem('email', email)

      // CHECK USER TYPE
      get('userInfo', {}, setInProgress, async (response) => {
        if (!response.account)
          return router.push('/role')

        await AsyncStorage.setItem('first_name', response.first_name)
        await AsyncStorage.setItem('sur_name', response.sur_name)
        await AsyncStorage.setItem('account', response.account)
        router.replace('/')
      })
    }, () => {
      simpleAlert('Invalid Login Credentials', 'You can tap on "Forgot Password" to recover your password or "Register Now" to create an account')
    }, null, `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${constants.FIREBASE_API_KEY}`)
  },
  logOut: logOut,
  upload: upload,
  copy: (i) => 
    JSON.parse(JSON.stringify(i)),
  call: (number) => 
    Linking.openURL(`tel:+${number}`),
  simpleAlert: simpleAlert,
  cString: (number, text, isOne) => {
    if (isOne)
      return `${number} ${number == 1 ? text : isOne}`

    return `${number} ${text}${number == 1 ? '' : 's'}`
  }
}