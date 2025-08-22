import UseColorTheme from '@/hooks/UseColorTheme'
import { FontAwesome } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'

const _layout = () => {
    const colorScheme = UseColorTheme()

  return (

      <Tabs
        screenOptions={{
          headerShown: false, // Hides the top navigation bar
          tabBarStyle: {
            backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF',
            borderTopWidth: 0,
            elevation: 0,
            height: 60,
            paddingBottom: 8
          },
          tabBarActiveTintColor: colorScheme === 'dark' ? '#4FB6FF' : '#007AFF',
          tabBarInactiveTintColor: colorScheme === 'dark' ? '#888888' : '#999999',
        }}>
        <Tabs.Screen
          name="Predictions"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="home" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
  )
}

export default _layout
