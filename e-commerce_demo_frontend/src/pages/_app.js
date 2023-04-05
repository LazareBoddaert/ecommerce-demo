import React from 'react'
import '@component/styles/globals.css'
import { Layout } from '../components'
import { ModalProvider } from '../context/modal-context'
import { StateContext } from '@component/context/StateContext'
import { Toaster } from 'react-hot-toast'

export default function App({ Component, pageProps }) {
  return (
    <ModalProvider>
      <StateContext>
        <Layout>
          <Toaster />
          <Component {...pageProps} />
        </Layout>
      </StateContext>
    </ModalProvider>
  )
}
