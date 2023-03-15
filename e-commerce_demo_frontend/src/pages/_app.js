import React from 'react'
import '@component/styles/globals.css'
import { Layout } from '../components'
import { ModalProvider } from '../context/modal-context'

export default function App({ Component, pageProps }) {
  return (
    <ModalProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ModalProvider>
  )
}
