import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import router from "./router.jsx";

import { ChakraProvider } from '@chakra-ui/react'
import {ContextProvider} from './contexts/ContextProvider'
import { RouterProvider } from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <ContextProvider>
          <RouterProvider router={router} />
      </ContextProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
